import { Row } from "@tanstack/react-table";
import { claimHint, unclaimHint } from "../../actions";
import { toast } from "~/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HintClaimer, HintWithRelations } from "./Columns";

// TODO: Add refund hint functionality
// TODO: Actually keep track of number of hints claimed

export default function ClaimBox<TData>({
  row,
}: {
  row: Row<HintWithRelations>;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const hintId = row.getValue("id") as number;
  const claimer: HintClaimer = row.getValue("claimer");

  const [isClaimed, setIsClaimed] = useState(!!claimer);
  const [isOwnClaim, setIsOwnClaim] = useState(
    claimer?.id === userId && row.getValue("responseTime") === null,
  );

  if (!isClaimed) {
    return (
      <button
        className="rounded-md border border-emerald-600 text-emerald-600"
        onClick={async () => {
          setIsOwnClaim(true);
          setIsClaimed(true);
          const { claimer } = await claimHint(hintId);
          if (claimer) {
            setIsOwnClaim(false);
            toast({
              variant: "destructive",
              title: "Error claming hint",
              description: `Hint claimed by ${claimer}.`,
            });
          } else {
            window.open(`/admin/hints/${row.getValue("id")}`, "_blank");
          }
        }}
      >
        <p className="claimButton px-1">CLAIM</p>
      </button>
    );
  } else if (isOwnClaim) {
    return (
      <button
        className="rounded-md border border-red-600 text-red-600"
        onClick={async () => {
          setIsOwnClaim(false);
          setIsClaimed(false);
          await unclaimHint(hintId);
        }}
      >
        <p className="claimButton px-1">UNCLAIM</p>
      </button>
    );
  } else {
    return <p>{claimer?.displayName as string}</p>;
  }
}
