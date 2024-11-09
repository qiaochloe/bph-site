// NOTE: Account for daylight savings time
// All times are in ISO
// https://greenwichmeantime.com/articles/clocks/iso/

import { db } from "@/db/index";
import { eq } from "drizzle-orm";
import { count } from "drizzle-orm";
import { hints } from "@/db/schema";

export const REGISTRATION_START_TIME = new Date("2024-10-24T05:56:35Z");
export const REGISTRATION_END_TIME = new Date("2024-11-20T05:56:35Z");
export const HUNT_START_TIME = new Date("2024-10-24T05:59:00Z");
export const HUNT_END_TIME = new Date("2024-11-20T05:56:35Z");
export const NUMBER_OF_GUESSES_PER_PUZZLE = 20;

export function getTotalHints(teamId: string) {
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - HUNT_START_TIME.getTime(); // In milliseconds
  const rate = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  return Math.floor(timeDifference / rate);
}

export async function numberOfHintsRemaining(teamId: string) {
  const totalHints = getTotalHints(teamId);

  const query = await db
    .select({ count: count() })
    .from(hints)
    .where(eq(hints.teamId, teamId));
  const usedHints = query[0]?.count ? query[0].count : 0;

  return totalHints - usedHints;
}
