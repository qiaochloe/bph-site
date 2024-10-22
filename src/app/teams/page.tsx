import { db } from "~/server/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = "force-dynamic";

export default async function Home() {
  // TODO: Also order by number of correct guesses, last correct submission time
  const teams = await db.query.teams.findMany({
    orderBy: (model, { asc }) => [asc(model.finishTime)],
    with: {
      guesses: true,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Teams!
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-[10em]">Team Name</TableHead>
              <TableHead className="w-[10em] text-center">Total Solved</TableHead>
              <TableHead>Finish Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              teams.map((team, index) => (
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{team.displayName}</TableCell>
                  <TableCell className="text-center">{team.guesses.filter((guess) => guess.isCorrect).length}</TableCell>
                  <TableCell>{team.finishTime ? team.finishTime.toLocaleString() : ''}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
