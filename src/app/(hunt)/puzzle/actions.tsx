"use server";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { db } from "@/db/index";
import { puzzles, guesses, hints, unlocks } from "@/db/schema";
import { and, isNull, eq } from "drizzle-orm";
import { auth } from "@/auth";
import {
  getNumberOfHintsRemaining,
  unlockPuzzleAfterSolve,
  checkFinishHunt,
  NUMBER_OF_GUESSES_PER_PUZZLE,
  INITIAL_PUZZLES,
} from "~/hunt.config";

/** Inserts a guess into the guess table */
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
    await unlockPuzzleAfterSolve(session.user.id, puzzleId);
    await checkFinishHunt(session.user.id, puzzleId);
  }
}

/** Inserts a hint into the hint table */
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

// TODO: this function is very slow
/** Inserts a puzzle unlock into the unlock table */
export async function insertUnlock(teamId: string, puzzleIds: string[]) {
  try {
    const currDate = new Date();

    // Check if team has already unlocked the puzzle
    const unlockedPuzzles = await db.query.unlocks.findMany({
      columns: { puzzleId: true },
      where: eq(unlocks.teamId, teamId),
    });

    const initialPuzzles = await INITIAL_PUZZLES();

    const newPuzzleIds = puzzleIds.filter(
      (puzzleId) =>
        !unlockedPuzzles.some((unlock) => unlock.puzzleId === puzzleId) &&
        !initialPuzzles.some((initial) => initial === puzzleId),
    );

    // Check for empty list
    if (newPuzzleIds.length == 0) {
      return;
    }

    // Insert new unlocks into the unlock table
    const newUnlocks = newPuzzleIds.map((puzzleId) => ({
      teamId,
      puzzleId,
      unlockTime: currDate,
    }));

    await db.insert(unlocks).values(newUnlocks);
    revalidatePath("/puzzle");
  } catch (e) {
    throw e;
  }
}
