"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OwnerRow } from "./ownerRow";
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowUpAZ,
  Wallet,
  LogIn,
  Search,
  User,
  UserPlus,
} from "lucide-react";
import type Owner from "@/models/Owner";
import { confirmAdminLoginReq } from "@/services/adminService";
import { addOwnerReq, fetchOwnersReq } from "@/services/ownerService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminDto } from "@/dto/admin";
import { AddOwnerDialog } from "./addOwnerDialog";
import { OwnerFilterDto } from "@/dto/owner";

type SortField = "name" | "dateCreated";
type SortDirection = "asc" | "desc";

export default function OwnerCrud({
  guid,
  admin,
}: {
  guid: string;
  admin: AdminDto;
}) {
  const [loggedInState, setLoggedInState] = useState(false);
  const [invalidLoginState, setInvalidLoginState] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState<AdminDto>({
    id: undefined,
    name: undefined,
    password: undefined,
    ownerManagementGuid: undefined,
  });
  const [ownerList, setOwnerList] = useState<Owner[]>([]);
  const [filteredOwnerList, setFilteredOwnerList] = useState<Owner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOwnerDialogOpen, setIsAddOwnerDialogOpen] = useState(false);
  //* Filters
  const [filterOwnerList] = useState<OwnerFilterDto>({
    page: 1,
    pageSize: 20,
    orderBy: "name",
    orderDirection: "asc",
  });
  const confirmAdminLogin = async () => {
    if (!adminUsername || !adminPassword) return;

    setIsLoading(true);
    setInvalidLoginState(false);

    try {
      const res = await confirmAdminLoginReq(
        guid,
        adminUsername,
        adminPassword
      );

      if (res) {
        setCurrentAdmin(admin);
        setAdminUsername("");
        setAdminPassword("");
        setLoggedInState(true);
      } else {
        setInvalidLoginState(true);
      }
    } catch (error) {
      setInvalidLoginState(true);
      console.error("Error confirming admin login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOwners = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetchOwnersReq(filterOwnerList);

      if (res) {
        setOwnerList(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch owners:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterOwnerList]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAdminLogin();
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowDownUp className="h-4 w-4 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowDownAZ className="h-4 w-4" />
    ) : (
      <ArrowUpAZ className="h-4 w-4" />
    );
  };

  const handleAddOwner = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    if (!username || !password) return false;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await addOwnerReq(formData);
      if (res) {
        fetchOwners();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding owner:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  useEffect(() => {
    if (loggedInState) {
      fetchOwners();
    }
  }, [loggedInState, fetchOwners]);

  useEffect(() => {
    let result = [...ownerList];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (owner) =>
          owner.name!.toLowerCase().includes(query) ||
          owner.managementGuid!.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name!.localeCompare(b.name!)
          : b.name!.localeCompare(a.name!);
      } else {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    setFilteredOwnerList(result);
  }, [ownerList, searchQuery, sortField, sortDirection]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4 px-6 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            <span className="text-2xl font-bold">Heath</span>
          </div>

          {loggedInState && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentAdmin.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Avatar className="h-8 w-8 border border-muted">
                <AvatarFallback className="bg-rose-100 text-rose-800">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 container mx-auto py-8 px-4">
        {!loggedInState ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                  Admin Login
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access the owner management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Username"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {invalidLoginState && (
                  <p className="text-red-500 text-sm text-center">
                    Invalid login credentials
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={confirmAdminLogin}
                  className="w-full bg-rose-600 hover:bg-rose-700"
                  disabled={isLoading || !adminUsername || !adminPassword}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Owner Management</h1>
                <p className="text-muted-foreground">
                  Manage owner accounts and permissions
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLoggedInState(false)}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                Logout
              </Button>
            </div>

            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                <div>
                  <CardTitle>Owner List</CardTitle>
                  <CardDescription>
                    Manage existing owner accounts
                  </CardDescription>
                </div>

                <div className="sm:ml-auto mt-4 sm:mt-0">
                  <Button
                    onClick={() => setIsAddOwnerDialogOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600"
                    disabled={isLoading}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Owner
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4 space-y-4">
                  {/* Search bar */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or GUID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {/* Sort controls */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground self-center">
                      Sort by:
                    </span>
                    <Button
                      variant={sortField === "name" ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1"
                    >
                      {getSortIcon("name")}
                      Name
                    </Button>
                    <Button
                      variant={
                        sortField === "dateCreated" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleSort("dateCreated")}
                      className="flex items-center gap-1"
                    >
                      {getSortIcon("dateCreated")}
                      Date Created
                    </Button>

                    {searchQuery && (
                      <Badge variant="outline" className="ml-auto">
                        {filteredOwnerList.length} results
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
                          {filteredOwnerList.length > 0 ? (
                            filteredOwnerList.map((owner) => (
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <AddOwnerDialog
        open={isAddOwnerDialogOpen}
        onOpenChange={setIsAddOwnerDialogOpen}
        onSubmit={handleAddOwner}
        isLoading={isLoading}
      />
    </div>
  );
}
