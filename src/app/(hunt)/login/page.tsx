import { auth } from "@/auth";
import { LogoutForm, LoginForm } from "./LoginForm";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex grow flex-col items-center justify-center ">
      {session?.user?.displayName ? (
        <>
          <p className="p-4">Welcome, {session?.user?.displayName}!</p>
          <LogoutForm />
        </>
      ) : (
        <>
          <h1 className="mb-2 ">Login!</h1>
          <LoginForm />
        </>
      )}
    </div>
  );
}
