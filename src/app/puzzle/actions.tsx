'use server'

import { db } from "~/server/db";
import { puzzles, guesses, teams, roleEnum, interactionModeEnum } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { except } from "drizzle-orm/mysql-core";

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