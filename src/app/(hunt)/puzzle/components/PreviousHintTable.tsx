import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableProps = {
  id: number;
  request: string;
  response: string | null;
}[];

export default function PreviousHintTable({
  previousHints,
}: {
  previousHints: TableProps;
}) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-center">Request</TableHead>
          <TableHead className="text-center">Response</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {previousHints.map((hint) => (
          <TableRow key={hint.id} className="hover:">
            <TableCell className="break-words">{hint.request}</TableCell>
            <TableCell className="break-words">{hint.response}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
