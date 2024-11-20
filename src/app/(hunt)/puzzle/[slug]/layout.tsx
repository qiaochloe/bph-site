import { eq } from "drizzle-orm";
import DefaultHeader from "../components/DefaultHeader";
import { db } from "~/server/db";
import { puzzles } from "~/server/db/schema";

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ slug: string }> }>) {
  const { slug } = await params;

  // Get puzzle name
  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, slug),
  })!;
  if (!puzzle) {
    throw new Error("Puzzle does not exist in database");
  }

  return (
    <div className="flex w-2/3 min-w-36 grow flex-col items-center">
      <DefaultHeader
        puzzleId={slug}
        puzzleName={puzzle.name}
        hasSolution={true}
      />
      {children}
    </div>
  );
}
