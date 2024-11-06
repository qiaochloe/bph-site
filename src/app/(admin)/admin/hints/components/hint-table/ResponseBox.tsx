import { Row } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { respondToHint } from "../../actions";

export default function ResponseBox<TData>({
  row,
  currHinter,
}: {
  row: Row<TData>;
  currHinter: string;
}) {
  if (row.getValue("response")) {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={`hint-response-${row.getValue("id")}`}>Response</Label>
        <AutosizeTextarea
          maxHeight={500}
          value={row.getValue("response")}
          id={`hint-response-${row.getValue("id")}`}
          readOnly
        />
      </div>
    );
  }

  if (row.getValue("claimer") == currHinter)
    return (
      <div className="full grid gap-1.5">
        <Label htmlFor={`hint-response-${row.getValue("id")}`}>Response</Label>
        <AutosizeTextarea
          maxHeight={500}
          className="resize-none"
          placeholder="No response yet"
          id={`hint-response-${row.getValue("id")}`}
        />
        <Button
          className="mt-4 w-fit"
          onClick={() => {
            const textarea = document.getElementById(
              `hint-response-${row.getValue("id")}`,
            ) as HTMLTextAreaElement;
            respondToHint(row.getValue("id"), textarea.value);
          }}
        >
          Respond
        </Button>
      </div>
    );
}
