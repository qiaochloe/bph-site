"use client";
import { claimHint, unclaimHint } from "../../actions";
import { toast } from "~/hooks/use-toast";
import { HintClaimer } from "../hint-table/Columns";
import { useState } from "react";

export default function ClaimBox({
  id,
  claimer,
  response,
  userId,
}: {
  id: number;
  claimer: HintClaimer;
  response: string | null;
  userId: string;
}) {

  const [isClaimed, setIsClaimed] = useState(!!claimer);
  const [isOwnClaim, setIsOwnClaim] = useState(
    claimer?.id === userId && response === null,
  );

  const handleClaim = async () => {
    setIsOwnClaim(true);
    setIsClaimed(true);
    const { claimer } = await claimHint(id);
    if (claimer) {
      setIsOwnClaim(false);
      toast({
        variant: "destructive",
        title: "Error claming hint",
        description: `Hint claimed by ${claimer}.`,
      });
    }
  };

  const handleUnclaim = async () => {
    setIsOwnClaim(false);
    setIsClaimed(false);
    await unclaimHint(id);
  };

  if (!isClaimed) {
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
  } else if (isOwnClaim) {
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
  } else {
    return <div className="p-4">Claimed by: {claimer?.displayName}</div>;
  }
}
