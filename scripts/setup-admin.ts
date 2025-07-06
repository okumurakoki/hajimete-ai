// 管理者設定スクリプト
// 使用方法: npx tsx scripts/setup-admin.ts <clerk-user-id>

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupAdmin(clerkUserId: string) {
  if (!clerkUserId) {
    console.error('❌ エラー: Clerk User IDを指定してください')
    console.log('使用方法: npx tsx scripts/setup-admin.ts <clerk-user-id>')
    process.exit(1)
  }

  try {
    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      console.error('❌ エラー: 指定されたClerk IDのユーザーが見つかりません')
      console.log('ヒント: ユーザーが一度ログインしてからこのスクリプトを実行してください')
      process.exit(1)
    }

    // 既存の管理者権限確認
    const existingAdmin = await prisma.admin.findUnique({
      where: { userId: clerkUserId }
    })

    if (existingAdmin) {
      console.log('✅ このユーザーは既に管理者です')
      console.log(`Role: ${existingAdmin.role}`)
      return
    }

    // 管理者権限を付与
    const admin = await prisma.admin.create({
      data: {
        userId: clerkUserId,
        role: 'SUPER_ADMIN'
      }
    })

    console.log('🎉 管理者権限を付与しました！')
    console.log(`User: ${user.email}`)
    console.log(`Role: ${admin.role}`)
    console.log(`Created at: ${admin.createdAt}`)

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// コマンドライン引数から Clerk User ID を取得
const clerkUserId = process.argv[2]
setupAdmin(clerkUserId)