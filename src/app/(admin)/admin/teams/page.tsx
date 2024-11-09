import { auth } from "@/auth";
import { db } from "@/db/index";
import { columns } from "./components/team-table/Columns";
import { TeamTable } from "./components/team-table/TeamTable";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

  const data = await db.query.teams.findMany();

  return (
    <div className="container mx-auto">
      <TeamTable columns={columns} data={data} />
    </div>
  );
}
