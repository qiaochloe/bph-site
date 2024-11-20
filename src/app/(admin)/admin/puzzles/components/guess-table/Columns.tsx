"use client";

import { ColumnDef } from "@tanstack/react-table";
import { guesses } from "~/server/db/schema";

export function formatTime(time: unknown) {
  if (!(time instanceof Date)) {
    return "";
  }
  return time.toLocaleString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Define the columns for the table using TanStack
export const columns: ColumnDef<
  typeof guesses.$inferSelect & {
    team: { displayName: string };
  }
>[] = [
  {
    accessorKey: "teamDisplayName",
    header: () => <div className="w-48">Team</div>,
    accessorFn: (row) => row.team!.displayName,
  },
  {
    accessorKey: "guess",
    header: () => <div className="w-48">Guess</div>,
    cell: ({ row }) => (
      <div className="w-48 truncate">{row.getValue("guess")}</div>
    ),
  },
  {
    accessorKey: "submitTime",
    header: () => <div className="w-32">Guess Time</div>,
    cell: ({ row }) => {
      const time = row.getValue("submitTime");
      return (
        <div className="w-32 truncate font-medium">{formatTime(time)}</div>
      );
    },
  },
];
