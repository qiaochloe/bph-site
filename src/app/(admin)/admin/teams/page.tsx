import { db } from "@/db/index";
import { columns } from "./components/team-table/Columns";
import { TeamTable } from "./components/team-table/TeamTable";

export const fetchCache = "force-no-store";

export default async function Home() {
  const data = await db.query.teams.findMany();

  return (
    <div className="container mx-auto">
      <h1 className="mb-2 text-center">Teams!</h1>
      <TeamTable columns={columns} data={data} />
    </div>
  );
}
