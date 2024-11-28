import { db } from "@/db/index";
import ErratumForm from "./ErratumForm";

export const fetchCache = "force-no-store";

export default async function Home() {
  const puzzleList = await db.query.puzzles.findMany({
    columns: { id: true, name: true },
  });

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
