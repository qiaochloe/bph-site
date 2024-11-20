import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { guesses, errata, unlocks } from "~/server/db/schema";
import PreviousGuessTable from "./PreviousGuessTable";
import ErratumDialog from "./ErratumDialog";
import GuessForm from "./GuessForm";
import { INITIAL_PUZZLES, NUMBER_OF_GUESSES_PER_PUZZLE } from "~/hunt.config";

// TODO: database queries can definitely be more efficient
// See drizzle

export default async function DefaultPuzzlePage({
  puzzleId,
  puzzleBody,
}: {
  puzzleId: string;
  puzzleBody: React.ReactNode;
}) {
  // Check if team has unlocked the puzzle yet
  const session = await auth()!;
  if (!session?.user?.id) {
    throw new Error("Not authorized");
  }

  const initialPuzzles = await INITIAL_PUZZLES();
  if (
    (initialPuzzles && initialPuzzles.includes(puzzleId)) ||
    (await db.query.unlocks.findFirst({
      columns: { id: true },
      where: and(
        eq(unlocks.teamId, session.user.id),
        eq(unlocks.puzzleId, puzzleId),
      ),
    }))
  ) {
  } else {
    redirect("/404");
  }

  // Get errata
  const errataList = (
    await db.query.errata.findMany({
      where: eq(errata.puzzleId, puzzleId),
    })
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Get previous guesses
  const previousGuesses = await db.query.guesses.findMany({
    where: and(
      eq(guesses.teamId, session.user.id),
      eq(guesses.puzzleId, puzzleId),
    ),
  });

  const hasCorrectGuess = previousGuesses.some((guess) => guess.isCorrect);
  const numberOfGuessesLeft =
    NUMBER_OF_GUESSES_PER_PUZZLE - previousGuesses.length;

  return (
    <>
      <div className="w-2/3 min-w-36">
        <ErratumDialog errataList={errataList} />
      </div>

      <div className="mt-4 w-2/3 min-w-36">{puzzleBody}</div>

      <div className="mt-4 w-2/3 min-w-36">
        {!hasCorrectGuess && numberOfGuessesLeft > 0 && (
          <div className="mt-2">
            <GuessForm
              puzzleId={puzzleId}
              numberOfGuessesLeft={numberOfGuessesLeft}
            />
          </div>
        )}
        {numberOfGuessesLeft === 0 && !hasCorrectGuess && (
          <div className="mb-4 text-center text-rose-600">
            You have no guesses left. Please contact HQ for help.
          </div>
        )}
      </div>

      <h2 className="mb-2">Previous Guesses</h2>
      <div className="mb-4 w-2/3 min-w-36">
        <PreviousGuessTable previousGuesses={previousGuesses} />
      </div>
    </>
  );
}
