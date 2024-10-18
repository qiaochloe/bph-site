'use server'

import { db } from "~/server/db";
import { guesses } from "~/server/db/schema";

export async function create(puzzleId: number, guess: string) {
  await db.insert(guesses).values({
    puzzleId: puzzleId,
    guess: guess,
    teamId: 1, // TODO: Get teamId from session
    isCorrect: false, // TODO: Check if guess is correct
  })
}

