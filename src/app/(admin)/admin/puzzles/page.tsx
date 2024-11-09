"use server";
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
import { getNextPuzzleMap } from "~/hunt.config";

export default async function Home() {
  const puzzles = await db.query.puzzles.findMany({
    columns: { id: true, name: true, answer: true },
  });

  const nextPuzzlesMap = await getNextPuzzleMap();

  return (
    <div className="flex grow flex-col items-center">
      <h1 className="mb-2">Puzzles!</h1>
      <div className="w-1/3">
        <Table className="justify-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Puzzle</TableHead>
              <TableHead className="w-1/3">Answer</TableHead>
              <TableHead className="w-1/3">Next Unlock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {puzzles
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
                      {puzzle.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <p className="text-emerald-600">{puzzle.answer}</p>
                  </TableCell>
                  <TableCell>
                    {nextPuzzlesMap[puzzle.id] &&
                      nextPuzzlesMap[puzzle.id]?.map((puzzle) => (
                        <Link href={`/puzzle/${puzzle.id}`} className="hover:underline">{puzzle.name}</Link>
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
