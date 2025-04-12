"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OwnerRow } from "./ownerRow";
import { LogIn, Table, UserPlus } from "lucide-react";
import Owner from "@/models/Owner";
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
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OwnerCrud({ guid }: { guid: string }) {
  const [loggedInState, setLoggedInState] = useState(false);
  const [invalidLoginState, setInvalidLoginState] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [addOwnerNameInput, setAddOwnerNameInput] = useState("");
  const [addOwnerPasswordInput, setAddOwnerPasswordInput] = useState("");

  const [ownerList, setOwnerList] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loggedInState) {
      fetchOwners();
    }
  }, [loggedInState]);

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

  const fetchOwners = async () => {
    setIsLoading(true);

    try {
      const res = await fetchOwnersReq();

      if (res) {
        setOwnerList(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch owners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addOwner = async () => {
    if (!addOwnerNameInput || !addOwnerPasswordInput) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", addOwnerNameInput);
    formData.append("password", addOwnerPasswordInput);

    try {
      const res = await addOwnerReq(formData);
      if (res) {
        setAddOwnerNameInput("");
        setAddOwnerPasswordInput("");
        fetchOwners();
      }
    } catch (error) {
      console.error("Error adding owner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAdminLogin();
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {!loggedInState ? (
        <div className="flex justify-center items-center min-h-[80vh]">
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
                className="w-full"
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
            <h1 className="text-3xl font-bold">Owner Management</h1>
            <Button variant="outline" onClick={() => setLoggedInState(false)}>
              Logout
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add New Owner</CardTitle>
              <CardDescription>
                Create a new owner account with username and password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={addOwnerNameInput}
                  onChange={(e) => setAddOwnerNameInput(e.target.value)}
                  placeholder="Username"
                  className="flex-1"
                />
                <Input
                  value={addOwnerPasswordInput}
                  onChange={(e) => setAddOwnerPasswordInput(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="flex-1"
                />
                <Button
                  onClick={addOwner}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={
                    isLoading || !addOwnerNameInput || !addOwnerPasswordInput
                  }
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Owner
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner List</CardTitle>
              <CardDescription>Manage existing owner accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Guid</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ownerList?.length > 0 ? (
                        ownerList?.map((owner) => (
                          <OwnerRow
                            key={owner.id}
                            owner={owner}
                            onSubmitDone={fetchOwners}
                            onDelete={fetchOwners}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No owners found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
