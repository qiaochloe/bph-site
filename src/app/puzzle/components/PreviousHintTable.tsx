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
    <Table>
      {/* <TableHeader>Previous hints</TableHeader> */}
      <TableHead>Request</TableHead>
      <TableHead>Response</TableHead>
      <TableBody>
        {previousHints.map((hint) => (
          <TableRow key={hint.id}>
            <TableCell>{hint.request}</TableCell>
            <TableCell>{hint.response}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
