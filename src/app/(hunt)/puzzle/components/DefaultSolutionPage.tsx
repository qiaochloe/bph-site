import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { puzzles } from "~/server/db/schema";
import { canViewSolution, HUNT_END_TIME } from "~/hunt.config";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormattedTime } from "~/lib/time";

export default async function DefaultSolutionPage({
  puzzleId,
  solutionBody,
}: {
  puzzleId: string;
  solutionBody: React.ReactNode;
}) {
  // Get puzzle name
  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  })!;
  if (!puzzle) {
    throw new Error("Puzzle does not exist in database");
  }

  // Hide the solution if the user is not an admin, has not solved the puzzle, and the hunt has not ended
  const authorized = await canViewSolution(puzzleId);
  if (!authorized) {
    return (
      <div className="flex w-2/3 min-w-36 grow flex-col items-center justify-center">
        <p>
          The hunt is still ongoing, and the solution for this puzzle has not
          been released yet.
        </p>
        <p>
          All solutions will be available when the hunt ends on{" "}
          <FormattedTime time={HUNT_END_TIME} />.
        </p>
        <p>
          Please return to the{" "}
          <Link
            href={`/puzzle/${puzzleId}`}
            className="text-secondary hover:underline"
          >
            puzzle
          </Link>{" "}
          page.
        </p>
      </div>
    );
  }

  // Check if there is solution
  if (!solutionBody) {
    return <div>There are currently no solutions for this puzzle.</div>;
  }

  return (
    <>
      <div className="mt-4 w-2/3 min-w-36">{solutionBody}</div>
    </>
  );
}
