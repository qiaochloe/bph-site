import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <h1 className="mb-2">Admin!</h1>
      <p className="text-black">
        See{" "}
        <Link href="admin/solutions" className="text-blue-600 hover:underline">
          solutions
        </Link>
        {", "}
        <Link href="admin/teams" className="text-blue-600 hover:underline">
          teams
        </Link>
        {", "}
        <Link href="admin/hints" className="text-blue-600 hover:underline">
          hinting
        </Link>
        {", "}
        and{" "}
        <Link href="admin/errata" className="text-blue-600 hover:underline">
          errata
        </Link>
      </p>
    </div>
  );
}
