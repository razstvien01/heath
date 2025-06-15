"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FilePlus,
  Search,
  ArrowDownUp,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import { RecordRow } from "./recordRow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecordFilterDto } from "@/dto/record";
import { AuditRecordDto } from "@/dto/record/AuditRecordDto";
import { addRecordReq, fetchRecordsReq } from "@/services/recordService";
import { DialogForm } from "@/components/dialogForm";
import { TableFooter } from "@/components/tableFooter";

type SortField = "reason" | "createdAt";
type SortDirection = "asc" | "desc";

export default function RecordManagement({
  guid,
  mode,
}: {
  guid: string;
  mode: string;
}) {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [runningBalance, setRunningBalance] = useState(0);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordList, setRecordList] = useState<AuditRecordDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "reason",
    direction: "asc",
  });
  const [filterRecordList, setFilterRecordList] = useState<RecordFilterDto>({
    reason: undefined,
    page: 1,
    pageSize: 10,
    orderBy: "reason",
    orderDirection: "asc",
  });
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [totalCount, setTotalCount] = useState(0);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("guid", guid);

      const res = await fetchRecordsReq(formData, filterRecordList);

      if (res && res.data.records && res.data.total) {
        let currentBalance: number | null = null;

        res.data.records.forEach(
          (currentValue: {
            createdAt: Date;
            amount: number | null;
            runningBalance: number | null;
          }) => {
            currentBalance = !currentBalance
              ? currentValue.amount
              : currentBalance + (currentValue.amount ?? 0);

            currentValue.runningBalance = currentBalance;
            currentValue.createdAt = new Date(currentValue.createdAt);
          }
        );

        setCurrentBalance(currentBalance ?? 0);
        setRecordList(res.data.records);
        setTotalCount(res.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterRecordList, guid]);

  const handleAddRecord = async (
    values: Record<string, string | File | undefined>
  ): Promise<boolean> => {
    const { amount, reason, receipt, signature } = values;

    try {
      const formData = new FormData();
      formData.append("guid", guid);
      formData.append("amount", String(amount));
      formData.append("reason", String(reason));

      if (receipt) formData.append("receipt", receipt);

      if (signature) formData.append("signature", signature);

      const res = await addRecordReq(formData);

      if (res) {
        fetchRecords();
        setIsLoading(false);
        return true;
      }
    } catch {
      console.error("Failed to add record");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }

    return false;
  };

  const toggleSort = (field: SortField) => {
    const isSameField = sortState.field === field;
    const newDirection: SortDirection =
      isSameField && sortState.direction === "asc" ? "desc" : "asc";

    const newSortState = {
      field,
      direction: newDirection,
    };

    setSortState(newSortState);

    handleChangeTable({
      orderBy: field,
      orderDirection: newSortState.direction,
    });
  };

  const handleChangeTable = (changes: Partial<RecordFilterDto>) => {
    setFilterRecordList((prev) => ({
      ...prev,
      ...changes,
      ...(changes.pageSize && { page: 1 }),
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) {
      return <ArrowDownUp className="h-4 w-4 opacity-50" />;
    }
    return sortState.direction === "asc" ? (
      <ArrowDownAZ className="h-4 w-4" />
    ) : (
      <ArrowUpAZ className="h-4 w-4" />
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setFilterRecordList((prev) => {
      const newFilter = {
        ...prev,
        name: debouncedQuery || undefined,
        managementGuid: debouncedQuery || undefined,
        page: 1,
      };

      if (prev.reason === newFilter.reason && prev.page === newFilter.page) {
        return prev;
      }

      return newFilter;
    });
  }, [debouncedQuery]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === "public" ? "Public" : "Private"} Audit Records
          </h1>
          <p className="text-muted-foreground">
            Review audit trails and monitor activity history
          </p>
        </div>
      </div>
      <Card className="border rounded-2xl shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">Record List</CardTitle>
            <h2 className="text-lg font-medium text-primary">
              Current Balance: {currentBalance}
            </h2>
            <CardDescription className="text-sm text-muted-foreground max-w-md">
              View and submit entries to the {mode} audit trail. All submissions
              are{" "}
              {mode === "public"
                ? "open and transparent"
                : "restricted and secure"}
              .
            </CardDescription>
          </div>

          <Button
            onClick={() => setIsAddRecordDialogOpen(true)}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <FilePlus className="h-4 w-4" />
            Add Record
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4 pt-4">
            {/* Search bar */}
            <div className="flex items-center gap-2 w-full ">
              <Input
                placeholder="Search by reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.trim())}
              />
              <Button size="icon" variant="outline" disabled={true}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort controls */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center">
                Sort by:
              </span>
              <Button
                variant={sortState.field === "reason" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSort("reason")}
                className="flex items-center gap-1"
              >
                {getSortIcon("reason")}
                Reason
              </Button>
              <Button
                variant={
                  sortState.field === "createdAt" ? "default" : "outline"
                }
                size="sm"
                onClick={() => toggleSort("createdAt")}
                className="flex items-center gap-1"
              >
                {getSortIcon("createdAt")}
                Date Created
              </Button>

              {searchQuery && (
                <Badge variant="outline" className="ml-auto">
                  {recordList.length} results
                </Badge>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Balance
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Reason
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Has Receipt
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Signature
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Running Balance
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Date Created
                      </th>

                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordList.length > 0 ? (
                      recordList.map((record) => (
                        <RecordRow
                          key={record.id}
                          record={record}
                          onSubmitDone={fetchRecords}
                          mode={mode}
                        />
                      ))
                    ) : (
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <td
                          colSpan={5}
                          className="p-4 align-middle text-center text-muted-foreground"
                        >
                          {searchQuery
                            ? "No matching records found"
                            : "No record found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {!isLoading && recordList.length > 0 && (
            <TableFooter<RecordFilterDto>
              filterList={filterRecordList}
              totalCount={totalCount}
              handleChangeTable={handleChangeTable}
              isLoading={isLoading}
            />
          )}
        </CardContent>

        <DialogForm
          open={isAddRecordDialogOpen}
          onOpenChange={setIsAddRecordDialogOpen}
          onSubmit={handleAddRecord}
          isLoading={isLoading}
          title="Add New Record"
          description="Submit a new entry to the public audit trail."
          icon={<FilePlus className="h-5 w-5 text-emerald-500" />}
          successMessage="Record added successfully!"
          errorMessage="Failed to add record. Please try again."
          submitText="Add Record"
          fields={[
            {
              id: "amount",
              label: "Amount",
              type: "number",
              placeholder: "Enter amount",
              required: true,
            },
            {
              id: "reason",
              label: "Reason",
              type: "text",
              placeholder: "Enter reason for the record",
              required: true,
            },
            {
              id: "receipt",
              label: "Receipt",
              type: "file",
              accept: ".png,.jpg,.jpeg",
              required: false,
            },
            {
              id: "signature",
              label: "Signature",
              type: "signature",
              required: false,
            },
          ]}
        />
      </Card>
    </div>
  );
}
