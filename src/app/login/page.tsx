"use server"
import { auth, signIn, signOut } from "@/auth";

export async function Login() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        await signIn("credentials", { username, password, /* redirect: true, redirectTo: "/" */ });
      }}
    >
      <input name="username" type="text" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export async function Logout() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Logout</button>
    </form>
  )
}

export default async function Home() {
  const session = await auth();
  return (
    <main>
      {session?.user? (
        <>
          <p>Welcome {session.user.displayName}!</p>
          <Logout />
        </>
      ) : (
        <Login />
      )}
    </main>
  )
}
