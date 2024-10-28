'use server'

import { db } from "~/server/db";
import { puzzles, guesses, roleEnum, interactionModeEnum, hints } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { except } from "drizzle-orm/mysql-core";

// TODO: don't let teams submit the same guess twice
// Remember to handle errors in the GuessForm component
// #GoodFirstIssue
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
    teamId: session.user.id,
    puzzleId,
    guess,
    isCorrect: puzzle.answer === guess,
    submitTime: new Date(),
  })
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
  })
}
