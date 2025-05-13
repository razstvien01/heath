"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import type { AdminDto } from "@/dto/admin";

interface AdminHeaderProps {
  admin: AdminDto;
  onLogout: () => void;
}

export function AdminHeader({ admin, onLogout }: AdminHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{admin.name}</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
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
