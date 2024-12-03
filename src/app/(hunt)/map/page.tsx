import Link from "next/link";
import "@pixi/events";
import Map from "./Map";
import { auth } from "~/server/auth/auth";
import { db } from "~/server/db";
import { unlocks } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import {
  PuzzleSection,
  PuzzleBlock,
  numberToPuzzleBlock,
  numberToPuzzleSections,
  numberToPuzzleIcon,
  numberToPuzzlePieces,
} from "./types";
import { puzzlesToNumbers, INITIAL_PUZZLES } from "~/hunt.config";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="mx-auto my-auto">
        <div>
          <Link href="/login" className="text-perwinkle hover:underline">
            Login
          </Link>{" "}
          to see the map.
        </div>
      </div>
    );
  }

  // Get unlocked blocks
  var puzzleBlocks: PuzzleBlock[] = [];
  var puzzleSections: PuzzleSection[] = [];
  var puzzleIcons: PuzzleBlock[] = [];
  var puzzlePieces: PuzzleSection[] = [];

  // Includes puzzles in unlock table and initial puzzles
  const unlockedPuzzles = [
    ...INITIAL_PUZZLES,
    ...(
      await db.query.unlocks.findMany({
        columns: { puzzleId: true },
        where: eq(unlocks.teamId, session.user.id),
      })
    )?.map((unlock) => unlock.puzzleId),
  ];

  for (const puzzleId of unlockedPuzzles) {
    const puzzleNumber = puzzlesToNumbers[puzzleId]!;

    const puzzleBlock = numberToPuzzleBlock[puzzleNumber]!;
    puzzleBlocks.push({ ...puzzleBlock, puzzleId: puzzleId });

    const puzzleIcon = numberToPuzzleIcon[puzzleNumber]!;
    puzzleIcons.push({ ...puzzleIcon, puzzleId: puzzleId });

    const puzzlePiece = numberToPuzzlePieces[puzzleNumber]!;
    if (puzzlePieces) {
      puzzlePieces = puzzlePieces.concat(puzzlePiece);
    }

    const puzzleSection = numberToPuzzleSections[puzzleNumber];
    if (puzzleSection) {
      puzzleSections = puzzleSections.concat(puzzleSection);
    }
  }

  // NOTE: This must be non-empty.
  // const unlockedPuzzles = [
  //   1, 2, 3, 5, 7, 9, 11, 13, 15, 4, 17, 6, 8, 10, 12, 22, 14, 19, 16, 18, 20,
  //   21, 23,
  // ];
  // const unlockedPuzzles = [
  //   0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  //   21, 22, 23,
  // ];

  // for (const number of unlockedPuzzles) {
  //   puzzleSections = puzzleSections.concat(numberToPuzzleSections[number]!);
  //   puzzlePieces = puzzlePieces.concat(numberToPuzzlePieces[number]!);

  //   puzzleBlocks.push({
  //     ...numberToPuzzleBlock[number]!,
  //     puzzleId: numbersToPuzzles[number]!,
  //   });

  //   puzzleIcons.push({
  //     ...numberToPuzzleIcon[number]!,
  //     puzzleId: numbersToPuzzles[number]!,
  //   });
  // }

  const uniquePuzzleSections = Array.from(new Set(puzzleSections));
  const uniquePuzzleBlocks = Array.from(new Set(puzzleBlocks));
  const uniquePuzzleIcons = Array.from(new Set(puzzleIcons));
  const uniquePuzzlePieces = Array.from(new Set(puzzlePieces));

  return (
    <div className="mx-auto mb-10">
      <h1 className="mb-6 text-center">Map!</h1>
      <Map
        puzzleIcons={uniquePuzzleIcons}
        puzzleSections={uniquePuzzleSections}
        puzzleBlocks={uniquePuzzleBlocks}
        puzzlePieces={uniquePuzzlePieces}
      />
    </div>
  );
}
