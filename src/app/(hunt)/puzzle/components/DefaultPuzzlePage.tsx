import { auth } from "@/auth";
import { eq, and, isNull } from "drizzle-orm";

import { db } from "~/server/db";
import { guesses, hints, errata, puzzles } from "~/server/db/schema";

import PreviousGuessTable from "../components/PreviousGuessTable";
import PreviousHintTable from "../components/PreviousHintTable";
import ErratumDialog from "../components/ErratumDialog";
import HintForm from "../components/HintForm";
import GuessForm from "../components/GuessForm";
import { getTotalHints, NUMBER_OF_GUESSES_PER_PUZZLE } from "~/hunt.config";
import GuessStatisticsInfo from "~/app/(admin)/admin/puzzles/components/GuessStatisticsInfo";

// TODO: database queries can definitely be more efficient
// See drizzle

export default async function DefaultPuzzlePage({
  puzzleId,
  puzzleBody,
}: {
  puzzleId: string;
  puzzleBody: React.ReactNode;
}) {
  // Get user id
  const session = await auth()!;
  if (!session?.user?.id) {
    throw new Error("Not authorized");
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

  // Get previous hints
  const previousHints = await db.query.hints.findMany({
    where: and(eq(hints.teamId, session.user.id), eq(hints.puzzleId, puzzleId)),
    columns: { id: true, request: true, response: true },
  });

  const hintsRemaining = getTotalHints(session.user.id) - previousHints.length;

  const query = await db.query.hints.findFirst({
    columns: {},
    where: and(eq(hints.teamId, session.user.id), isNull(hints.response)),
    with: { puzzle: { columns: { id: true, name: true } } },
  });
  const unansweredHint = query
    ? { puzzleId: query.puzzle.id, puzzleName: query.puzzle.name }
    : null;

  // Get puzzle name
  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  })!;
  if (!puzzle) {
    throw new Error("Puzzle does not exist in database");
  }

  return (
    <div className="flex w-2/3 min-w-36 grow flex-col items-center">
      <div className="w-2/3 min-w-36">
        <ErratumDialog errataList={errataList} />
      </div>

      <h1 className="mb-4">{puzzle.name}</h1>
      {puzzleBody}
      {session.user.role === "admin" && (
        <GuessStatisticsInfo puzzleId={puzzleId} />
      )}

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

      {hasCorrectGuess || (
        <div className="mb-4 w-2/3 min-w-36">
          <HintForm
            puzzleId={puzzleId}
            hintsRemaining={hintsRemaining}
            unansweredHint={unansweredHint}
          />
        </div>
      )}

      <h2 className="mb-2">Previous Hints</h2>
      <div className="w-2/3 min-w-36">
        <PreviousHintTable previousHints={previousHints} />
      </div>
    </div>
  );
}
