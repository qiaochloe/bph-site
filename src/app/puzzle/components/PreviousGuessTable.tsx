import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { guesses } from "~/server/db/schema";

export function PreviousGuessTable({
  previousGuesses,
}: {
  previousGuesses: (typeof guesses.$inferSelect)[];
}) {
  return (
    <Table>
      {/* <TableHeader>Previous Guesses</TableHeader> */}
      <TableBody>
        {previousGuesses.map((guess) => (
          <TableRow key={guess.id}>
            <TableCell>{guess.guess}</TableCell>
            <TableCell>{guess.isCorrect ? "✅" : "❌"}</TableCell>
            <TableCell>{guess.submitTime.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
