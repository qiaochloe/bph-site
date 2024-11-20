"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
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
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hintStatusEnum } from "~/server/db/schema";
import { HintClaimer } from "./Columns";

interface HintTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function HintTable<TData, TValue>({
  columns,
  data,
}: HintTableProps<TData, TValue>) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "claimer", desc: true },
  ]);
  const pageSize = 10;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
      columnVisibility: {
        responseTime: false,
        status: false,
      },
    },
    sortingFns: {
      sortHintByStatus: (rowA, rowB, _columnId) => {
        const claimerA: HintClaimer | null = rowA.getValue("claimer");
        const claimerB: HintClaimer | null = rowB.getValue("claimer");
        const statusA: string = rowA.getValue("status");
        const statusB: string = rowB.getValue("status");

        // Unclaimed hints are only below the user's claimed and unanswered hints
        if (claimerA === null) {
          if (claimerB === null) return 0;
          if (claimerB.id === userId && statusB === "no_response") return -1;
          return 1;
        }
        if (claimerB === null) {
          if (claimerA.id === userId && statusA === "no_response") return 1;
          return -1;
        }

        // Refundable hints are at the very bottom
        if (statusA === "answered") {
          if (claimerA.id === userId)
            return statusB === "answered" && claimerB.id === userId ? 0 : -1;
          else if (statusB === "answered")
            return claimerB.id === userId ? 1 : -1;
        }
        if (statusB === "answered") {
          return claimerB.id === userId ? 1 : -1;
        }

        // Refunded hints are right above them
        if (statusA === "refunded") {
          return statusB === "refunded" ? 0 : -1;
        }
        if (statusB === "refunded") return 1;

        // Answered hints are sorted by who answered them
        if (statusA === "answered") {
          if (statusB === "answered") {
            if (claimerA.id === userId) return claimerB.id === userId ? 0 : 1;
            return claimerB.id === userId ? -1 : 0;
          }
          return -1;
        }
        if (statusB === "answered") {
          return 1;
        }

        // Remaining hints have no response, show user's claimed hints first
        if (claimerA.id === userId) {
          return claimerB.id === userId ? 0 : 1;
        } else {
          return claimerB.id === userId ? -1 : 0;
        }
      },
    },
    pageCount: Math.ceil(data.length / pageSize),
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
      <div className="flex overflow-auto rounded-md border">
        <div className="w-full overflow-y-auto">
          {" "}
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={`header-${headerGroup.id}`}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={() =>
                        header.column.toggleSorting(
                          header.column.getIsSorted() === "asc",
                        )
                      }
                      className="hover:underline"
                      role="button"
                    >
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
                  <TableRow
                    onClick={(event) => {
                      if (
                        event.target instanceof HTMLElement &&
                        event.target.classList.contains("claimButton")
                      )
                        return;
                      if (event.metaKey || event.ctrlKey) {
                        // Open in new tab
                        window.open(
                          `/admin/hints/${row.getValue("id")}`,
                          "_blank",
                        );
                      } else {
                        // Move to hint page
                        router.push(`/admin/hints/${row.getValue("id")}`);
                        router.refresh();
                      }
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
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
