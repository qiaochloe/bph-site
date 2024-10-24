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

export async function insertTeam(username: string, displayName: string, password: string, interactionMode: (typeof interactionModeEnum.enumValues)[number]) {
  // TODO: check if team already exists
  // Also hash and salt the password
  await db.insert(teams).values({
    username,
    displayName,
    password,
    role: "user" as const,
    interactionMode,
    createTime: new Date(),
  })
}

export async function login(username: string, password: string) {
  try {
    await signIn("credentials", { username, password, redirect: false });
    return { error: null }
  } catch (error) {
    if (error instanceof AuthError) {
        return { error: 'Username or password is incorrect' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  } 
}

export async function logout() {
  await signOut();
}