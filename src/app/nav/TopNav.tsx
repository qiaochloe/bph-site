import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function TopNav() {
  const session = await auth();
  return (
    <nav className="fixed flex w-full justify-between p-4 bg-slate-50 shadow-md z-50">
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/puzzle" className="hover:underline">
          Puzzle
        </Link>
        <Link href="/teams" className="hover:underline">
          Teams
        </Link>
      </div>
      <div className="flex space-x-4">
        {session?.user?.role === "admin" && (
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>
        )}
        {session?.user?.id ? (
          <LogoutButton />
        ) : (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
