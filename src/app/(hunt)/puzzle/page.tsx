"use server";
import { auth } from "@/auth";
import { HUNT_START_TIME } from "@/hunt.config";
import Link from "next/link";
import { db } from "@/db/index";
import { INITIAL_PUZZLES } from "@/hunt.config";
import { and, eq, inArray } from "drizzle-orm";
import { guesses, puzzles, unlocks } from "~/server/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default async function Home() {
  // Get user id
  const session = await auth()!;
  if (!session?.user?.id) {
    return (
      <div className="flex grow flex-col items-center">
        <h1 className="mb-2">Puzzles!</h1>
        <div>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>{" "}
          to access puzzles
        </div>
      </div>
    );
  }

  // Get all puzzles available to the team
  let initialPuzzles = await db.query.puzzles.findMany({
    columns: { id: true, name: true, answer: true },
    where: inArray(puzzles.id, INITIAL_PUZZLES),
  });

  let unlockedPuzzles = await db.query.unlocks.findMany({
    where: eq(unlocks.teamId, session.user.id),
    with: { puzzle: { columns: { id: true, name: true, answer: true } } },
  });

  let availablePuzzles = [
    ...initialPuzzles.map((puzzle) => ({ ...puzzle, unlockTime: null })),
    ...unlockedPuzzles.map((unlock) => ({
      ...unlock.puzzle,
      unlockTime: unlock.unlockTime,
    })),
  ];

  // Check which puzzles are solved
  let solvedPuzzles = await db.query.guesses.findMany({
    where: and(eq(guesses.teamId, session.user.id), guesses.isCorrect),
    columns: { puzzleId: true },
  });

  return (
    <div className="flex grow flex-col items-center">
      <h1 className="mb-2">Puzzles!</h1>
      {new Date() < HUNT_START_TIME ? (
        <p>The hunt has not started yet.</p>
      ) : (
        <div className="w-1/3">
          <Table className="justify-center">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Puzzle</TableHead>
                <TableHead className="w-1/3">Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availablePuzzles
                // If both puzzles have null times, sort alphabetically
                // Otherwise, prioritize the puzzle with null time
                // If neither puzzles have null times, sort by earliest unlock
                .sort((a, b) => {
                  if (a.unlockTime === null && b.unlockTime === null)
                    return a.name.localeCompare(b.name);
                  else if (a.unlockTime === null) return -1;
                  else if (b.unlockTime === null) return 1;
                  return a.unlockTime.getTime() - b.unlockTime.getTime();
                })
                .map((puzzle) => (
                  <TableRow key={puzzle.id}>
                    <TableCell>
                      <Link
                        className="hover:underline"
                        href={`/puzzle/${puzzle.id}`}
                      >
                        {puzzle.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {solvedPuzzles.some(
                        (sp) => sp.puzzleId === puzzle.id,
                      ) && <p className="text-emerald-600">{puzzle.answer}</p>}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
