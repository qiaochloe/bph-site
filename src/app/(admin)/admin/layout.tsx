import "~/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "~/server/auth/auth";
import Link from "next/link";
import { LogoutButton } from "~/app/nav/LogoutButton";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <div className="h-full min-h-screen bg-white pb-5">
      {/* Navbar */}
      <nav className="fixed z-50 flex w-full justify-between bg-gray-50 p-4">
        <div className="flex space-x-4">
          <Link href="/admin" className="hover:underline">
            Home
          </Link>
          <Link href="/admin/solutions" className="hover:underline">
            Solutions
          </Link>
          <Link href="/admin/teams" className="hover:underline">
            Teams
          </Link>
          <Link href="/admin/hints" className="hover:underline">
            Hinting
          </Link>
          <Link href="/admin/errata" className="hover:underline">
            Errata
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link
            href={`/teams/${session?.user?.username}`}
            className="hover:underline"
          >
            {session?.user?.displayName}
          </Link>
          <Link href="/" className="hover:underline">
            Hunt
          </Link>
          <LogoutButton />
        </div>
      </nav>
      {/* Navbar spacer */}
      <div className="min-h-[80px]"></div>
      <main className="mx-5 mb-5 flex min-h-[calc(100vh-80px-5rem)]">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
