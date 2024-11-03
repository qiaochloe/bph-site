import { Row } from "@tanstack/react-table";
import { Label } from "~/components/ui/label";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";

export default function RequestBox<TData>({ row }: { row: Row<TData> }) {
  return (
    <div className="my-4 grid w-full gap-1.5">
      <Label htmlFor={`hint-request-${row.getValue("id")}`}>Request</Label>
      <AutosizeTextarea
        maxHeight={500}
        className="resize-none"
        value={row.getValue("request")}
        id={`hint-request-${row.getValue("id")}`}
        readOnly
      />
    </div>
  );
}
