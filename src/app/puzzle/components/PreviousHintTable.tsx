import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { hints } from "~/server/db/schema";

// TODO: Make the table not expand when there is a hint with a long request
// #GoodFirstIssue
export function PreviousHintTable({
  previousHints,
}: {
  previousHints: (typeof hints.$inferSelect)[];
}) {
  return (
    <Table className="table-fixed">
      {/* <TableHeader>Previous hints</TableHeader> */}
      <TableHead>Request</TableHead>
      <TableHead>Response</TableHead>
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
