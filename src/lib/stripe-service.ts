import Stripe from 'stripe'
import { prisma } from './prisma'
import { clerkClient } from '@clerk/nextjs/server'

export class StripeService {
  private stripe: Stripe

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('Stripe secret key is required')
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
      typescript: true
    })
  }

  /**
   * Create or retrieve Stripe customer
   */
  async createOrGetCustomer(userId: string, email: string, name?: string): Promise<string> {
    try {
      // Check if user already has a customer ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: { status: 'active' },
            select: { stripeCustomerId: true }
          }
        }
      })

      // Return existing customer ID if found
      const existingCustomerId = user?.subscriptions[0]?.stripeCustomerId
      if (existingCustomerId) {
        return existingCustomerId
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
          app: 'hajimete-ai'
        }
      })

      return customer.id
    } catch (error) {
      console.error('Error creating/getting customer:', error)
      throw new Error('Failed to create customer')
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(
    userId: string,
    planSlug: string,
    paymentMethodId?: string
  ): Promise<Stripe.Subscription> {
    try {
      // Get user and plan details
      const [user, plan] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true }
        }),
        prisma.subscriptionPlan.findUnique({
          where: { slug: planSlug }
        })
      ])

      if (!user || !plan) {
        throw new Error('User or plan not found')
      }

      // Create or get customer
      const customerId = await this.createOrGetCustomer(
        userId,
        user.email,
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
      )

      // Create subscription
      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{ price: plan.stripePriceIdMonthly || '' }],
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription' 
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          planSlug
        }
      }

      // Add payment method if provided
      if (paymentMethodId) {
        subscriptionData.default_payment_method = paymentMethodId
      }

      const subscription = await this.stripe.subscriptions.create(subscriptionData)

      return subscription
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to create subscription')
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    subscriptionId: string,
    newPriceId: string
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      
      return await this.stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: 'create_prorations'
      })
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw new Error('Failed to update subscription')
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, cancelImmediately = false): Promise<Stripe.Subscription> {
    try {
      if (cancelImmediately) {
        return await this.stripe.subscriptions.cancel(subscriptionId)
      } else {
        return await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        })
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  /**
   * Create payment intent for one-time payments
   */
  async createPaymentIntent(
    amount: number,
    currency = 'jpy',
    userId: string,
    description?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const customerId = await this.createOrGetCustomer(
        userId,
        user.email,
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim()
      )

      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        description,
        metadata: {
          userId
        }
      })
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription)
          break

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
          break

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
          break

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break

        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object as Stripe.Subscription)
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error('Error handling webhook:', error)
      throw error
    }
  }

  /**
   * Handle subscription created
   */
  private async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const userId = subscription.metadata.userId
      const planSlug = subscription.metadata.planSlug

      if (!userId || !planSlug) {
        console.error('Missing userId or planSlug in subscription metadata')
        return
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { slug: planSlug }
      })

      if (!plan) {
        console.error(`Plan not found: ${planSlug}`)
        return
      }

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId,
          planId: plan.id,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
          trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
        }
      })

      // Update user plan
      await prisma.user.update({
        where: { id: userId },
        data: { plan: planSlug }
      })

      // Update Clerk metadata
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          unsafeMetadata: {
            plan: planSlug,
            stripeCustomerId: subscription.customer as string
          }
        })
      } catch (clerkError) {
        console.error('Error updating Clerk metadata:', clerkError)
      }

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId,
          title: '🎉 サブスクリプション開始',
          message: `${plan.name}プランへようこそ！すべての機能をお楽しみください。`,
          type: 'success',
          actionUrl: '/dashboard'
        }
      })

      console.log(`✅ Subscription created for user ${userId}`)
    } catch (error) {
      console.error('Error handling subscription created:', error)
      throw error
    }
  }

  /**
   * Handle subscription updated
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    try {
      const userId = subscription.metadata.userId

      if (!userId) return

      // Update subscription in database
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
        }
      })

      // Update user status if subscription was canceled or reactivated
      if (subscription.status === 'canceled') {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'basic' }
        })

        await clerkClient.users.updateUserMetadata(userId, {
          unsafeMetadata: { plan: 'basic' }
        })
      }

      console.log(`✅ Subscription updated for user ${userId}`)
    } catch (error) {
      console.error('Error handling subscription updated:', error)
    }
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    try {
      const userId = subscription.metadata.userId

      if (!userId) return

      // Update subscription status
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'canceled',
          canceledAt: new Date()
        }
      })

      // Downgrade user to basic plan
      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'basic' }
      })

      // Update Clerk metadata
      await clerkClient.users.updateUserMetadata(userId, {
        unsafeMetadata: { plan: 'basic' }
      })

      // Create notification
      await prisma.notification.create({
        data: {
          userId,
          title: 'サブスクリプション終了',
          message: 'サブスクリプションがキャンセルされました。ベーシックプランに変更されました。',
          type: 'warning',
          actionUrl: '/plan-selection'
        }
      })

      console.log(`✅ Subscription deleted for user ${userId}`)
    } catch (error) {
      console.error('Error handling subscription deleted:', error)
    }
  }

  /**
   * Handle payment succeeded
   */
  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    try {
      const subscriptionId = invoice.subscription as string
      const customerId = invoice.customer as string

      // Get subscription from database
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
        include: { user: true, plan: true }
      })

      if (!subscription) return

      // Record payment
      await prisma.payment.create({
        data: {
          userId: subscription.userId,
          subscriptionId: subscription.id,
          stripePaymentIntentId: invoice.payment_intent as string,
          amount: invoice.amount_paid,
          currency: invoice.currency.toUpperCase(),
          status: 'succeeded',
          invoiceUrl: invoice.hosted_invoice_url,
          receiptUrl: invoice.receipt_number ? `https://pay.stripe.com/receipts/${invoice.receipt_number}` : null
        }
      })

      // Create payment notification
      await prisma.notification.create({
        data: {
          userId: subscription.userId,
          title: '💳 お支払い完了',
          message: `${subscription.plan.name}プランの料金 ¥${(invoice.amount_paid / 100).toLocaleString()} のお支払いが完了しました。`,
          type: 'success',
          actionUrl: '/dashboard'
        }
      })

      console.log(`✅ Payment succeeded for user ${subscription.userId}`)
    } catch (error) {
      console.error('Error handling payment succeeded:', error)
    }
  }

  /**
   * Handle payment failed
   */
  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    try {
      const subscriptionId = invoice.subscription as string

      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
        include: { user: true, plan: true }
      })

      if (!subscription) return

      // Create payment failure notification
      await prisma.notification.create({
        data: {
          userId: subscription.userId,
          title: '❌ お支払いエラー',
          message: 'お支払いに失敗しました。支払い方法を確認してください。',
          type: 'error',
          actionUrl: '/dashboard/billing'
        }
      })

      console.log(`❌ Payment failed for user ${subscription.userId}`)
    } catch (error) {
      console.error('Error handling payment failed:', error)
    }
  }

  /**
   * Handle trial will end
   */
  private async handleTrialWillEnd(subscription: Stripe.Subscription): Promise<void> {
    try {
      const userId = subscription.metadata.userId

      if (!userId) return

      await prisma.notification.create({
        data: {
          userId,
          title: '⏰ トライアル期間終了のお知らせ',
          message: 'トライアル期間が間もなく終了します。継続するには支払い方法を設定してください。',
          type: 'warning',
          actionUrl: '/dashboard/billing'
        }
      })

      console.log(`⏰ Trial will end for user ${userId}`)
    } catch (error) {
      console.error('Error handling trial will end:', error)
    }
  }

  /**
   * Get customer portal URL
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<string> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      })

      return session.url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw new Error('Failed to create portal session')
    }
  }

  /**
   * Get subscription usage/limits
   */
  async getSubscriptionUsage(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscriptions: {
            where: { status: 'active' },
            include: { plan: true }
          }
        }
      })

      if (!user || !user.subscriptions[0]) {
        return {
          plan: 'basic',
          features: ['基本動画視聴', '基本セミナー参加'],
          limits: {
            simultaneousStreams: 1,
            downloadEnabled: false,
            offlineViewing: false
          }
        }
      }

      const subscription = user.subscriptions[0]
      const plan = subscription.plan

      return {
        plan: plan.slug,
        features: plan.features,
        limits: {
          simultaneousStreams: plan.maxSimultaneousStreams,
          downloadEnabled: plan.downloadEnabled,
          offlineViewing: plan.offlineViewing
        },
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
        }
      }
    } catch (error) {
      console.error('Error getting subscription usage:', error)
      throw error
    }
  }
}