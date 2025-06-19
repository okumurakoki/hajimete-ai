import { z } from 'zod'

// Stripe Checkout Session validation
export const CheckoutSessionSchema = z.object({
  seminarId: z.string().min(1, 'Seminar ID is required'),
  seminarTitle: z.string().min(1, 'Seminar title is required'),
  seminarDescription: z.string().min(1, 'Seminar description is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  userPlan: z.enum(['free', 'basic', 'premium'], { 
    errorMap: () => ({ message: 'Invalid user plan' })
  }),
  currency: z.string().optional().default('jpy'),
})

// Video progress validation
export const VideoProgressSchema = z.object({
  videoId: z.string().min(1, 'Video ID is required'),
  watchedDuration: z.number().min(0, 'Watched duration must be non-negative'),
  totalDuration: z.number().min(1, 'Total duration must be positive'),
  completed: z.boolean(),
})

// User profile validation
export const UserProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  plan: z.enum(['free', 'basic', 'premium']).optional(),
})

// Seminar creation validation
export const SeminarSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().datetime('Invalid date format'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration too long'),
  maxParticipants: z.number().min(1, 'At least 1 participant required').max(1000, 'Too many participants'),
  isPremium: z.boolean(),
})

// Generic API error response
export const ApiErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
})

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  error: string
  details?: string[]
} {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      }
    }
    return {
      success: false,
      error: 'Invalid input format'
    }
  }
}

// Environment variable validation
export const EnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, 'Clerk publishable key is required'),
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  DATABASE_URL: z.string().url('Invalid database URL').optional(),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').optional(),
})

export function validateEnv() {
  const result = EnvSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Invalid environment configuration:')
    result.error.errors.forEach(error => {
      console.error(`  ${error.path.join('.')}: ${error.message}`)
    })
    throw new Error('Environment validation failed')
  }
  return result.data
}