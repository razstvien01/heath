"use client";

import { useState } from "react";
import { OwnerList } from "./ownerList";
import { confirmAdminLoginReq, getAdminReq } from "@/services/adminService";
import { LoginForm } from "@/components/loginForm";
import { ProfileHeader } from "./profileHeader";
import Admin from "@/models/Admin";

interface OwnerManagementProps {
  guid: string;
}

export function OwnerManagement({ guid }: OwnerManagementProps) {
  const role = "admin";
  const [loggedInState, setLoggedInState] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | undefined>(
    undefined
  );

  const handleLoginSuccess = async () => {
    const admin = await getAdminReq(guid);
    
    if (!admin) {
      throw new Error("Admin not found");
    }

    setLoggedInState(true);
    setCurrentAdmin(admin);
  };

  const handleLogout = () => {
    setLoggedInState(false);
    setCurrentAdmin(undefined);
  };

  return (
    <>
      {!loggedInState ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <LoginForm
            guid={guid}
            role={role}
            onLoginRequest={confirmAdminLoginReq}
            onLoginSuccess={handleLoginSuccess}
          />
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
            <ProfileHeader
              profile={currentAdmin}
              onLogout={handleLogout}
              role={role === "admin" ? "Administrator" : "Owner"}
            />
          </div>
          <OwnerList />
        </div>
      )}
    </>
  );
}
