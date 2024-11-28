import { db } from "@/db/index";
import { columns } from "./components/hint-table/Columns";
import { HintTable } from "./components/hint-table/HintTable";
export const fetchCache = "force-no-store";

export default async function Home() {
  const data = (
    await db.query.hints.findMany({
      with: {
        team: { columns: { displayName: true } },
        claimer: { columns: { id: true, displayName: true } },
        puzzle: { columns: { name: true } },
      },
    })
  ).sort((a, b) => b.requestTime!.getTime() - a.requestTime!.getTime());

  return (
    <div className="container mx-auto">
      <h1 className="mb-2 text-center">Hinting!</h1>
      <HintTable columns={columns} data={data} />
    </div>
  );
}
