import { z } from "zod";
import { eq } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

import { puzzles, guesses } from "~/server/db/schema";

export const puzzleRouter = createTRPCRouter({
  createGuess: protectedProcedure
    .input(z.object({ puzzleId: z.string(), guess: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx. db.insert(guesses).values({
        puzzleId: input.puzzleId,
        guess: input.guess,
        teamId: "team-1", // TODO: get teamId from session
      })
    })
});
