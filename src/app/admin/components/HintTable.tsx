"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
import { Input } from "@/components/ui/input";
import { respondToHint } from "../actions";
import Link from 'next/link'

// NOTE: more about the data table component: https://ui.shadcn.com/docs/components/data-table

/* TODO: 
  Convert team ID to team name
  Convert puzzle ID to puzzle name
  Shorten request time to just the time (if it is today) and the date (if it is not today)
  Exclude the year from the date
  Display claimer as initials
  #GoodFirstIssue
*/

/*
IMPORTANT TODO: Make sure to handle synchronization issues between
multiple people trying to claim the same hint at the same time
#BadFirstIssue
*/

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
      <div className="w-24 truncate">{row.getValue("puzzleId")}</div>
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
    accessorKey: "claimer",
    header: () => <div className="w-24">Claimer</div>,
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between space-x-2 p-4">
        <Input
          placeholder="Filter hints..."
          value={
            (table.getColumn("request")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("request")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
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
      </div>
      <div className="rounded-md border flex-grow overflow-auto">
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
                            {/* 
                              TODO: Make this more compact by creating two columns
                              #GoodFirstIssue
                            */}
                            <h3 className="font-bold">Additional Details:</h3>
                            <p>ID: {row.getValue("id")}</p>
                            <p>Puzzle: 
                              <Link 
                                href={`/puzzle/${row.getValue("puzzleId")}`}
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                {row.getValue("puzzleId")}
                              </Link>
                            </p>
                            {/* TODO: link to team 
                              #GoodFirstIssue
                            */}
                            <p>Team: {row.getValue("teamId")}</p>
                            {/* TODO: Add a claim button here if it is not claimed yet;
                              Automatically update the claim time 
                              Add an unclaim button here too
                            */}
                            <p>Claimer: {row.getValue("claimer")}</p>
                            <br />
                            <p>
                              Request Time:{" "}
                              {row.getValue("requestTime")?.toLocaleString()}
                            </p>
                            <p>
                              Claim Time:{" "}
                              {row.getValue("requestTime")?.toLocaleString()}
                            </p>
                            <p>
                              Response Time:{" "}
                              {row.getValue("responseTime")?.toLocaleString()}
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
