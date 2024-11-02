"use client";

import { ColumnDef } from "@tanstack/react-table";
import { hints } from "~/server/db/schema";

/* TODO: 
  Convert team ID to team name
  Convert puzzle ID to puzzle name
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

// Define the columns for the table using TanStack
export const columns: ColumnDef<typeof hints.$inferSelect>[] = [
  {
    accessorKey: "id",
    header: () => <div className="w-16">Id</div>,
    cell: ({ row }) => (
      <div className="w-16 truncate">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "puzzleId",
    header: () => <div className="w-24">Puzzle</div>,
    cell: ({ row }) => (
      <div className="w-16 truncate">{row.getValue("puzzleId")}</div>
    ),
  },
  {
    accessorKey: "teamId",
    header: () => <div className="w-24">Team</div>,
    cell: ({ row }) => (
      <div className="w-24 truncate">{row.getValue("teamId")}</div>
    ),
  },
  {
    accessorKey: "request",
    header: () => <div className="w-64">Request</div>,
    cell: ({ row }) => (
      <div className="w-64 truncate">{row.getValue("request")}</div>
    ),
  },
  {
    accessorKey: "response",
    header: () => <div className="w-64">Response</div>,
    cell: ({ row }) => (
      <div className="w-64 truncate">{row.getValue("response")}</div>
    ),
  },
  {
    accessorKey: "requestTime",
    header: () => <div className="w-32">Request Time</div>,
    cell: ({ row }) => {
      const time = row.getValue("requestTime");
      return (
        <div className="w-32 truncate font-medium">{formatTime(time)}</div>
      );
    },
  },
  {
    accessorKey: "claimer",
    header: () => <div className="w-24">Claimed By</div>,
    cell: ({ row }) => (
      <div className="w-24 truncate">{row.getValue("claimer")}</div>
    ),
  },
  // In HintTable, we set the initial state to hide them
  {
    header: () => null,
    accessorKey: "claimTime",
  },
  {
    header: () => null,
    accessorKey: "responseTime",
  },
];
