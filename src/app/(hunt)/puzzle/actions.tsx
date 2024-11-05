"use server";

import { db } from "@/db/index";
import { puzzles, guesses, hints } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { NUMBER_OF_GUESSES_PER_PUZZLE } from "~/hunt.config";
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
}

export async function insertHint(puzzleId: string, hint: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not logged in");
  }

  await db.insert(hints).values({
    teamId: session.user.id,
    puzzleId,
    request: hint,
    requestTime: new Date(),
    status: "no_response",
  });
}
