import { db } from "~/server/db";
import DefaultPuzzlePage from "../components/DefaultPuzzlePage";

// Send to 404 if route was not generated at build-time
export const dynamicParams = false;
// export const dynamic = 'force-static'

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const puzzles = await db.query.puzzles.findMany();
  return puzzles.map((puzzle) => ({ slug: puzzle.id }));
}

export function PuzzleBody() {
  return <p>This is a dynamic route.</p>;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DefaultPuzzlePage puzzleId={slug} puzzleBody={PuzzleBody()} />;
}
