import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { courseIds } = body

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: 'Course IDs are required' }, { status: 400 })
    }

    // 講座情報を取得
    const courses = await prisma.liveCourse.findMany({
      where: {
        id: { in: courseIds },
        isActive: true,
        isPublished: true
      }
    })

    if (courses.length !== courseIds.length) {
      return NextResponse.json({ error: 'Some courses not found' }, { status: 404 })
    }

    // 基本金額を計算
    const baseAmount = courses.reduce((sum, course) => sum + course.price, 0)

    // 適用可能な割引を取得
    const discountRules = await prisma.discountRule.findMany({
      where: {
        isActive: true,
        minCourses: { lte: courseIds.length }
      },
      orderBy: { discountValue: 'desc' }
    })

    const applicableDiscount = discountRules.find(rule => 
      courseIds.length >= rule.minCourses && 
      (!rule.maxCourses || courseIds.length <= rule.maxCourses)
    )

    const discountAmount = applicableDiscount ? applicableDiscount.discountValue : 0
    const finalAmount = baseAmount - discountAmount

    // ユーザー情報を取得
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Stripe CustomerがなければStripe Customer作成
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: {
          clerkId: userId,
          userId: user.id
        }
      })
      
      stripeCustomerId = customer.id
      
      // ユーザーのstripeCustomerIdを更新
      await prisma.user.update({
        where: { clerkId: userId },
        data: { stripeCustomerId }
      })
    }

    // PaymentIntentを作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'jpy',
      customer: stripeCustomerId,
      metadata: {
        userId,
        courseIds: JSON.stringify(courseIds),
        courseCount: courseIds.length.toString(),
        baseAmount: baseAmount.toString(),
        discountAmount: discountAmount.toString(),
        finalAmount: finalAmount.toString(),
        discountRuleId: applicableDiscount?.id || ''
      },
      description: `AI講座申し込み (${courseIds.length}講座)`,
      receipt_email: user.email
    })

    // Paymentレコードを作成
    const payment = await prisma.payment.create({
      data: {
        userId,
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId,
        amount: finalAmount,
        courseIds: JSON.stringify(courseIds),
        courseCount: courseIds.length,
        baseAmount,
        discountAmount,
        finalAmount,
        status: 'PENDING',
        metadata: JSON.stringify({
          discountRuleId: applicableDiscount?.id,
          discountRuleName: applicableDiscount?.name,
          courses: courses.map(c => ({
            id: c.id,
            title: c.title,
            price: c.price
          }))
        })
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      amount: finalAmount,
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        price: course.price,
        startDate: course.startDate
      })),
      discount: applicableDiscount ? {
        name: applicableDiscount.name,
        amount: discountAmount
      } : null
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}