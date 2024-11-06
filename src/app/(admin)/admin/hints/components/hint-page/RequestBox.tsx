import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { Label } from "~/components/ui/label";
import { hints } from "~/server/db/schema";

export function RequestBox({ hint }: { hint: typeof hints.$inferSelect }) {
  return (
    <div className="my-4 grid w-full gap-1.5">
      <Label htmlFor={`hint-request-${hint.id}`}>Request</Label>
      <AutosizeTextarea
        maxHeight={500}
        className="resize-none"
        value={hint.request}
        id={`hint-request-${hint.id}`}
        readOnly
      />
    </div>
  );
}
