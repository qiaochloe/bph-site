"use server"
import { RegisterForm } from "./RegisterForm"

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RegisterForm />
    </div>
  )
}