"use client";

import { Fragment, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import ClaimBox from "./ClaimBox";
import ResponseBox from "./ResponseBox";
import RequestBox from "./RequestBox";

interface HintTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function HintTable<TData, TValue>({
  columns,
  data,
}: HintTableProps<TData, TValue>) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

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
      columnVisibility: {
        responseTime: false,
        claimTime: false,
      },
    },
  });

  if (!userId) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between space-x-2 p-4">
        <Input
          placeholder="Filter hints..."
          value={(table.getColumn("request")?.getFilterValue() as string) ?? ""}
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
      <div className="overflow-auto rounded-md border">
        {" "}
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={`header-${headerGroup.id}`}>
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
                <Fragment key={`row-${row.id}`}>
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
                          <p>
                            Puzzle:{" "}
                            <Link
                              href={`/puzzle/${row.getValue("puzzleId")}`}
                              className="text-blue-600 hover:underline"
                            >
                              {row.getValue("puzzleId")}
                            </Link>
                          </p>
                          {/* TODO: link to team 
                              #GoodFirstIssue
                            */}
                          <p>Team: {row.getValue("teamId")}</p>
                          <ClaimBox row={row} userId={userId} />
                          <br />
                          <p>
                            Request Time:{" "}
                            {row.getValue("requestTime")?.toLocaleString()}
                          </p>
                          <p>
                            Claim Time:{" "}
                            {row.getValue("claimTime")?.toLocaleString()}
                          </p>
                          <p>
                            Response Time:{" "}
                            {row.getValue("responseTime")?.toLocaleString()}
                          </p>
                          <RequestBox row={row} />
                          <ResponseBox row={row} currHinter={userId} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
  );
}
