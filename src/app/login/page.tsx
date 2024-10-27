"use server"
import { auth } from "@/auth";
import { LogoutForm, LoginForm } from "./LoginForm";

export default async function Home() {
    const session = await auth();

      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          {session?.user?.displayName ?   (
            <>
              <p className="p-4">Welcome, {session?.user?.displayName}!</p>
              <LogoutForm />
            </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
