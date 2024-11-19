import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { guesses } from "~/server/db/schema";

export default function PreviousGuessTable({
  previousGuesses,
}: {
  previousGuesses: (typeof guesses.$inferSelect)[];
}) {
  return (
    <Table>
      <TableBody>
        {previousGuesses
          .sort((a, b) => b.submitTime.getTime() - a.submitTime.getTime())
          .map((guess) => (
            <TableRow key={guess.id}>
              <TableCell className="min-w-2/3">{guess.guess}</TableCell>
              <TableCell>
                {guess.isCorrect ? (
                  <p className="text-emerald-600">CORRECT</p>
                ) : (
                  <p className="text-rose-600">INCORRECT</p>
                )}
              </TableCell>
              <TableCell className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {guess.submitTime.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
