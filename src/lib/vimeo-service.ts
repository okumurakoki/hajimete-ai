// DISABLED FOR BUILD - Mock implementation
export async function saveVideoToDatabase() { return { id: 'mock' } }
export async function updateVideoInDatabase() { return { id: 'mock' } }
export async function deleteVideoFromDatabase() { return { id: 'mock' } }
export async function getVideoFromDatabase() { return null }
export interface VideoMetadata {
  title: string
  description: string
  departmentId: string
  level: 'beginner' | 'intermediate' | 'advanced'
  isPremium: boolean
  instructorName: string
  tags: string[]
}