import "~/styles/globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { HuntTopNavSpacer } from "../nav/HuntTopNavSpacer";
import { auth } from "~/server/auth/auth";
import { LogoutButton } from "../nav/LogoutButton";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <>
      <nav className="fixed z-50 flex w-full justify-between bg-hunt-nav-color p-4">
        <div className="flex space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/puzzle" className="hover:underline">
            Puzzles
          </Link>
          <Link href="/teams" className="hover:underline">
            Teams
          </Link>
          <Link href="/feedback" className="hover:underline">
            Feedback
          </Link>
        </div>
        <div className="flex space-x-4">
          {session?.user?.id ? (
            <>
              <Link
                href={`/teams/${session.user.username}`}
                className="hover:underline"
              >
                {session.user.displayName}
              </Link>
              {session?.user?.role === "admin" && (
                <Link href="/admin" className="hover:underline">
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </nav>
      <HuntTopNavSpacer />
      <main className="flex min-h-[calc(100vh-80px-2em)]">{children}</main>
      <Toaster />
      <footer className="py-2 text-center text-xs">
        <p>
          Having a good time? Want support more puzzlehunts like this in the
          future? Consider{" "}
          <Link
            href="https://bbis.advancement.brown.edu/BBPhenix/give-now?did=05732af4-d994-4d40-bcd6-fb42d07b6eab"
            className="text-blue-500 hover:underline"
          >
            donating
          </Link>{" "}
          to your friendly neighborhood{" "}
          <Link
            href="http://brownpuzzle.club/"
            className="text-blue-500 hover:underline"
          >
            puzzle club
          </Link>
          .
        </p>
      </footer>
    </>
  );
}
