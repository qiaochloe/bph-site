import { Row } from "@tanstack/react-table";
import { claimHint, unclaimHint } from "../../actions";
import { toast } from "~/hooks/use-toast";
import { useSession } from "next-auth/react";

// TODO: Add refund hint functionality
// TODO: Actually keep track of number of hints claimed

export default function ClaimBox<TData>({ row }: { row: Row<TData> }) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const hintId = row.getValue("id") as number;
  const claimer = row.getValue("claimer") as string;

  if (!claimer) {
    return (
      <button
        className="rounded-md border border-emerald-600 text-emerald-600"
        onClick={async () => {
          try {
            await claimHint(hintId);
          } catch (error: any) {
            toast({
              variant: "destructive",
              title: "Error claiming hint",
              description: error.message,
            });
          }
        }}
      >
        <p className="claimButton px-1">CLAIM</p>
      </button>
    );
  } else if (claimer === userId && row.getValue("responseTime") === null) {
    return (
      <button
        className="rounded-md border border-red-600 text-red-600"
        onClick={async () => await unclaimHint(hintId)}
      >
        <p className="claimButton px-1">UNCLAIM</p>
      </button>
    );
  } else {
    return <p>{claimer as string}</p>;
  }
}
