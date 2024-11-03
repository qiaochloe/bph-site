import { db } from "~/server/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sql } from "drizzle-orm";
import { asc, desc, eq } from "drizzle-orm/expressions";
import { teams, guesses } from "~/server/db/schema";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teamRows = await db
    .select({
      id: teams.id,
      displayName: teams.displayName,
      finishTime: teams.finishTime,
      correctGuesses:
        sql<number>`count(case when ${guesses.isCorrect} = true then 1 end)`.as(
          "correct_guesses",
        ),
      lastCorrectGuessTime: sql<Date>`max(${guesses.submitTime})`.as(
        "last_correct_guess_time",
      ),
    })
    .from(teams)
    .where(eq(teams.role, "user"))
    .leftJoin(guesses, eq(teams.id, guesses.teamId))
    .groupBy(teams.id, teams.displayName, teams.finishTime)
    .orderBy(
      asc(teams.finishTime),
      desc(sql`"correct_guesses"`),
      asc(sql`"last_correct_guess_time"`),
    );

  return (
    <div className="flex grow flex-col items-center justify-center space-y-4">
      <h1>Teams!</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-[10em]">Team Name</TableHead>
              <TableHead className="w-[10em] text-center">
                Total Solved
              </TableHead>
              <TableHead>Finish Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamRows.map((teamRow, index) => (
              <TableRow>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{teamRow.displayName}</TableCell>
                <TableCell className="text-center">
                  {teamRow.correctGuesses ?? 0}
                </TableCell>
                <TableCell>
                  {teamRow.finishTime
                    ? teamRow.finishTime.toLocaleString()
                    : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
