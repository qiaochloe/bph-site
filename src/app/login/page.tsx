"use server"
import { auth } from "@/auth";
import { LogoutForm, LoginForm } from "./LoginForm";

export default async function Home() {
    const session = await auth();

    if (session?.user?.displayName) {
      return (
        <>
        <p className="p-4">Welcome, {session?.user?.displayName}!</p>
        <LogoutForm />
        </>
      )
    } else {
      return <LoginForm />
    }
}
