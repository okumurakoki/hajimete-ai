const { PrismaClient } = require('@prisma/client')

async function makeAdmin() {
  const prisma = new PrismaClient()
  
  try {
    // ここにあなたのClerk User IDを入力してください
    // Clerk Dashboard > Users から確認できます
    const USER_ID = 'user_YOUR_CLERK_USER_ID_HERE'
    
    if (USER_ID === 'user_YOUR_CLERK_USER_ID_HERE') {
      console.log('❌ scripts/make-admin.js の USER_ID を実際のClerk User IDに変更してください')
      console.log('🔍 Clerk Dashboard > Users で確認できます')
      return
    }

    const admin = await prisma.admin.create({
      data: {
        userId: USER_ID,
        role: 'SUPER_ADMIN'
      }
    })

    console.log('✅ SUPER_ADMIN権限を付与しました:', admin)
    console.log('🎉 /admin ページにアクセスできます！')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ 既に管理者として登録されています')
    } else {
      console.error('❌ エラー:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()