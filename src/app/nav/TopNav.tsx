import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function TopNav() {
  const session = await auth();
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div>
        <Link href="/">Home</Link>
        &emsp;
        <Link href="/puzzle">Puzzle</Link>
        &emsp;
        <Link href="/teams">Teams</Link>
      </div>
      <div>
        {session?.user?.role === "admin" && (
          <>
            <Link href="/admin">Admin</Link>
            <>&emsp;</>
          </>
        )}
        {session?.user?.id ? (
          <LogoutButton />
        ) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}
