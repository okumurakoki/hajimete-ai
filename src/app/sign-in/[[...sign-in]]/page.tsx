import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto mt-20">
        <SignIn />
      </div>
    </div>
  )
}