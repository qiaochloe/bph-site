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
  const session = await auth();

  // If the hunt has not yet started, display a message
  if (new Date() < HUNT_START_TIME) {
    return (
      <div className="flex grow flex-col items-center text-secondary">
        <div className="mb-6 flex grow flex-col items-center">
          <h1 className="mb-2 text-secondary">Puzzles!</h1>
          <p>The hunt has not started yet.</p>
        </div>
      </div>
    );
  }

  // If the user is not logged in and the hunt has not ended, display a message
  if (!session?.user?.id && new Date() < HUNT_END_TIME) {
    return (
      <div className="flex grow flex-col items-center text-secondary">
        <h1 className="mb-2">Puzzles!</h1>
        <p>
          <Link href="/login" className="text-perwinkle hover:underline">
            Login
          </Link>{" "}
          to access puzzles
        </p>
      </div>
    );
  }

  var availablePuzzles: {
    unlockTime: Date | null;
    id: string;
    name: string;
    answer: string;
  }[];

  // If the user is logged in and the hunt has not ended
  if (session?.user?.id && new Date() < HUNT_END_TIME) {
    let initialPuzzles = await db.query.puzzles.findMany({
      columns: { id: true, name: true, answer: true },
      where: inArray(puzzles.id, INITIAL_PUZZLES),
    });

    let unlockedPuzzles = await db.query.unlocks.findMany({
      columns: { unlockTime: true },
      where: eq(unlocks.teamId, session.user.id),
      with: { puzzle: { columns: { id: true, name: true, answer: true } } },
    });

    availablePuzzles = [
      ...initialPuzzles.map((puzzle) => ({ ...puzzle, unlockTime: null })),
      ...unlockedPuzzles.map((unlock) => ({
        ...unlock.puzzle,
        unlockTime: unlock.unlockTime,
      })),
    ];
  } else {
    availablePuzzles = (
      await db.query.puzzles.findMany({
        columns: { id: true, name: true, answer: true },
      })
    ).map((puzzle) => ({ ...puzzle, unlockTime: null }));
  }

  var solvedPuzzles: { puzzleId: string }[];

  // Check which puzzles are solved
  if (session?.user?.id) {
    solvedPuzzles = await db.query.guesses.findMany({
      columns: { puzzleId: true },
      where: and(
        eq(guesses.teamId, session.user.id),
        eq(guesses.isCorrect, true),
      ),
    });
  } else {
    solvedPuzzles = [];
  }

  return (
    <div className="mb-6 flex grow flex-col items-center">
      <h1 className="mb-2">Puzzles!</h1>
      <PuzzleTable
        availablePuzzles={availablePuzzles}
        solvedPuzzles={solvedPuzzles}
      />
    </div>
  );
}
