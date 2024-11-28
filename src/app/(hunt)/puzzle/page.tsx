import { auth } from "@/auth";
import { HUNT_START_TIME } from "@/hunt.config";
import Link from "next/link";
import { db } from "@/db/index";
import { HUNT_END_TIME, INITIAL_PUZZLES } from "@/hunt.config";
import { and, eq, inArray } from "drizzle-orm";
import { guesses, puzzles, unlocks } from "~/server/db/schema";
import PuzzleTable from "./components/PuzzleTable";

export default async function Home() {
  // Get user id
  const session = await auth()!;
  if (!session?.user?.id) {
    return (
      <div className="flex grow flex-col items-center">
        <h1 className="mb-2">Puzzles!</h1>
        <div>
          <Link href="/login" className="text-secondary hover:underline">
            Login
          </Link>{" "}
          to access puzzles
        </div>
      </div>
    );
  }

  if (new Date() > HUNT_END_TIME) {
    var availablePuzzles: {
      unlockTime: Date | null;
      id: string;
      name: string;
      answer: string;
    }[] = (
      await db.query.puzzles.findMany({
        columns: { id: true, name: true, answer: true },
      })
    ).map((puzzle) => ({ ...puzzle, unlockTime: null }));
    // Get all puzzles available to the team
  } else {
    let initialPuzzles = await db.query.puzzles.findMany({
      columns: { id: true, name: true, answer: true },
      where: inArray(puzzles.id, INITIAL_PUZZLES),
    });

    let unlockedPuzzles = await db.query.unlocks.findMany({
      columns: { unlockTime: true },
      where: eq(unlocks.teamId, session.user.id),
      with: { puzzle: { columns: { id: true, name: true, answer: true } } },
    });

    var availablePuzzles: {
      unlockTime: Date | null;
      id: string;
      name: string;
      answer: string;
    }[] = [
      ...initialPuzzles.map((puzzle) => ({ ...puzzle, unlockTime: null })),
      ...unlockedPuzzles.map((unlock) => ({
        ...unlock.puzzle,
        unlockTime: unlock.unlockTime,
      })),
    ];
  }

  // Check which puzzles are solved
  let solvedPuzzles = await db.query.guesses.findMany({
    columns: { puzzleId: true },
    where: and(
      eq(guesses.teamId, session.user.id),
      eq(guesses.isCorrect, true),
    ),
  });

  return (
    <div className="mb-6 flex grow flex-col items-center">
      <h1 className="mb-2">Puzzles!</h1>
      {new Date() < HUNT_START_TIME && session.user.role != "admin" ? (
        <p>The hunt has not started yet.</p>
      ) : (
        <PuzzleTable
          availablePuzzles={availablePuzzles}
          solvedPuzzles={solvedPuzzles}
        />
      )}
    </div>
  );
}
