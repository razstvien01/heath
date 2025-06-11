import React from "react";
import { Button } from "@/components/ui/button";
import type { OwnerFilterDto } from "@/dto/owner";
import { AuditFilterDto } from "@/dto/audit";

interface TableFooterProps {
  filterList: OwnerFilterDto | AuditFilterDto;
  totalCount: number;
  handleChangeTable: (
    changes: Partial<OwnerFilterDto | AuditFilterDto>
  ) => void;
  isLoading?: boolean;
}

export function TableFooter({
  filterList,
  totalCount,
  handleChangeTable,
  isLoading = false,
}: TableFooterProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / filterList.pageSize));
  const startEntry = (filterList.page - 1) * filterList.pageSize + 1;
  const endEntry = Math.min(filterList.page * filterList.pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
          value={filterList.pageSize}
          onChange={(e) =>
            handleChangeTable({ pageSize: Number(e.target.value) })
          }
          disabled={isLoading}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        {startEntry} - {endEntry} of {totalCount}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleChangeTable({ page: filterList.page - 1 })}
          disabled={isLoading || filterList.page <= 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 mx-2">
          <span className="text-sm text-muted-foreground">
            Page {filterList.page} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleChangeTable({ page: filterList.page + 1 })}
          disabled={isLoading || filterList.page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
