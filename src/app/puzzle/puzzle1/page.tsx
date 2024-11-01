"use server";

import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

import { db } from "~/server/db";
import { guesses, hints } from "~/server/db/schema";
import { GuessForm } from "~/app/puzzle/components/GuessForm";
import { HintForm } from "~/app/puzzle/components/HintForm";
import { PreviousGuessTable } from "~/app/puzzle/components/PreviousGuessTable";
import { PreviousHintTable } from "~/app/puzzle/components/PreviousHintTable";
import { NUMBER_OF_GUESSES_PER_PUZZLE } from "~/hunt.config";

// TODO: Dynamically get the puzzle ID from the URL
// #BadFirstIssue
const PUZZLE_ID = "puzzle1";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id)
    return <div>You are not authorized to view this puzzle</div>;

  const previousGuesses = await db.query.guesses.findMany({
    where: and(
      eq(guesses.teamId, session.user.id),
      eq(guesses.puzzleId, PUZZLE_ID),
    ),
  });

  const hasCorrectGuess = previousGuesses.some((guess) => guess.isCorrect);
  const numberOfGuessesLeft =
    NUMBER_OF_GUESSES_PER_PUZZLE - previousGuesses.length;

  const previousHints = await db.query.hints.findMany({
    where: and(
      eq(hints.teamId, session.user.id),
      eq(hints.puzzleId, PUZZLE_ID),
    ),
  });

  return (
    <div className="flex min-h-screen flex-col items-center">
      <h1 className="m-4">Puzzle!</h1>
      <p className="m-4">What is the answer to this puzzle?</p>
      {!hasCorrectGuess && numberOfGuessesLeft > 0 && (
        <GuessForm
          puzzleId={PUZZLE_ID}
          numberOfGuessesLeft={numberOfGuessesLeft}
        />
      )}
      {numberOfGuessesLeft === 0 && !hasCorrectGuess && (
        <div>You have no guesses left. Please contact HQ for help.</div>
      )}

      <h1 className="m-4">Previous Guesses</h1>
      <PreviousGuessTable previousGuesses={previousGuesses} />

      <HintForm puzzleId={PUZZLE_ID} />

      <h1 className="m-4">Previous Hints</h1>
      <div className="w-1/2">
        <PreviousHintTable previousHints={previousHints} />
      </div>
    </div>
  );
}
