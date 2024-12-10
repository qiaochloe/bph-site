import Link from "next/link";
import { db } from "@/db/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getNextUnlocks } from "~/hunt.config";
import { eq } from "drizzle-orm";
import { puzzles } from "~/server/db/schema";
import { Check, Clipboard, KeyRound, Puzzle } from "lucide-react";
import CopyButton from "./CopyButton";

export const fetchCache = "force-no-store";

export default async function Home() {
  const allPuzzles = await db.query.puzzles.findMany({
    columns: { id: true, name: true, answer: true },
  });

  const allPuzzlesWithEverything = await Promise.all(
    allPuzzles.map(async (puzzle) => {
      const nextUnlocks = await Promise.all(
        getNextUnlocks(puzzle.id).map(async (nextUnlock) => ({
          id: nextUnlock,
          name:
            (
              await db.query.puzzles.findFirst({
                where: eq(puzzles.id, nextUnlock),
                columns: { name: true },
              })
            )?.name || "",
        })),
      );

      var puzzleBody;
      var solutionBody;
      var copyText;

      try {
        const module = await import(
          `../../../(hunt)/puzzle/${puzzle.id}/data.tsx`
        );
        puzzleBody = !!module.PuzzleBody;
        solutionBody = !!module.SolutionBody;
        copyText = module.copyText;
      } catch (e) {
        puzzleBody = false;
        solutionBody = false;
        copyText = null;
      }

      return {
        ...puzzle,
        nextUnlocks: nextUnlocks,
        puzzleBody: puzzleBody,
        solutionBody: solutionBody,
        copyText: copyText,
      };
    }),
  );

  return (
    <div className="flex grow flex-col items-center p-4">
      <h1 className="mb-2">Solutions!</h1>
      <div className="min-w-[60%]">
        <Table className="justify-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Name</TableHead>
              <TableHead className="w-1/3">Answer</TableHead>
              <TableHead className="w-1/3">Next Unlock</TableHead>
              <TableHead className="w-4">Puzzle</TableHead>
              <TableHead className="w-4">Solution</TableHead>
              <TableHead className="w-4">Copy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPuzzlesWithEverything
              // If both puzzles have null times, sort alphabetically
              // Otherwise, prioritize the puzzle with null time
              // If neither puzzles have null times, sort by earliest unlock
              .sort((a, b) => {
                return a.name.localeCompare(b.name);
              })
              .map((puzzle) => (
                <TableRow key={puzzle.id}>
                  <TableCell>
                    <Link
                      className="text-blue-600 hover:underline"
                      href={`/puzzle/${puzzle.id}`}
                    >
                      {puzzle.name.trim() ? puzzle.name : `[${puzzle.id}]`}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p className="text-emerald-600">{puzzle.answer}</p>
                  </TableCell>
                  <TableCell>
                    {puzzle.nextUnlocks.map((nextUnlock) => (
                      <>
                        <>[</>
                        <Link
                          key={nextUnlock.id}
                          href={`/puzzle/${nextUnlock.id}`}
                          className="hover:underline"
                        >
                          {nextUnlock.name}
                        </Link>
                        <>] </>
                      </>
                    ))}
                  </TableCell>
                  <TableCell className="justify-center">
                    {puzzle.puzzleBody && (
                      <div className="flex justify-center">
                        <Link href={`/puzzle/${puzzle.id}`}>
                          <Puzzle className="text-red-500" />
                        </Link>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="justify-center">
                    {puzzle.solutionBody && (
                      <div className="flex justify-center">
                        <Link href={`/puzzle/${puzzle.id}/solution`}>
                          <KeyRound className="text-yellow-500" />
                        </Link>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="justify-center">
                    {puzzle.copyText && (
                      <div className="flex justify-center">
                        <CopyButton copyText={puzzle.copyText} />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
