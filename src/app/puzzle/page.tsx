import { api } from "~/trpc/server";
import { auth } from "@/auth"
import { db } from "~/server/db";
import { guesses } from "~/server/db/schema"
import { GuessForm } from "~/components/puzzles/GuessForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { eq, and } from "drizzle-orm";

export default async function Home() {
  const session = await auth()
  // TODO: Redirect to login if not logged in
  if (!session?.user?.id) return null

  const previousGuesses = await db.query.guesses.findMany({
    where: and(eq(guesses.teamId, session.user.id), eq(guesses.puzzleId, "puzzle-1"))
  });

  const hasCorrectGuess = previousGuesses.some(guess => guess.isCorrect);

  // TODO: Add proper time stamping later
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="p-4">Puzzle!</h1>
      <p>What is the answer to this puzzle?</p>
      {!hasCorrectGuess && <GuessForm puzzleId="puzzle-1" />}

      <h1 className="p-4">Previous Guesses!</h1>
      <Table>
        <TableBody>
          {
            previousGuesses.map((guess) => (
              <TableRow>
                <TableCell>{guess.guess}</TableCell>
                <TableCell>{guess.isCorrect ? "✅" : "❌"}</TableCell>
                <TableCell>Sep 22 at 00:16</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </main>
  )
}