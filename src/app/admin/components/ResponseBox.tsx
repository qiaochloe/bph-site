import { Row } from "@tanstack/react-table";
import { respondToHint } from "../actions";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export function ResponseBox<TData>({
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
        <Textarea
          value={row.getValue("response")}
          id={`hint-response-${row.getValue("id")}`}
          readOnly
        />
      </div>
    );
  }

  if (row.getValue("claimer") == currHinter)
    return (
      <div className="grid full gap-1.5">
        <Label htmlFor={`hint-response-${row.getValue("id")}`}>Response</Label>
        <Textarea
          placeholder="No response yet"
          id={`hint-response-${row.getValue("id")}`}
        />
        <Button
          className="w-fit"
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
