import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hints } from "~/server/db/schema";

export default function PreviousHintTable({
  previousHints,
}: {
  previousHints: (typeof hints.$inferSelect)[];
}) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Request</TableHead>
          <TableHead className="text-center">Response</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {previousHints.map((hint) => (
          <TableRow key={hint.id}>
            <TableCell className="break-words">{hint.request}</TableCell>
            <TableCell className="break-words">{hint.response}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
