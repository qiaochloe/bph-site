import { eq } from "drizzle-orm";
import DefaultHeader from "../components/DefaultHeader";
import { db } from "~/server/db";
import { puzzles } from "~/server/db/schema";
import { puzzleId } from "./data";
import { SolutionBody } from "./data";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get puzzle name
  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  })!;
  if (!puzzle) {
    throw new Error("Puzzle does not exist in database");
  }

  const hasSolution = !!SolutionBody();

  return (
    <div className="flex w-2/3 min-w-36 grow flex-col items-center">
      <DefaultHeader
        puzzleId={puzzleId}
        puzzleName={puzzle.name}
        hasSolution={hasSolution}
      />
      {children}
    </div>
  );
}
