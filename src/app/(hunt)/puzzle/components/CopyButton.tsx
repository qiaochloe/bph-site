"use client";

import { Button } from "@/components/ui/button";
import { toast } from "~/hooks/use-toast";

export default function CopyButton({ copyText }: { copyText: string }) {
  return (
    <Button
      className="hover: mt-3 px-1 text-3xl"
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
