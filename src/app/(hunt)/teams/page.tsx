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
import { and, asc, desc, eq, lt } from "drizzle-orm/expressions";
import { teams, guesses } from "~/server/db/schema";
import { HUNT_END_TIME } from "~/hunt.config";
import { FormattedTime } from "~/lib/time";

export const fetchCache = "force-no-store";

export default async function Home() {
  const teamRows = await db
    .select({
      id: teams.id,
      displayName: teams.displayName,
      // Exclude finish time if it is after hunt end
      finishTime: sql<Date | null>`
        case 
          when ${teams.finishTime} > ${HUNT_END_TIME} then null
          else ${teams.finishTime}
        end`.as("finish_time"),
      correctGuesses:
        sql<number>`count(case when ${guesses.isCorrect} = true then 1 end)`.as(
          "correct_guesses",
        ),
      lastCorrectGuessTime: sql<Date>`max(${guesses.submitTime})`.as(
        "last_correct_guess_time",
      ),
    })
    .from(teams)
    // Filter out admin teams and teams who registered after the hunt end
    .where(and(eq(teams.role, "user"), lt(teams.createTime, HUNT_END_TIME)))
    // Get guesses that were submitted before the hunt end
    // This is used for `correctGuesses` and `lastCorrectGuessTime`
    .leftJoin(
      guesses,
      and(eq(guesses.teamId, teams.id), lt(guesses.submitTime, HUNT_END_TIME)),
    )
    .groupBy(teams.id, teams.displayName, teams.finishTime)
    .orderBy(
      asc(teams.finishTime),
      desc(sql`"correct_guesses"`),
      asc(sql`"last_correct_guess_time"`),
    );

  return (
    <div className="mb-6 flex grow flex-col items-center ">
      <h1 className="mb-2 ">Leaderboard!</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-[20em]">Team Name</TableHead>
              <TableHead className="w-[10em] text-center">
                Total Solved
              </TableHead>
              <TableHead className="">Finish Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamRows.map((teamRow, index) => (
              <TableRow className="hover:" key={`${teamRow.id}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="w-[20em] break-all">
                  {teamRow.displayName}
                </TableCell>
                <TableCell className="text-center">
                  {teamRow.correctGuesses ?? 0}
                </TableCell>
                <TableCell>
                  <FormattedTime time={teamRow.finishTime} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
