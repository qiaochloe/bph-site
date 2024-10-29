import "~/styles/globals.css";
import { auth } from "@/auth";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster"
export const metadata: Metadata = {
  title: "Brown Puzzle Hunt",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

async function TopNav() {
  const session = await auth();
  return (
    <nav className="flex items-center w-full p-4 justify-between">
      <div>
        <Link href="/">Home </Link>
        <Link href="/puzzle">Puzzle </Link>
        <Link href="/teams">Teams</Link>
      </div>
      <div>
        {session?.user ? (<Link href="/login">Logout</Link>) : (<Link href="/login">Login</Link>)}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TopNav />
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}