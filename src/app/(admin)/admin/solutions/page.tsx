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

export const fetchCache = "force-no-store";

export default async function Home() {
  const allPuzzles = await db.query.puzzles.findMany({
    columns: { id: true, name: true, answer: true },
  });

  const allPuzzlesWithNextUnlocks = await Promise.all(
    allPuzzles.map(async (puzzle) => ({
      ...puzzle,
      nextUnlocks: await Promise.all(
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
      ),
    })),
  );

  return (
    <div className="flex grow flex-col items-center p-4">
      <h1 className="mb-2">Solutions!</h1>
      <div className="min-w-[40%]">
        <Table className="justify-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Puzzle</TableHead>
              <TableHead className="w-1/3">Answer</TableHead>
              <TableHead className="w-1/3">Next Unlock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPuzzlesWithNextUnlocks
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
