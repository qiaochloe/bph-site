import Link from "next/link";
export const dynamic = "force-dynamic";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1>Welcome!</h1>
      { !session?.user?.id && <Link href="/register">Register here.</Link> }
    </main>
  );
}