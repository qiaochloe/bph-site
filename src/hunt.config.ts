import { and, count, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { teams, guesses, puzzles, hints } from "@/db/schema";

/** REGISTRATION AND HUNT START */

// NOTE: Account for daylight savings time
// All times are in ISO
// https://greenwichmeantime.com/articles/clocks/iso/

export const REGISTRATION_START_TIME = new Date("2024-10-24T05:56:35Z");
export const REGISTRATION_END_TIME = new Date("2024-11-20T05:56:35Z");
export const HUNT_START_TIME = new Date("2024-11-09T05:59:00Z");
export const HUNT_END_TIME = new Date("2024-11-20T05:56:35Z");
export const NUMBER_OF_GUESSES_PER_PUZZLE = 20;

/** Checks whether a team has completed the hunt. This is called every time
 * a team submits a correct guess for a puzzle.
 */
export async function checkFinishHunt(teamId: string, puzzleId: string) {
  let query = await db.select({ count: count() }).from(puzzles);
  const numberOfPuzzles = query[0] ? query[0].count : 0;

  query = await db
    .select({ count: count() })
    .from(guesses)
    .where(and(eq(guesses.teamId, teamId), guesses.isCorrect));
  const numberOfSolves = query[0] ? query[0].count : 0;

  if (numberOfPuzzles === numberOfSolves) {
    await db
      .update(teams)
      .set({ finishTime: new Date() })
      .where(eq(teams.id, teamId));
  }
}

/* HINTING SYSTEM
 * Teams currently get a hint requeset every three hours since the start of the hunt.
 * Teams cannot have more than one outstanding request at a time.
 */

/** Calculates the total number of hints given to a team */
export function getTotalHints(teamId: string) {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - HUNT_START_TIME.getTime(); // In milliseconds
  const rate = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  return Math.floor(timeDifference / rate);
}

/** Calculates the total number of hints available to a team */
export async function getNumberOfHintsRemaining(teamId: string) {
  const totalHints = getTotalHints(teamId);

  const query = await db
    .select({ count: count() })
    .from(hints)
    .where(eq(hints.teamId, teamId));
  const usedHints = query[0]?.count ? query[0].count : 0;

  return totalHints - usedHints;
}
