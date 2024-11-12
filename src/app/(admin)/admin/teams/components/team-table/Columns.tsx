"use client";

import { ColumnDef } from "@tanstack/react-table";
import { teams } from "~/server/db/schema";

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
export const columns: ColumnDef<typeof teams.$inferSelect>[] = [
  {
    accessorKey: "id",
    header: () => <div className="w-32">Id</div>,
    cell: ({ row }) => (
      <div className="w-32 truncate">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: () => <div className="w-32">Username</div>,
    cell: ({ row }) => (
      <div className="w-32 truncate">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "displayName",
    header: () => <div className="w-32">Display Name</div>,
    cell: ({ row }) => (
      <div className="w-32 truncate">{row.getValue("displayName")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="w-32">Role</div>,
    cell: ({ row }) => (
      <div className="w-32 truncate">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "interactionMode",
    header: () => <div className="w-32">Interaction Mode</div>,
    cell: ({ row }) => (
      <div className="w-32 truncate">{row.getValue("interactionMode")}</div>
    ),
  },
  {
    accessorKey: "createTime",
    header: () => <div className="w-32">Create Time</div>,
    cell: ({ row }) => {
      const time = row.getValue("createTime");
      return (
        <div className="w-32 truncate font-medium">{formatTime(time)}</div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: () => <div className="w-32">Start Time</div>,
    cell: ({ row }) => {
      const time = row.getValue("startTime");
      return (
        <div className="w-32 truncate font-medium">{formatTime(time)}</div>
      );
    },
  },
  {
    accessorKey: "finishTime",
    header: () => <div className="w-32">Finish Time</div>,
    cell: ({ row }) => {
      const time = row.getValue("finishTime");
      return (
        <div className="w-32 truncate font-medium">{formatTime(time)}</div>
      );
    },
  },
];
