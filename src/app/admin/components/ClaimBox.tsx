import { Row } from "@tanstack/react-table";
import { claimHint, unclaimHint } from "../actions";
import { toast } from "~/hooks/use-toast";

// TODO: Add refund hint functionality
// TODO: Actually keep track of number of hints claimed

export function ClaimBox<TData>({
  row,
  userId,
}: {
  row: Row<TData>;
  userId: string;
}) {
  const hintId = row.getValue("id") as number;
  const claimer = row.getValue("claimer");

  if (!claimer) {
    return (
      <p>
        Claimed by:{" "}
        <button
          className="rounded-md border border-emerald-600 text-emerald-600"
          onClick={async () => {
            try {
              await claimHint(hintId);
            } catch (error: any) {
              toast({
                variant: "destructive",
                title: "Error Claiming Hint",
                description: error.message,
              });
            }
          }}
        >
          <p className="px-1">CLAIM</p>
        </button>
      </p>
    );
  } else if (claimer === userId && row.getValue("response") === null) {
    return (
      <p>
        Claimed by:{" "}
        <button
          className="rounded-md border border-red-600 text-red-600"
          onClick={() => unclaimHint(hintId)}
        >
          <p className="px-1">UNCLAIM</p>
        </button>
      </p>
    );
  } else {
    return <p>Claimed by: {claimer as string}</p>;
  }
}
