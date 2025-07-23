const { PrismaClient } = require('@prisma/client')

async function createAdmin() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🚀 管理者を作成中...')
    
    // 現在ログインしているユーザーのメールアドレスで仮管理者を作成
    const adminUserId = 'admin_temp_id'
    
    // ユーザーレコードを作成
    const user = await prisma.user.create({
      data: {
        clerkId: adminUserId,
        email: 'kokiokumura0108@icloud.com',
        plan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE'
      }
    })
    
    console.log('✅ ユーザー作成:', user.id)
    
    // 管理者レコードを作成
    const admin = await prisma.admin.create({
      data: {
        userId: adminUserId,
        role: 'ADMIN'
      }
    })
    
    console.log('✅ 管理者作成完了!')
    console.log('- ID:', admin.id)
    console.log('- Role:', admin.role)
    
  } catch (error) {
    console.error('❌ エラー:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()