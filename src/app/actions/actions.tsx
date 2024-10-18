'use server'

import { db } from "~/server/db";
import { guesses } from "~/server/db/schema";

export async function create(puzzleId: string, guess: string) {
  await db.insert(guesses).values({
    puzzleId: puzzleId,
    guess: guess,
    teamId: "team-1", // TODO: Get teamId from session
    isCorrect: false, // TODO: Check if guess is correct
  })
}