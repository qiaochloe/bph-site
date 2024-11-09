import { auth } from "@/auth";
import { LogoutButton } from "./LogoutButton";
import Link from "next/link";

export async function AdminTopNav() {
  const session = await auth();
  return (
    <nav className="fixed z-50 flex w-full justify-between bg-slate-50 p-4">
      <div className="flex space-x-4">
        <Link href="/admin" className="hover:underline">
          Home
        </Link>
        <Link href="/admin/puzzles" className="hover:underline">
          Puzzles
        </Link>
        <Link href="/admin/hints" className="hover:underline">
          Hinting
        </Link>
        <Link href="/admin/errata" className="hover:underline">
          Errata
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Hunt
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
}
export async function AdminTopNavSpacer() {
  return <div className="min-h-[80px]"></div>;
}
