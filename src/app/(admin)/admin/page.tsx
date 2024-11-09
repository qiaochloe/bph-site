import { auth } from "~/server/auth/auth";
import { db } from "@vercel/postgres";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="flex grow flex-col items-center justify-center">
      <h1 className="mb-2">Admin!</h1>
      <p>
        See{" "}
        <Link href="admin/teams" className="text-blue-600 hover:underline">
          teams
        </Link>
        {", "}
        <Link href="admin/hints" className="text-blue-600 hover:underline">
          hinting
        </Link>{" "}
        and{" "}
        <Link href="admin/errata" className="text-blue-600 hover:underline">
          errata
        </Link>
      </p>
    </div>
  );
}
