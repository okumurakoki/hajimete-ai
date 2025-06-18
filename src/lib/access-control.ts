import { User } from '@clerk/nextjs/server'

export type Department = 
  | 'AI基礎学部'
  | '業務効率化学部'
  | 'データサイエンス学部'
  | 'AI開発学部'
  | 'ビジネスAI学部'

export type Plan = 'basic' | 'premium'

export interface AccessControl {
  canAccessDepartment: (department: Department) => boolean
  canAccessLive: () => boolean
  canAccessPremiumContent: () => boolean
  userDepartments: Department[]
  userPlan: Plan | null
}

export const DEPARTMENT_ACCESS: Record<Plan, Department[]> = {
  basic: ['AI基礎学部', '業務効率化学部'],
  premium: [
    'AI基礎学部',
    '業務効率化学部', 
    'データサイエンス学部',
    'AI開発学部',
    'ビジネスAI学部'
  ]
}

export function createAccessControl(user: User | null): AccessControl {
  const userPlan = user?.publicMetadata?.plan as Plan | null
  const userDepartments = (user?.publicMetadata?.departments as Department[]) || []

  return {
    canAccessDepartment: (department: Department) => {
      if (!userPlan) return false
      return DEPARTMENT_ACCESS[userPlan].includes(department)
    },
    
    canAccessLive: () => {
      return userPlan === 'premium'
    },
    
    canAccessPremiumContent: () => {
      return userPlan === 'premium'
    },
    
    userDepartments,
    userPlan
  }
}

export function getAccessibleContent(user: User | null) {
  const accessControl = createAccessControl(user)
  
  return {
    departments: accessControl.userPlan ? DEPARTMENT_ACCESS[accessControl.userPlan] : [],
    hasLiveAccess: accessControl.canAccessLive(),
    hasPremiumAccess: accessControl.canAccessPremiumContent(),
    plan: accessControl.userPlan
  }
}