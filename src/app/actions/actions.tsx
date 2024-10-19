'use server'

import { db } from "~/server/db";
import { puzzles, guesses } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "~/server/auth";

export async function insertGuess(puzzleId: string, guess: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not logged in");
  }

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId)
  });

  if (!puzzle) {
    throw new Error("Puzzle not found");
  } 

  await db.insert(guesses).values({
    puzzleId: puzzleId,
    guess: guess,
    teamId: session.user.id,
    isCorrect: puzzle.answer === guess,
  })
}
