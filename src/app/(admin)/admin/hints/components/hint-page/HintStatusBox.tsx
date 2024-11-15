"use client";
import { claimHint, refundHint, unclaimHint } from "../../actions";
import { toast } from "~/hooks/use-toast";
import { HintClaimer } from "../hint-table/Columns";

export default function HintStatusBox({
  hintId,
  claimer,
  status,
  userId,
}: {
  hintId: number;
  claimer: HintClaimer;
  status: string;
  userId: string;
}) {
  const handleClaim = async () => {
    const { error, title } = await claimHint(hintId);
    if (error) {
      toast({
        variant: "destructive",
        title,
        description: error,
      });
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

  // No claimer
  if (!claimer) {
    return (
      <div className="p-4">
        <button
          className="rounded-md border border-emerald-600 text-emerald-600"
          onClick={handleClaim}
        >
          <p className="px-10 text-3xl">CLAIM</p>
        </button>
      </div>
    );
  }
  // Puzzle is claimed by you
  else if (claimer.id == userId) {
    if (status == "no_response") {
      return (
        <div className="p-4">
          <button
            className="rounded-md border border-red-600 text-red-600"
            onClick={handleUnclaim}
          >
            <p className="px-10 text-3xl">UNCLAIM</p>
          </button>
        </div>
      );
    } else if (status == "answered") {
      return (
        <div className="p-4">
          <button
            className="rounded-md border border-gray-600 text-gray-600"
            onClick={handleRefund}
          >
            <p className="px-10 text-3xl">REFUND</p>
          </button>
        </div>
      );
    } else {
      return <div className="p-4">Refunded by: {claimer.displayName}</div>;
    }
  }
  // Puzzle is claimed by others
  else {
    if (status == "no_response") {
      return <div className="p-4">Claimed by: {claimer.displayName}</div>;
    } else if (status == "answered") {
      return <div className="p-4">Answered by: {claimer.displayName}</div>;
    } else if (status == "refunded") {
      return <div className="p-4">Refunded by: {claimer.displayName}</div>;
    }
  }
}
