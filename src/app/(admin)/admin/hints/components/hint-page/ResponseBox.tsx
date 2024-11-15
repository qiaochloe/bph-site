"use client";

import { useSession } from "next-auth/react";
import { toast } from "~/hooks/use-toast";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { HintWithRelations } from "../hint-table/Columns";
import { respondToHint } from "../../actions";

export function ResponseBox({ hint }: { hint: HintWithRelations }) {
  const { data: session } = useSession();
  const currHinter = session?.user?.id;

  const handleResponse = async () => {
    const textarea = document.getElementById(
      `hint-response-${hint.id}`,
    ) as HTMLTextAreaElement;

    // NOTE: might want to give users their response again
    const { error, title, response } = await respondToHint(
      hint.id,
      textarea.value,
    );

    if (error) {
      toast({
        variant: "destructive",
        title: title,
        description: error,
      });
    }
  };

  if (hint.response) {
    return (
      <div className="grid w-full gap-1.5">
        <Label htmlFor={`hint-response-${hint.id}`}>Response</Label>
        <AutosizeTextarea
          maxHeight={500}
          value={hint.response}
          id={`hint-response-${hint.id}`}
          readOnly
        />
      </div>
    );
  }

  if (hint.claimer?.id == currHinter)
    return (
      <div className="full grid gap-1.5">
        <Label htmlFor={`hint-response-${hint.id}`}>Response</Label>
        <AutosizeTextarea
          maxHeight={500}
          className="resize-none"
          placeholder="No response yet"
          id={`hint-response-${hint.id}`}
        />
        <Button className="mt-4 w-fit" onClick={handleResponse}>
          Respond
        </Button>
      </div>
    );
}
