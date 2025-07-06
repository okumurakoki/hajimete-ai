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
    console.log(`🔍 ユーザー検索中: ${clerkUserId}`)
    
    // ユーザーの存在確認
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId }
    })

    if (!user) {
      console.log('ℹ️ ユーザーがデータベースに存在しません。作成します...')
      
      // 基本的なユーザー情報で作成（実際のユーザー情報は次回ログイン時に更新される）
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: `admin-${clerkUserId}@temp.local`, // 一時的なメール
          firstName: 'Admin',
          lastName: 'User'
        }
      })
      
      console.log('✅ ユーザーを作成しました')
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