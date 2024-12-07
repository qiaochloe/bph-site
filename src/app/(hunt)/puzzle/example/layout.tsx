import { redirect } from "next/navigation";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { puzzles } from "~/server/db/schema";

import { puzzleId, SolutionBody } from "./data";
import DefaultHeader from "../components/DefaultHeader";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get puzzle name
  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  })!;
  if (!puzzle) {
    redirect("/404");
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
