import { prisma } from '../lib/prisma'

async function createAdmin(userId: string, role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' = 'ADMIN') {
  try {
    const admin = await prisma.admin.create({
      data: {
        userId,
        role
      }
    })

    console.log(`✅ 管理者を作成しました:`, admin)
    return admin
  } catch (error) {
    console.error('❌ 管理者作成エラー:', error)
    throw error
  }
}

// 使用例：
// createAdmin('user_123456789', 'SUPER_ADMIN')

export { createAdmin }