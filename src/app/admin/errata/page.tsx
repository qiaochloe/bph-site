import { auth } from "@/auth";
import { db } from "@/db/index";
import { puzzles } from "@/db/schema";
import ErratumForm from "./ErratumForm";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

  const puzzleList = await db.query.puzzles.findMany();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl p-4">
      <div className="w-full">
        <h1 className="mb-4 text-2xl font-bold">Errata</h1>
        <ErratumForm puzzleList={puzzleList} />
      </div>
    </div>
  );
}
