import { eq } from "drizzle-orm";
import { db } from "./server/db";
import { teams } from "./server/db/schema";

/** REGISTRATION AND HUNT START */

// NOTE: Account for daylight savings time
// All times are in ISO
// https://greenwichmeantime.com/articles/clocks/iso/

export const REGISTRATION_START_TIME = new Date("2024-10-24T05:56:35Z");
export const REGISTRATION_END_TIME = new Date("2024-11-20T05:56:35Z");
export const HUNT_START_TIME = new Date("2024-10-24T05:59:00Z");
export const HUNT_END_TIME = new Date("2024-11-20T05:56:35Z");
export const NUMBER_OF_GUESSES_PER_PUZZLE = 20;

/** Checks whether a team has completed the hunt. This is called every time
 * a team submits a correct guess for a puzzle.
 */
export async function checkFinishHunt(teamId: string, puzzleId: string) {
  const lastPuzzle = (await db.query.puzzles.findMany())
    .sort((a, b) => a.name.localeCompare(b.name))
    .at(-1);

  if (lastPuzzle && puzzleId === lastPuzzle.id) {
    db.update(teams)
      .set({ finishTime: new Date() })
      .where(eq(teams.id, teamId));
  }
}
