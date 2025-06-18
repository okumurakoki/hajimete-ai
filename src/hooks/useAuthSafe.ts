// 認証フックの安全なラッパー - SSR対応
import { useUser } from '@clerk/nextjs'

export function useAuthSafe() {
  // サーバーサイドでは常にnullを返す
  if (typeof window === 'undefined') {
    return {
      user: null,
      isSignedIn: false,
      isLoaded: true // SSRでは即座にロード完了とする
    }
  }

  // クライアントサイドでのみClerkフックを使用
  try {
    return useUser()
  } catch (error) {
    console.warn('Clerk not available:', error)
    return {
      user: null,
      isSignedIn: false,
      isLoaded: false
    }
  }
}

// 使用例:
// const { user, isSignedIn } = useAuthSafe()
// if (isSignedIn && user) {
//   // 認証済みユーザーの処理
// }