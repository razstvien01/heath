import React from "react";
import { Button } from "@/components/ui/button";
import type { OwnerFilterDto } from "@/dto/owner";

interface OwnerTableFooterProps {
  filterOwnerList: OwnerFilterDto;
  totalCount: number;
  handleChangeTable: (changes: Partial<OwnerFilterDto>) => void;
  isLoading?: boolean;
}

export function OwnerTableFooter({
  filterOwnerList,
  totalCount,
  handleChangeTable,
  isLoading = false,
}: OwnerTableFooterProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / filterOwnerList.pageSize)
  );
  const startEntry = (filterOwnerList.page - 1) * filterOwnerList.pageSize + 1;
  const endEntry = Math.min(
    filterOwnerList.page * filterOwnerList.pageSize,
    totalCount
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <select
          className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
          value={filterOwnerList.pageSize}
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
          onClick={() => handleChangeTable({ page: filterOwnerList.page - 1 })}
          disabled={isLoading || filterOwnerList.page <= 1}
        >
          Previous
        </Button>

        <div className="flex items-center gap-1 mx-2">
          <span className="text-sm text-muted-foreground">
            Page {filterOwnerList.page} of {totalPages}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleChangeTable({ page: filterOwnerList.page + 1 })}
          disabled={isLoading || filterOwnerList.page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
