"use server";

import { db } from "~/server/db";
import {
  puzzles,
  guesses,
  roleEnum,
  interactionModeEnum,
  hints,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { except } from "drizzle-orm/mysql-core";

export function sanitizeAnswer(answer: string) {
  return answer.toUpperCase().replace(/[^A-Z]/g, "");
}

// Remember to handle errors in the GuessForm component
export async function insertGuess(puzzleId: string, guess: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not logged in");
  }

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  });

  if (!puzzle) {
    throw new Error("Puzzle not found");
  }

  guess = sanitizeAnswer(guess);

  // Maybe tell the user if they have already made a guess?
  const duplicateGuess = await db.query.guesses.findFirst({
    where: and(eq(guesses.guess, guess), eq(guesses.teamId, session.user.id)),
  });

  if (duplicateGuess) {
    return;
  }

  await db.insert(guesses).values({
    teamId: session.user.id,
    puzzleId,
    guess,
    isCorrect: sanitizeAnswer(puzzle.answer) === guess,
    submitTime: new Date(),
  });
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
