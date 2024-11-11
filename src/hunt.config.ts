import { insertUnlock } from "./app/(hunt)/puzzle/actions";
import { db } from "./server/db";
import { teams, puzzles, guesses, hints } from "./server/db/schema";
import { and, count, eq } from "drizzle-orm";

/** REGISTRATION AND HUNT START */

// NOTE: Account for daylight savings time
// All times are in ISO
// https://greenwichmeantime.com/articles/clocks/iso/

export const REGISTRATION_START_TIME = new Date("2024-10-24T05:56:35Z");
export const REGISTRATION_END_TIME = new Date("2024-11-20T05:56:35Z");
export const HUNT_START_TIME = new Date("2024-11-09T05:59:00Z");
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
 * Teams currently get a hint request every three hours since the start of the hunt.
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

/** PUZZLE UNLOCK SYSTEM
 * WARNING: make sure that everything here is a valid puzzle ID.
 * You should really avoid changing anything here after the hunt starts
 */

/** Puzzles available at the beginning of the hunt that will never need to be unlocked by the team.
 * This is currently set to the first puzzle in the database alphabetically.
 */
export const INTIIAL_PUZZLES = async () => {
  const firstPuzzle = (await db.query.puzzles.findMany()).sort((a, b) =>
    a.name.localeCompare(b.name),
  )[0];
  const INITIAL_PUZZLES: string[] = firstPuzzle ? [firstPuzzle.id] : [];
  return INITIAL_PUZZLES;
};

/** Returns a map for the next puzzles unlocked after a puzzle is solved.
 * This is currently set to a sequential unlock, sorted alphabetically by puzzle name.
 */
export async function getNextPuzzleMap() {
  /* Example: list unlock */
  const puzzles = (
    await db.query.puzzles.findMany({ columns: { id: true, name: true } })
  ).sort((a, b) => a.name.localeCompare(b.name));

  const nextPuzzleMap: Record<string, { id: string; name: string }[] | null> =
    puzzles.reduce(
      (map, puzzle, index) => {
        const nextPuzzle = puzzles[index + 1];
        if (nextPuzzle) {
          map[puzzle.id] = [nextPuzzle];
        }
        return map;
      },
      {} as Record<string, { id: string; name: string }[] | null>,
    );

  return nextPuzzleMap;

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
}

/**
 * Runs every time a team solves a puzzle.
 */
// export async function unlockPuzzleAfterSolve(teamId: string, puzzleId: string) {
//   const nextPuzzles = (await getNextPuzzleMap())[puzzleId];

//   if (!nextPuzzles) {
//     return null;
//   }

//   await insertUnlock(
//     teamId,
//     nextPuzzles.map((puzzle) => puzzle.id),
//   );
// 

/** Checks whether a team has completed the hunt. This is called every time
 * a team submits a correct guess for a puzzle.
 */
