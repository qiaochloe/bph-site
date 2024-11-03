import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

import { db } from "~/server/db";
import { guesses, hints, errata, puzzles } from "~/server/db/schema";

import PreviousGuessTable from "../components/PreviousGuessTable";
import PreviousHintTable from "../components/PreviousHintTable";
import ErratumDialog from "../components/ErratumDialog";
import HintForm from "../components/HintForm";
import GuessForm from "../components/GuessForm";
import { NUMBER_OF_GUESSES_PER_PUZZLE } from "~/hunt.config";

// TODO: database queries can definitely be more efficient
// See drizzle

export default async function DefaultPuzzlePage({
  puzzleId,
  puzzleBody,
}: {
  puzzleId: string;
  puzzleBody: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>You are not authorized to view this puzzle.</div>;
  }

  const errataList = (
    await db.query.errata.findMany({
      where: eq(errata.puzzleId, puzzleId),
    })
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  });

  if (!puzzle) {
    return <div>Puzzle does not exist in database.</div>;
  }

  const previousGuesses = await db.query.guesses.findMany({
    where: and(
      eq(guesses.teamId, session.user.id),
      eq(guesses.puzzleId, puzzleId),
    ),
  });

  const hasCorrectGuess = previousGuesses.some((guess) => guess.isCorrect);
  const numberOfGuessesLeft =
    NUMBER_OF_GUESSES_PER_PUZZLE - previousGuesses.length;

  const previousHints = await db.query.hints.findMany({
    where: and(eq(hints.teamId, session.user.id), eq(hints.puzzleId, puzzleId)),
  });

  return (
    <div className="flex w-2/3 min-w-36 grow flex-col items-center">
      <div className="w-2/3 min-w-36">
        <ErratumDialog errataList={errataList} />
      </div>

      <h1 className="mb-4">{puzzle.name}</h1>
      {puzzleBody}

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
          <div className="mb-4 text-rose-600 text-center">
            You have no guesses left. Please contact HQ for help.
          </div>
        )}
      </div>

      <h2 className="mb-2">Previous Guesses</h2>
      <div className="mb-4 w-2/3 min-w-36">
        <PreviousGuessTable previousGuesses={previousGuesses} />
      </div>

      <div className="mb-4 w-2/3 min-w-36">
        <HintForm puzzleId={puzzleId} />
      </div>

      <h2 className="mb-2">Previous Hints</h2>
      <div className="w-2/3 min-w-36">
        <PreviousHintTable previousHints={previousHints} />
      </div>
    </div>
  );
}
