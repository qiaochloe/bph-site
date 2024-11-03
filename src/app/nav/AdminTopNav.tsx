import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function AdminTopNav() {
  const session = await auth();
  return (
    <nav className="flex w-full items-center justify-between p-4">
      <div>
        <Link href="/admin" className="hover:underline">
          Home
        </Link>
        &emsp;
        <Link href="/admin/hints" className="hover:underline">
          Hinting
        </Link>
        &emsp;
        <Link href="/admin/errata" className="hover:underline">
          Errata
        </Link>
      </div>
      <div>
        <Link href="/" className="hover:underline">
            Hunt
        </Link>
        <>&emsp;</>
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
