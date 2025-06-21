import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto mt-20">
        <SignUp />
      </div>
    </div>
  )
}