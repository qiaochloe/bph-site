"use server";
import { auth } from "@/auth"
import { db } from "~/server/db";
import { guesses } from "~/server/db/schema"
import { GuessForm } from "~/app/puzzle/components/GuessForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { eq, and } from "drizzle-orm";

const PUZZLE_ID = "puzzle2"

export default async function Home() {
  const session = await auth()
  if (!session?.user?.id) return <div>You are not authorized to view this puzzle</div>

  const previousGuesses = await db.query.guesses.findMany({
    where: and(eq(guesses.teamId, session.user.id), eq(guesses.puzzleId, PUZZLE_ID))
  });

  const hasCorrectGuess = previousGuesses.some(guess => guess.isCorrect);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="p-4">Puzzle!</h1>
      <p className="p-4">What is the answer to this puzzle?</p>
      <div>
        {!hasCorrectGuess && <GuessForm puzzleId={PUZZLE_ID} />}
      </div>
      <h1 className="p-4">Previous Guesses!</h1>
      <Table>
        <TableBody>
          {previousGuesses.map((guess) => (
            <TableRow key={guess.id}>
              <TableCell>{guess.guess}</TableCell>
              <TableCell>{guess.isCorrect ? "✅" : "❌"}</TableCell>
              <TableCell>{guess.submitTime.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
