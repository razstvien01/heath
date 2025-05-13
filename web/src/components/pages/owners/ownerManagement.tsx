"use client";

import { useState } from "react";
import { AdminHeader } from "./adminHeader";
import type { AdminDto } from "@/dto/admin";
import { LoginForm } from "./loginForm";
import { OwnerList } from "./ownerList";

interface OwnerManagementProps {
  guid: string;
  admin: AdminDto;
}

export function OwnerManagement({ guid, admin }: OwnerManagementProps) {
  const [loggedInState, setLoggedInState] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminDto>({
    id: undefined,
    name: undefined,
    password: undefined,
    ownerManagementGuid: undefined,
  });

  const handleLoginSuccess = () => {
    setCurrentAdmin(admin);
    setLoggedInState(true);
  };

  const handleLogout = () => {
    setLoggedInState(false);
    setCurrentAdmin({
      id: undefined,
      name: undefined,
      password: undefined,
      ownerManagementGuid: undefined,
    });
  };

  return (
    <>
      {!loggedInState ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <LoginForm guid={guid} onLoginSuccess={handleLoginSuccess} />
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
            <AdminHeader admin={currentAdmin} onLogout={handleLogout} />
          </div>
          <OwnerList />
        </div>
      )}
    </>
  );
}
