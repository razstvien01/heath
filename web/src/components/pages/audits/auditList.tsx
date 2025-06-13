"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuditRow } from "./auditRow";
import {
  ArrowDownAZ,
  ArrowUp,
  ArrowUpAz,
  BookPlus,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AuditFilterDto } from "@/dto/audit/AuditFilterDto";
import { addAuditReq, fetchAuditsReq } from "@/services/auditService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogForm } from "@/components/dialogForm";
import { Badge } from "@/components/ui/badge";
import { AuditDto } from "@/dto/audit";
import { TableFooter } from "@/components/tableFooter";

interface AuditListProps {
  guid: string;
}

type SortField = "name" | "createdAt";
type SortDirection = "asc" | "desc";

export function AuditList({ guid }: AuditListProps) {
  const [auditList, setAuditList] = useState<AuditDto[]>([]);
  const [filterAuditList, setFilterAuditList] = useState<AuditFilterDto>({
    name: undefined,
    page: 1,
    pageSize: 10,
    orderBy: "name",
    orderDirection: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "name",
    direction: "asc",
  });
  const [isAddAuditDialogOpen, setIsAddAuditDialogOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [totalCount, setTotalCount] = useState(0);

  const fetchAudits = useCallback(async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("guid", guid);

      const res = await fetchAuditsReq(formData, filterAuditList);

      if (res && res.data.audits && res.data.total) {
        setAuditList(res.data.audits);
        setTotalCount(res.data.total);
      } else {
        setAuditList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch audits:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterAuditList, guid]);

  const handleAddAudit = async (
    values: Record<string, string>
  ): Promise<boolean> => {
    const { name, description, date } = values;
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append("guid", guid);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("date", date);

    if (date) formData.append("createdAt", date);
    else formData.append("createdAt", Date.now().toString());

    try {
      const res = await addAuditReq(formData);

      if (res) {
        fetchAudits();
        setIsLoading(false);
        return true;
      }
    } catch {
      console.error("Failed to add audit");
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

  const handleChangeTable = (changes: Partial<AuditFilterDto>) => {
    setFilterAuditList((prev) => ({
      ...prev,
      ...changes,
      ...(changes.pageSize && { page: 1 }),
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field)
      return <ArrowUp className="h-4 w-4 opacity-50" />;

    return sortState.direction === "asc" ? (
      <ArrowDownAZ className="h-4 w-4" />
    ) : (
      <ArrowUpAz className="h-4 w-4" />
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setFilterAuditList((prev) => {
      const newFilter = {
        ...prev,
        name: debouncedQuery || undefined,
        managementGuid: debouncedQuery || undefined,
        page: 1,
      };
      
      if (prev.name === newFilter.name && prev.page === newFilter.page) {
        return prev;
      }

      return newFilter;
    });
  }, [debouncedQuery]);

  useEffect(() => {
    fetchAudits();
  }, [fetchAudits]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full border">
        <div>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>
            Detailed logs of recent system activity and changes
          </CardDescription>
        </div>

        <div className="sm:ml-auto mt-4 sm:mt-0">
          <Button
            onClick={() => setIsAddAuditDialogOpen(true)}
            disabled={isLoading}
          >
            <BookPlus className="h-4 w-4 mr-2" />
            Add Audit
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 space-y-4 pt-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 w-full ">
            <Input
              placeholder="Search by name or GUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              variant={sortState.field === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSort("name")}
              className="flex items-center gap-1"
            >
              {getSortIcon("name")}
              Name
            </Button>
            <Button
              variant={sortState.field === "createdAt" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSort("createdAt")}
              className="flex items-center gap-1"
            >
              {getSortIcon("createdAt")}
              Date Created
            </Button>

            {searchQuery && (
              <Badge variant="outline" className="ml-auto">
                {auditList.length} results
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
                      Audit Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Entries
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Guid
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Public Guid
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
                  {auditList.length > 0 ? (
                    auditList.map((audit: AuditDto) => (
                      <AuditRow
                        key={audit.id}
                        audit={audit}
                        onSubmitDone={fetchAudits}
                      />
                    ))
                  ) : (
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <td
                        colSpan={5}
                        className="p-4 align-middle text-center text-muted-foreground"
                      >
                        {searchQuery
                          ? "No matching audits found"
                          : "No audits found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!isLoading && auditList.length > 0 && (
          <TableFooter
            filterList={filterAuditList}
            totalCount={totalCount}
            handleChangeTable={handleChangeTable}
            isLoading={isLoading}
          />
        )}
      </CardContent>

      <DialogForm
        open={isAddAuditDialogOpen}
        onOpenChange={setIsAddAuditDialogOpen}
        onSubmit={handleAddAudit}
        isLoading={isLoading}
        title="Add New Audit"
        description="Create a new audit record by specifying the details."
        icon={<BookPlus className="h-5 w-5 text-blue-600" />}
        successMessage="Audit added successfully!"
        errorMessage="Failed to add audit. Please try again."
        submitText="Add Audit"
        fields={[
          {
            id: "name",
            label: "Audit Title",
            placeholder: "Enter audit title",
            required: true,
          },
          {
            id: "description",
            label: "Description",
            placeholder: "Enter audit description",
            required: false,
          },
          {
            id: "date",
            label: "Audit Date",
            type: "date",
            placeholder: "Select audit date",
            value: new Date().toISOString().split("T")[0],
            required: true,
          },
        ]}
      />
    </Card>
  );
}
