"use client";

import { useState } from "react";
import { LoginForm } from "@/components/loginForm";
import { confirmOwnerLoginReq, getOwnerReq } from "@/services/ownerService";
import { ProfileHeader } from "../owners/profileHeader";
import { AuditList } from "./auditList";
import { Owner } from "@/models";

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
    const owner = await getOwnerReq(guid);

    if (!owner) {
      throw new Error("Owner not found");
    }

    setLoggedInState(true);
    setCurrentOwner(owner);
  };

  const handleLogout = () => {
    setLoggedInState(false);
    setCurrentOwner(undefined);
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Audit Management</h1>
              <p className="text-muted-foreground">
                Review audit trails and monitor activity history
              </p>
            </div>

            <ProfileHeader
              profile={currentOwner}
              onLogout={handleLogout}
              role={role !== "owner" ? "Administrator" : "Owner"}
            />
          </div>
          <AuditList guid={guid} />
        </div>
      )}
    </>
  );
}
