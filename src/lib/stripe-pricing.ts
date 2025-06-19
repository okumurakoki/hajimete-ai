// Stripe Price ID mappings for production environment

export const STRIPE_PRICE_IDS = {
  // Subscription Plans
  BASIC_PLAN: process.env.STRIPE_BASIC_PLAN_PRICE_ID || 'price_1RbFUBKnrmty0hAG5K00xgNx',
  PREMIUM_PLAN: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID || 'price_1RbFUaKnrmty0hAGgzQK1HB1',
  
  // Seminar Pricing by User Plan
  SEMINAR_BASIC: process.env.STRIPE_SEMINAR_BASIC_PRICE_ID || 'price_1RbRhMKnrmty0hAGcXEO2sLv', // 5500円 (for basic and free users)
  SEMINAR_PREMIUM: process.env.STRIPE_SEMINAR_PREMIUM_PRICE_ID || 'price_1RbRi3Knrmty0hAGYwjy3SsC', // 4400円 (for premium users)
}

export interface SeminarPricing {
  free: number
  basic: number
  premium: number
  originalPrice: number
}

export const getSeminarPricing = (): SeminarPricing => {
  return {
    free: 5500,
    basic: 5500,  // Uses SEMINAR_BASIC price ID
    premium: 4400, // Uses SEMINAR_PREMIUM price ID
    originalPrice: 7700
  }
}

export const getStripePriceId = (userPlan: string, amount: number): string | null => {
  // For free seminars, no Stripe price ID needed
  if (amount === 0) {
    return null
  }
  
  // For premium users getting the discounted price
  if (userPlan === 'premium' && amount === 4400) {
    return STRIPE_PRICE_IDS.SEMINAR_PREMIUM
  }
  
  // For basic and free users paying full price
  if ((userPlan === 'basic' || userPlan === 'free') && amount === 5500) {
    return STRIPE_PRICE_IDS.SEMINAR_BASIC
  }
  
  // Fallback - shouldn't happen in normal flow
  console.warn(`No matching price ID for plan: ${userPlan}, amount: ${amount}`)
  return userPlan === 'premium' ? STRIPE_PRICE_IDS.SEMINAR_PREMIUM : STRIPE_PRICE_IDS.SEMINAR_BASIC
}

export const getPlanSubscriptionPriceId = (plan: 'basic' | 'premium'): string => {
  return plan === 'premium' ? STRIPE_PRICE_IDS.PREMIUM_PLAN : STRIPE_PRICE_IDS.BASIC_PLAN
}