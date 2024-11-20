"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { hints } from "~/server/db/schema";
import HintStatusBox from "./HintStatusBox";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

/* TODO: 
  Shorten request time to just the time (if it is today) and the date (if it is not today)
  Exclude the year from the date
  Display claimer as initials
  #GoodFirstIssue
*/

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

export type HintClaimer = { id: string; displayName: string } | null;

export type HintWithRelations = typeof hints.$inferSelect & {
  team: { displayName: string };
  claimer: HintClaimer;
  puzzle: { name: string };
};

// Define the columns for the table using TanStack
export const columns: ColumnDef<HintWithRelations>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="flex w-16 space-x-2">
        <p>ID</p>
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-16 truncate">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "puzzleName",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p> Puzzle</p>
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    accessorFn: (row) => row.puzzle.name,
  },
  {
    accessorKey: "teamDisplayName",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Team</p>

        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    accessorFn: (row) => row.team!.displayName,
  },
  {
    accessorKey: "request",
    header: ({ column }) => (
      <div className="flex w-[42em] space-x-2">
        <p> Request</p>
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-[42em] truncate">{row.getValue("request")}</div>
    ),
  },
  {
    accessorKey: "requestTime",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p> Request Time</p>
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    cell: ({ row }) => {
      const time = row.getValue("requestTime");
      return (
        <div className="w-32 truncate font-medium">{formatTime(time)}</div>
      );
    },
  },
  {
    accessorKey: "claimer",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Status</p>

        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    ),
    sortingFn: "sortHintByStatus",
    cell: ({ row }) => (
      <div className="w-24 truncate">
        <HintStatusBox row={row} />
      </div>
    ),
  },
  {
    accessorKey: "responseTime",
    header: () => null,
  },
  {
    accessorKey: "status",
    header: () => null,
  },
];
