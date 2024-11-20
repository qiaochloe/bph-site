import { db } from "~/server/db";
import DefaultPuzzlePage from "../components/DefaultPuzzlePage";
import { PuzzleBody } from "./data";

// Send to 404 if route was not generated at build-time
export const dynamicParams = false;

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const puzzles = await db.query.puzzles.findMany({ columns: { id: true } });
  return puzzles.map((puzzle) => ({ slug: puzzle.id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DefaultPuzzlePage puzzleId={slug} puzzleBody={PuzzleBody()} />;
}
