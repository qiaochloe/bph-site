import { auth } from "@/auth";
import { db } from "@/db/index";
import ErratumForm from "./ErratumForm";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

  const puzzleList = await db.query.puzzles.findMany();

  const errataList = (await db.query.errata.findMany()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );

  return (
    <div className="mx-auto flex max-w-4xl grow flex-col">
      <h1 className="mb-2">Errata</h1>
      <ErratumForm puzzleList={puzzleList} errataList={errataList} />
    </div>
  );
}
