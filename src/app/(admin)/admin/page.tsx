import { auth } from "~/server/auth/auth";
import { db } from "@vercel/postgres";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p>Welcome to the admin page!</p>
      <p>
        There is{" "}
        <Link href="admin/hints" className="text-blue-500">
          hinting
        </Link>{" "}
        and{" "}
        <Link href="admin/errata" className="text-blue-500">
          errata
        </Link>
        .
      </p>
    </div>
  );
}
