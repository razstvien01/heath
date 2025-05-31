"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { AdminDto } from "@/dto/admin";
import { OwnerDto } from "@/dto/owner";

interface ProfileHeaderProps {
  profile: AdminDto | OwnerDto | undefined;
  onLogout: () => void;
  role: "Administrator" | "Owner";
}

export function ProfileHeader({ profile, onLogout, role }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">
            {profile !== undefined ? profile.name : "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
        <Avatar className="h-8 w-8 border border-muted">
          <AvatarFallback className="bg-rose-100 text-rose-800">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
      <Button
        variant="outline"
        onClick={onLogout}
        className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
      >
        Logout
      </Button>
    </div>
  );
}
