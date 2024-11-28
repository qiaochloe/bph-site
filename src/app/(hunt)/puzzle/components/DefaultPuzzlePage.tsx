import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { guesses, errata } from "~/server/db/schema";

import PreviousGuessTable from "./PreviousGuessTable";
import ErratumDialog from "./ErratumDialog";
import GuessForm from "./GuessForm";
import { canViewPuzzle, NUMBER_OF_GUESSES_PER_PUZZLE } from "~/hunt.config";
import CopyButton from "./CopyButton";

export default async function DefaultPuzzlePage({
  puzzleId,
  puzzleBody,
  copyText,
}: {
  puzzleId: string;
  puzzleBody: React.ReactNode;
  copyText: string | null;
}) {
  // Get user
  const session = await auth()!;
  if (!session?.user?.id || !(await canViewPuzzle(puzzleId))) {
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

      <div className="flex w-2/3 min-w-36 justify-center space-x-2">
        <div className="mt-4">{puzzleBody}</div>
        {copyText && <CopyButton copyText={copyText}></CopyButton>}
      </div>

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

      <h2>Previous Guesses</h2>
      <div className="mb-4">
        <PreviousGuessTable previousGuesses={previousGuesses} />
      </div>
    </>
  );
}
