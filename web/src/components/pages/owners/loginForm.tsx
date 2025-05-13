"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { confirmAdminLoginReq } from "@/services/adminService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LoginFormProps {
  guid: string;
  onLoginSuccess: () => void;
}

export function LoginForm({ guid, onLoginSuccess }: LoginFormProps) {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [invalidLoginState, setInvalidLoginState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setAdminUsername("");
        setAdminPassword("");
        onLoginSuccess();
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAdminLogin();
    }
  };

  return (
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
  );
}
