import { auth } from "@/auth";
import { db } from "@/db/index";
import { columns } from "./components/hint-table/Columns";
import { HintTable } from "./components/hint-table/HintTable";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

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
