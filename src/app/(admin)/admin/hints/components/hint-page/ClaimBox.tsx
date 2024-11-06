"use client";
import { claimHint, unclaimHint } from "../../actions";
import { toast } from "~/hooks/use-toast";

export default function ClaimBox({
  id,
  claimer,
  response,
  userId,
}: {
  id: number;
  claimer: string | null;
  response: string | null;
  userId: string;
}) {

  const handleClaim = async () => {
    try {
      await claimHint(id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error claiming hint",
        description: error.message,
      });
    }
  };

  const handleUnclaim = async () => {
    try {
      await unclaimHint(id);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error unclaiming hint",
        description: error.message,
      });
    }
  };

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
  else if (claimer === userId && response === null) {
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
  }
  else {
    return <div className="p-4">Claimed by: {claimer}</div>;
  }
}
