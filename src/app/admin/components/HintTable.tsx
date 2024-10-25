"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { hints } from "@/db/schema";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { respondToHint } from "../actions";

// NOTE: more about the data table component: https://ui.shadcn.com/docs/components/data-table

// Define the columns for the table using TanStack
/* TODO: 
  Convert team ID to team name
  Convert puzzle ID to puzzle name
  Shorten request time to just the time (if it is today) and the date (if it is not today)
  Exclude the year from the date
  Display claimer as initials
*/
export const columns: ColumnDef<typeof hints.$inferSelect>[] = [
  {
    header: "Id",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="w-16 truncate">{row.getValue("id")}</div>
    ),
  },
  {
    header: "Puzzle",
    accessorKey: "puzzleId",
    cell: ({ row }) => (
      <div className="w-24 truncate">{row.getValue("puzzleId")}</div>
    ),
  },
  {
    header: "Team",
    accessorKey: "teamId",
    cell: ({ row }) => (
      <div className="w-24 truncate">{row.getValue("teamId")}</div>
    ),
  },
  {
    header: "Request",
    accessorKey: "request",
    cell: ({ row }) => (
      <div className="w-64 truncate">{row.getValue("request")}</div>
    ),
  },
  {
    header: "Response",
    accessorKey: "response",
    cell: ({ row }) => (
      <div className="w-64 truncate">{row.getValue("response")}</div>
    ),
  },
  {
    header: "Request Time",
    accessorKey: "requestTime",
    cell: ({ row }) => {
      const time = row.getValue("requestTime");
      const formattedTime =
        time instanceof Date
          ? time.toLocaleString("en-US", {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
      return <div className="w-32 truncate font-medium">{formattedTime}</div>;
    },
  },
  {
    header: "Claimer",
    accessorKey: "claimer",
    cell: ({ row }) => (
      <div className="w-24 truncate">{row.getValue("claimer")}</div>
    ),
  },
  // {
  //   header: "Claim Time",
  //   accessorKey: "claimTime",
  // },
  // {
  //   header: "Response Time",
  //   accessorKey: "responseTime",
  // }
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [response, setResponse] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col">
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <div className="overflow-y-auto">
          {" "}
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer"
                      onClick={() => toggleRow(row.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRows[row.id] && (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <div className="bg-gray-50 p-4">
                            <h3 className="font-bold">Additional Details:</h3>
                            {/* TODO: link to puzzle */}
                            <p>Puzzle: {row.getValue("puzzleId")}</p>
                            {/* TODO: link to team */}
                            <p>Team: {row.getValue("teamId")}</p>
                            <br />
                            <p>Request ID: {row.getValue("id")}</p>
                            <p>
                              Request Time:{" "}
                              {row.getValue("requestTime")?.toLocaleString()}
                            </p>
                            {/* TODO: Add a claim button here if it is not claimed yet;
                                    Automatically update the claim time 
                                    Add an unclaim button here too */}
                            <p>Claimer: {row.getValue("claimer")}</p>
                            <p>
                              Claim Time:{" "}
                              {row.getValue("requestTime")?.toLocaleString()}
                            </p>
                            <br />
                            <p>Request:</p>
                            <Textarea
                              value={row.getValue("request")}
                              readOnly
                            />
                            <p>Response:</p>
                            {row.getValue("response") ? (
                              <Textarea
                                value={row.getValue("response")}
                                readOnly
                              />
                            ) : (
                              <>
                                <Textarea
                                  placeholder="No response yet"
                                  onChange={(e) => setResponse(e.target.value)}
                                />
                                <Button
                                  onClick={async () => {
                                    if (row.getValue("id") && response) {
                                      await respondToHint(
                                        row.getValue("id"),
                                        response,
                                      );
                                      // TODO: would be nice if we can update the page using hooks rather than refreshing
                                      router.refresh();
                                    }
                                  }}
                                >
                                  Respond
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
