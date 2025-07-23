const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // kokiokumura0108@icloud.com のメールアドレスを持つユーザーを管理者に設定
  // まずメールアドレスでユーザーを検索
  console.log('メールアドレスでユーザーを検索中...')
  
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'kokiokumura0108@icloud.com' },
        { email: { contains: 'kokiokumura0108' } }
      ]
    }
  })
  
  let adminClerkId
  
  if (existingUser) {
    adminClerkId = existingUser.clerkId
    console.log('✅ 既存ユーザーを発見:', adminClerkId)
  } else {
    // 仮のユーザーIDでユーザーを作成（実際のClerkIDは後で更新）
    adminClerkId = 'temp_admin_user'
    console.log('⚠️ ユーザーが見つからないため、仮IDで作成します')
  }
  
  console.log('管理者ユーザーを作成中...')
  
  try {
    // まずユーザーレコードを作成または取得
    const user = await prisma.user.upsert({
      where: { clerkId: adminClerkId },
      create: {
        clerkId: adminClerkId,
        email: 'admin@oku-ai.co.jp',
        plan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE'
      },
      update: {}
    })
    
    console.log('✅ ユーザーレコード確認:', user.id)
    
    // 管理者レコードを作成
    const admin = await prisma.admin.upsert({
      where: { userId: adminClerkId },
      create: {
        userId: adminClerkId,
        role: 'ADMIN'
      },
      update: {
        role: 'ADMIN'
      }
    })
    
    console.log('✅ 管理者レコード作成完了:', admin.id)
    console.log('📋 管理者情報:')
    console.log('- ユーザーID:', adminClerkId)
    console.log('- 権限:', admin.role)
    console.log('- 作成日時:', admin.createdAt)
    
  } catch (error) {
    console.error('❌ 管理者作成エラー:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })