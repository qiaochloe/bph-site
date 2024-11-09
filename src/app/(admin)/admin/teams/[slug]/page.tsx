"use server";

import { auth } from "~/server/auth/auth";
import { db } from "@/db/index";
import { guesses, hints, teams, puzzles } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

import Toast from "../components/team-page/Toast";
import PuzzleInfoBox from "../components/team-page/PuzzleInfoBox";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Authentication
  const session = await auth();
  if (!session?.user?.id) {
    return <p>Not authenticated.</p>;
  }

  const { slug } = await params;
  const username = String(slug);

  // Check if slug is a valid username
  const team = await db.query.teams.findFirst({
    where: eq(teams.username, username),
  });

  if (!team) {
    return (
      <Toast
        title={"Team not found"}
        description={`No team with username ${slug} was found.`}
      />
    );
  }

  const previousGuesses = await db.query.guesses.findMany({
    where: eq(guesses.teamId, team.id),
  });

  const attemptedPuzzles = await db.query.puzzles.findMany({
    where: inArray(
      puzzles.id,
      previousGuesses.map((guess) => guess.puzzleId),
    ),
  });

  const requestedHints = (
    await db.query.hints.findMany({
      with: {
        team: { columns: { displayName: true } },
        claimer: { columns: { id: true, displayName: true } },
        puzzle: { columns: { name: true } },
      },
      where: eq(hints.teamId, team.id),
    })
  ).sort((a, b) => b.requestTime!.getTime() - a.requestTime!.getTime());

  return (
    <div className="flex w-2/3 min-w-36 grow flex-col">
      <div className="flex flex-col items-center">
        <h1>Team Name: {team.displayName}</h1>
        <PuzzleInfoBox
          team={team}
          puzzleList={attemptedPuzzles}
          guessList={previousGuesses}
          hintList={requestedHints}
        />
      </div>
    </div>
  );
}
