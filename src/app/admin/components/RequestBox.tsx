import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Row } from "@tanstack/react-table";

export function RequestBox<TData>({ row }: { row: Row<TData> }) {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={`hint-request-${row.getValue("id")}`}>Request</Label>
      <Textarea
        value={row.getValue("request")}
        id={`hint-request-${row.getValue("id")}`}
        readOnly
      />
    </div>
  );
}
