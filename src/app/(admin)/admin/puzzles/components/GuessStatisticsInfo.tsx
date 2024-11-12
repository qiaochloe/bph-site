import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { GuessTable } from "./guess-table/GuessTable";
import { columns } from "./guess-table/Columns";
import GuessPieChart from "./GuessPieChart";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { guesses } from "~/server/db/schema";
import { auth } from "~/server/auth/auth";

export type GuessWithTeam = typeof guesses.$inferSelect & {
  team: { displayName: string };
};

export default async function GuessStatisticsInfo({
  puzzleId,
}: {
  puzzleId: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return;
  }
  // Get previous guesses
  const previousGuesses = await db.query.guesses.findMany({
    where: eq(guesses.puzzleId, puzzleId),
    with: {
      team: { columns: { displayName: true } },
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Guess Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <GuessPieChart previousGuesses={previousGuesses} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Guesses</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <GuessTable columns={columns} data={previousGuesses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
