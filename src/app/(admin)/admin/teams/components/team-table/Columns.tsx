"use client";

import { ColumnDef } from "@tanstack/react-table";
import { teams } from "~/server/db/schema";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { FormattedTime } from "~/lib/time";

// Define the columns for the table using TanStack
export const columns: ColumnDef<typeof teams.$inferSelect>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
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
      <div className="w-32 truncate">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Username</p>
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
      <div className="w-32 truncate">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Display Name</p>
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
      <div className="w-32 truncate">{row.getValue("displayName")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Role</p>
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
      <div className="w-32 truncate">{row.getValue("role")}</div>
    ),
  },
  {
    accessorKey: "interactionMode",
    header: ({ column }) => (
      <div className="flex w-48 space-x-2">
        <p>Interaction Mode</p>
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
      <div className="w-32 truncate">{row.getValue("interactionMode")}</div>
    ),
  },
  {
    accessorKey: "createTime",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Create Time</p>
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
      const time: Date = row.getValue("createTime");
      return (
        <div className="w-32 truncate font-medium">
          <FormattedTime time={time} />
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Start Time</p>
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
      const time: Date = row.getValue("startTime");
      return (
        <div className="w-32 truncate font-medium">
          <FormattedTime time={time} />
        </div>
      );
    },
  },
  {
    accessorKey: "finishTime",
    header: ({ column }) => (
      <div className="flex w-32 space-x-2">
        <p>Finish Time</p>
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
      const time: Date = row.getValue("finishTime");
      return (
        <div className="w-32 truncate font-medium">
          <FormattedTime time={time} />
        </div>
      );
    },
  },
];
