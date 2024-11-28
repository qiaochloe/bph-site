"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeamTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TeamTable<TData, TValue>({
  columns,
  data,
}: TeamTableProps<TData, TValue>) {
  const router = useRouter();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
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
      },
    },
    pageCount: Math.ceil(data.length / pageSize),
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between space-x-2 p-4">
        <Input
          placeholder="Filter teams..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          {/* Page [current page] of [total pages] */}
          <span className="text-muted-foreground text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          {/* Disable the left button on the first page of the table */}
          {table.getState().pagination.pageIndex === 0 ? (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft size="1.5em" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
            >
              <ChevronLeft size="1.5em" />
            </Button>
          )}
          {/* Disable the right button on the last page of the table */}
          {table.getState().pagination.pageIndex + 1 ===
          table.getPageCount() ? (
            <Button variant="outline" size="sm" disabled>
              <ChevronRight size="1.5em" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
            >
              <ChevronRight size="1.5em" />
            </Button>
          )}
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
                          `/admin/teams/${row.getValue("username")}`,
                          "_blank",
                        );
                      } else {
                        // Move to team page
                        router.push(`/admin/teams/${row.getValue("username")}`);
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
