"use server"
import { RegisterForm } from "./RegisterForm"

export default async function Home() {
  return (
    <main>
      <RegisterForm />
    </main>
  )
}