import { auth } from "@/auth";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { guesses, hints, puzzles } from "~/server/db/schema";
import PreviousHintTable from "./PreviousHintTable";
import HintForm from "./HintForm";
import {
  getNumberOfHintsRemaining,
  NUMBER_OF_GUESSES_PER_PUZZLE,
} from "~/hunt.config";
import DefaultHeader from "./DefaultHeader";

export default async function DefaultHintsPage({
  puzzleId,
}: {
  puzzleId: string;
}) {
  // Get user id
  const session = await auth()!;
  if (!session?.user?.id) {
    throw new Error("Not authorized");
  }

  // Check if puzzle is solved
  const isSolved = !!(await db.query.guesses.findFirst({
    where: and(
      eq(guesses.teamId, session.user.id),
      eq(guesses.puzzleId, puzzleId),
      guesses.isCorrect,
    ),
  }));

  // Get previous hints
  const previousHints = await db.query.hints.findMany({
    where: and(eq(hints.teamId, session.user.id), eq(hints.puzzleId, puzzleId)),
    columns: { id: true, request: true, response: true, status: true },
  });

  const hintsRemaining = await getNumberOfHintsRemaining(session.user.id);

  const query = await db.query.hints.findFirst({
    columns: {},
    where: and(
      eq(hints.teamId, session.user.id),
      eq(hints.status, "no_response"),
    ),
    with: { puzzle: { columns: { id: true, name: true } } },
  });
  const unansweredHint = query
    ? { puzzleId: query.puzzle.id, puzzleName: query.puzzle.name }
    : null;

  // Get puzzle name
  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  })!;
  if (!puzzle) {
    throw new Error("Puzzle does not exist in database");
  }

  return (
    <>
      <div className="mb-4 w-2/3 min-w-36">
        <HintForm
          puzzleId={puzzleId}
          hintsRemaining={hintsRemaining}
          unansweredHint={unansweredHint}
          isSolved={isSolved}
        />
      </div>

      <h2 className="mb-2">Previous Hints</h2>
      <div className="w-2/3 min-w-36">
        <PreviousHintTable previousHints={previousHints} />
      </div>
    </>
  );
}
