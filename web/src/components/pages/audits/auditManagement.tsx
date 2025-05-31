"use client";

import { useState } from "react";
import { LoginForm } from "@/components/loginForm";
import { confirmOwnerLoginReq, getOwnerReq } from "@/services/ownerService";
import { ProfileHeader } from "../owners/profileHeader";
import Owner from "@/models/Owner";
import { AuditList } from "./auditList";

interface AuditManagementProps {
  guid: string;
}

export function AuditManagement({ guid }: AuditManagementProps) {
  const role = "owner";
  const [loggedInState, setLoggedInState] = useState(false);
  const [currentOwner, setCurrentOwner] = useState<Owner | undefined>(
    undefined
  );

  const handleLoginSuccess = async () => {
    setLoggedInState(true);

    const owner = await getOwnerReq(guid);
    setCurrentOwner(owner);
  };

  const handleLogout = () => {
    setLoggedInState(false);
  };

  return (
    <>
      {!loggedInState ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <LoginForm
            guid={guid}
            role={role}
            onLoginRequest={confirmOwnerLoginReq}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit</h1>
            <p className="text-muted-foreground">
              Manage owner accounts and permissions
            </p>
          </div>
          <ProfileHeader
            profile={currentOwner}
            onLogout={handleLogout}
            role="Owner"
          />
          <AuditList />
        </div>
      )}
    </>
  );
}
