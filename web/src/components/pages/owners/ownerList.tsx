"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OwnerRow } from "./ownerRow";
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  Search,
  UserPlus,
} from "lucide-react";
import { Owner } from "@/models";
import { addOwnerReq, fetchOwnersReq } from "@/services/ownerService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OwnerFilterDto } from "@/dto/owner";
import { DialogForm } from "@/components/dialogForm";
import { TableFooter } from "@/components/tableFooter";

type SortField = "name" | "createdAt";
type SortDirection = "asc" | "desc";

export function OwnerList() {
  const [ownerList, setOwnerList] = useState<Owner[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOwnerList, setFilterOwnerList] = useState<OwnerFilterDto>({
    name: undefined,
    managementGuid: undefined,
    page: 1,
    pageSize: 10,
    orderBy: "name",
    orderDirection: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "name",
    direction: "asc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOwnerDialogOpen, setIsAddOwnerDialogOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const fetchOwners = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetchOwnersReq(filterOwnerList);

      if (res) {
        setOwnerList(res.data.owners);
        setTotalCount(res.data.total);
      } else {
        setOwnerList([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Failed to fetch owners:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterOwnerList]);

  const handleAddOwner = async (
    values: Record<string, string | File | undefined>
  ): Promise<boolean> => {
    const { username, password, confirmPassword } = values;

    if (!username || !password || !confirmPassword) return false;

    if (password !== confirmPassword) throw new Error("Passwords do not match");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await addOwnerReq(formData);
      if (res) {
        fetchOwners();
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error("Error adding owner:", error);
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

  const handleChangeTable = (changes: Partial<OwnerFilterDto>) => {
    setFilterOwnerList((prev) => ({
      ...prev,
      ...changes,
      ...(changes.pageSize && { page: 1 }),
    }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setFilterOwnerList((prev) => {
      const newFilter = {
        ...prev,
        name: debouncedQuery || undefined,
        managementGuid: debouncedQuery || undefined,
        page: 1,
      };

      // Avoid redundant state updates - still called the fetchOwners twice
      if (
        prev.name === newFilter.name &&
        prev.managementGuid === newFilter.managementGuid &&
        prev.page === newFilter.page
      ) {
        return prev;
      }

      return newFilter;
    });
  }, [debouncedQuery]);

  useEffect(() => {
    fetchOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOwnerList]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full border">
        <div>
          <CardTitle>Owner Directory</CardTitle>
          <CardDescription>
            Browse, update, or remove owner accounts from the system
          </CardDescription>
        </div>

        <div className="sm:ml-auto mt-4 sm:mt-0">
          <Button
            onClick={() => setIsAddOwnerDialogOpen(true)}
            disabled={isLoading}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Owner
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
                {ownerList.length} results
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
                      Username
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Password
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Guid
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
                  {ownerList.length > 0 ? (
                    ownerList.map((owner) => (
                      <OwnerRow
                        key={owner.id}
                        owner={owner}
                        onSubmitDone={fetchOwners}
                        onDelete={fetchOwners}
                      />
                    ))
                  ) : (
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <td
                        colSpan={5}
                        className="p-4 align-middle text-center text-muted-foreground"
                      >
                        {searchQuery
                          ? "No matching owners found"
                          : "No owners found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!isLoading && ownerList.length > 0 && (
          <TableFooter
            filterList={filterOwnerList}
            totalCount={totalCount}
            handleChangeTable={handleChangeTable}
            isLoading={isLoading}
          />
        )}
      </CardContent>

      <DialogForm
        open={isAddOwnerDialogOpen}
        onOpenChange={setIsAddOwnerDialogOpen}
        onSubmit={handleAddOwner}
        isLoading={isLoading}
        title="Add New Owner"
        description="Create a new owner account with username and password."
        icon={<UserPlus className="h-5 w-5 text-emerald-500" />}
        successMessage="Owner added successfully!"
        errorMessage="Failed to add owner. Please try again."
        submitText="Add Owner"
        fields={[
          {
            id: "username",
            label: "Username",
            placeholder: "Enter username",
            required: true,
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter password",
            required: true,
          },
          {
            id: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Re-enter password",
            required: true,
          },
        ]}
      />
    </Card>
  );
}
