import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function TopNav() {
  const session = await auth();
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div>
        <Link href="/" className="hover:underline">Home </Link>
        <Link href="/puzzle" className="hover:underline">Puzzle </Link>
        <Link href="/teams" className="hover:underline">Teams</Link>
      </div>
      <div>
        {session?.user?.id ? (
          <LogoutButton />
        ) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}
