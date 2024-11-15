import { Row } from "@tanstack/react-table";
import { claimHint, unclaimHint, refundHint } from "../../actions";
import { toast } from "~/hooks/use-toast";
import { useSession } from "next-auth/react";
import { HintClaimer } from "./Columns";

// TODO: Add refund hint functionality
// TODO: Actually keep track of number of hints claimed

export default function ClaimBox<TData>({ row }: { row: Row<TData> }) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const hintId = row.getValue("id") as number;
  const claimer: HintClaimer = row.getValue("claimer");
  const status = row.getValue("status");

  const handleClaim = async () => {
    const { error, title } = await claimHint(hintId);
    if (error) {
      toast({
        variant: "destructive",
        title,
        description: error,
      });
    } else {
      window.open(`/admin/hints/${row.getValue("id")}`, "_blank");
    }
  };

  const handleUnclaim = async () => {
    const { error, title } = await unclaimHint(hintId);
    if (error) {
      toast({
        variant: "destructive",
        title,
        description: error,
      });
    }
  };

  const handleRefund = async () => {
    const { error, title } = await refundHint(hintId);
    if (error) {
      toast({
        variant: "destructive",
        title,
        description: error,
      });
    }
  };

  if (status == "refunded") {
    return <p>Refunded</p>;
  } else if (!claimer) {
    return (
      <button
        className="rounded-md border border-emerald-600 text-emerald-600"
        onClick={handleClaim}
      >
        <p className="claimButton px-1">CLAIM</p>
      </button>
    );
  } else if (claimer?.id && claimer.id == userId) {
    if (status == "no_response")
      return (
        <button
          className="rounded-md border border-red-600 text-red-600"
          onClick={handleUnclaim}
        >
          <p className="claimButton px-1">UNCLAIM</p>
        </button>
      );
    else if (status == "answered") {
      return (
        <button
          className="rounded-md border border-gray-600 text-gray-600"
          onClick={handleRefund}
        >
          <p className="claimButton px-1">REFUND</p>
        </button>
      );
    }
  } else {
    if (status == "no_response") {
      return <p>Claimed</p>;
    } else if (status == "answered") {
      return <p>Answered</p>;
    }
  }
}
