import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function TopNav() {
  const session = await auth();
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div>
        <Link href="/">Home </Link>
        <Link href="/puzzle">Puzzle </Link>
        <Link href="/teams">Teams</Link>
      </div>
      <div>
        {session?.user?.id ? (
          <LogoutButton />
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
