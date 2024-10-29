import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Brown Puzzle Hunt",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// #GoodFirstIssue
// TODO: dynamically change the login/logout button in the TopNav based on the user's status
// Import and use auth() to check if the user is logged in or not

function TopNav() {
  return (
    <nav className="flex items-center w-full p-4 justify-between">
      <div>
        <Link href="/">Home </Link>
        <Link href="/puzzle">Puzzle </Link>
        <Link href="/teams">Teams</Link>
      </div>
      <div>
        <Link href="/login">Login</Link>
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
      </body>
    </html>
  );
}
