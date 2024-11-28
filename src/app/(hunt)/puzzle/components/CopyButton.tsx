"use client";

import { Button } from "@/components/ui/button";
import { toast } from "~/hooks/use-toast";

export default function CopyButton({ copyText }: { copyText: string }) {
  return (
    <Button
      className="mt-3 px-1 text-3xl hover:"
      variant={"ghost"}
      onClick={() => {
        navigator.clipboard.writeText(copyText);
        toast({
          title: "Puzzle copied to clipboard!",
        });
      }}
    >
      📋
    </Button>
  );
}
