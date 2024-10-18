"use server"
import { auth, signIn, signOut } from "@/auth";

export async function SignIn() {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const name = formData.get("name") as string;
        const password = formData.get("password") as string;
        await signIn("credentials", { name, password, /* redirect: true, redirectTo: "/" */});
      }}
    >
      <input name="name" type="text" placeholder="Team Name" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign in</button>
    </form>
  );
}

export async function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  )
}

export default async function Home() {
  const session = await auth();
  return (
    <main>
      {session?.user? (
        <>
          <p>Welcome {session.user.name}!</p>
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </main>
  )
}
