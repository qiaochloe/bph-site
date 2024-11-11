"use server";

import { db } from "@/db/index";
import { puzzles, guesses, hints } from "@/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { auth } from "@/auth";
import {
  checkFinishHunt,
  getNumberOfHintsRemaining,
  NUMBER_OF_GUESSES_PER_PUZZLE,
} from "~/hunt.config";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

// TODO: Handle errors in the GuessForm component
export async function insertGuess(puzzleId: string, guess: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not logged in");
  }

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
    with: {
      guesses: {
        where: eq(guesses.teamId, session.user.id),
      },
    },
  });

  if (!puzzle) {
    throw new Error("Puzzle not found");
  }

  if (puzzle.guesses.length >= NUMBER_OF_GUESSES_PER_PUZZLE) {
    revalidatePath(`/puzzle/${puzzleId}`);
    return;
  }

  if (puzzle.guesses.find((g) => g.guess === guess)) {
    return { error: "Already guessed!" };
  }

  await db.insert(guesses).values({
    teamId: session.user.id,
    puzzleId,
    guess,
    isCorrect: puzzle.answer === guess,
    submitTime: new Date(),
  });

  revalidatePath(`/puzzle/${puzzleId}`);

  if (puzzle.answer === guess) {
    await checkFinishHunt(session.user.id, puzzleId);
  }
}

export async function insertHint(puzzleId: string, hint: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not logged in");
  }

  const hasHint = (await getNumberOfHintsRemaining(session.user.id)) > 0;
  const hasUnansweredHint = (await db.query.hints.findFirst({
    columns: { id: true },
    where: and(eq(hints.teamId, session.user.id), isNull(hints.response)),
  }))
    ? true
    : false;

  // Check the the team has a hint
  if (hasHint && !hasUnansweredHint) {
    await db.insert(hints).values({
      teamId: session.user.id,
      puzzleId,
      request: hint,
      requestTime: new Date(),
      status: "no_response",
    });
  }
}
