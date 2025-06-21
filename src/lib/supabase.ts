import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations using real Supabase
export const realDatabase = {
  videos: {
    findAll: async (filters: any = {}) => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .limit(filters.limit || 20)
      
      if (error) {
        console.error('Database error:', error)
        return []
      }
      
      return data || []
    },
    
    findById: async (id: string) => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Database error:', error)
        return null
      }
      
      return data
    }
  },
  
  seminars: {
    findAll: async (filters: any = {}) => {
      const { data, error } = await supabase
        .from('seminars')
        .select('*')
        .limit(filters.limit || 20)
      
      if (error) {
        console.error('Database error:', error)
        return []
      }
      
      return data || []
    },
    
    create: async (seminarData: any) => {
      const { data, error } = await supabase
        .from('seminars')
        .insert(seminarData)
        .select()
        .single()
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      return data
    }
  },
  
  userProgress: {
    findByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
      
      if (error) {
        console.error('Database error:', error)
        return []
      }
      
      return data || []
    },
    
    updateProgress: async (userId: string, videoId: string, progress: number) => {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          video_id: videoId,
          progress_seconds: progress,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      return data
    }
  }
}