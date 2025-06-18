// DISABLED FOR BUILD - Mock implementation
export class DatabaseSafe {
  static async getUser() { return null }
  static async createUser() { return { id: 'mock' } }
  static async getVideos() { return [] }
  static async getDepartments() { return [] }
  static async connect() {}
  static async disconnect() {}
}