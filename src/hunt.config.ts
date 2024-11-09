import { insertUnlock } from "./app/(hunt)/puzzle/actions";
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

/** PUZZLE UNLOCK SYSTEM
 * WARNING: make sure that everything here is a valid puzzle ID.
 * You should really avoid changing anything here after the hunt starts
 */

const firstPuzzle = (await db.query.puzzles.findMany()).sort((a, b) =>
  a.name.localeCompare(b.name),
)[0];

/** Puzzles available at the beginning of the hunt that will never need to be unlocked by the team.
 * This is currently set to the first puzzle in the database alphabetically.
 */
export const INITIAL_PUZZLES: string[] = firstPuzzle ? [firstPuzzle.id] : [];

/** Handles puzzle unlocks after a puzzle is solved.
 * This is currently set to a sequential unlock, sorted alphabetically by puzzle name.
 */
export async function unlockPuzzleAfterSolve(teamId: string, puzzleId: string) {
  /* Example: list unlock */
  const puzzles = (await db.query.puzzles.findMany()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const nextIndex = puzzles.findIndex(({ id }) => id == puzzleId) + 1;

  if (!puzzles[nextIndex]) {
    return null;
  }

  await insertUnlock(teamId, [puzzles[nextIndex].id]);

  /* Example: adjacency list unlock

  const PUZZLE_UNLOCK_MAP: { [key: string]: string[] } = {
    puzzle1: ["puzzle1", "puzzle2", "hello"],
    puzzle2: ["hello", "sorry"],
    hello: ["sorry", "puzzle2", "puzzle1"],
    sorry: ["sorry", "puzzle2", "puzzle1"],
  };

  if (PUZZLE_UNLOCK_MAP[puzzleId]) {
    await insertUnlock(teamId, PUZZLE_UNLOCK_MAP[puzzleId]);
  }
  */

  return null;
}

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
