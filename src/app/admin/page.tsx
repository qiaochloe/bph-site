import { auth } from "@/auth";
import { db } from "@/db/index";
import { hints } from "@/db/schema";

import { columns, DataTable } from "./components/HintTable";

export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return <p>You are not authorized to access this page.</p>;
  }

  const data = await db.query.hints.findMany();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
