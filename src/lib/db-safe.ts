// データベース接続の安全なラッパー - ビルド時対応
import { prisma } from './prisma'

export class DatabaseSafe {
  private static isAvailable() {
    return process.env.DATABASE_URL && process.env.NODE_ENV !== 'production'
  }

  static async findUser(clerkId: string) {
    if (!this.isAvailable()) {
      return {
        id: 'mock_user',
        clerkId,
        plan: 'basic',
        email: 'mock@example.com'
      }
    }

    try {
      return await prisma.user.findUnique({
        where: { clerkId }
      })
    } catch (error) {
      console.warn('Database not available:', error)
      return null
    }
  }

  static async createUser(data: any) {
    if (!this.isAvailable()) {
      return { id: 'mock_user', ...data }
    }

    try {
      return await prisma.user.create({ data })
    } catch (error) {
      console.warn('Database creation failed:', error)
      return null
    }
  }

  // 他のデータベース操作も同様にラップ
}