"use server"
import { auth } from "@/auth"
import { RegisterForm } from "@/components/register/RegisterForm"

export default async function Home() {
  const session = await auth();

  // TODO: user is logged in, redirect
  if (session) {
    return null
  }

  return (
    <main>
      <RegisterForm />
    </main>
  )
}