import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EyeIcon, EyeOffIcon, LogIn } from "lucide-react";

interface LoginFormProps {
  guid: string;
  role: "admin" | "owner";
  onLoginSuccess: () => void;
  onLoginRequest: (
    guid: string,
    username: string,
    password: string
  ) => Promise<boolean>;
}

export function LoginForm({
  guid,
  role,
  onLoginRequest,
  onLoginSuccess,
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidLoginState, setInvalidLoginState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const confirmLogin = async () => {
    if (!username || !password) return;

    setIsLoading(true);
    setInvalidLoginState(false);

    try {
      const res = await onLoginRequest(guid, username, password);

      if (res) {
        setShowLoginSuccess(true);
        setTimeout(() => {
          setUsername("");
          setPassword("");
          onLoginSuccess();
        }, 1000);
      } else {
        setInvalidLoginState(true);
      }
    } catch (error) {
      setInvalidLoginState(true);
      console.error(`Error confirming ${role} login:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmLogin();
  };

  const roleLabel = role === "admin" ? "Admin" : "Owner";

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {roleLabel} Login
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the {roleLabel.toLocaleLowerCase()}{" "}
          portal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className="hide-password-toggle pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={handleKeyDown}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={showPassword}
          >
            {showPassword ? (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        {invalidLoginState && (
          <p className="text-red-500 text-sm text-center">
            Invalid {roleLabel.toLowerCase()} login credentials
          </p>
        )}
        {showLoginSuccess && (
          <p className="text-secondary-foreground text-sm text-center">
            The {roleLabel.toLowerCase()} logged in successfully
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="default"
          onClick={confirmLogin}
          className="w-full"
          disabled={isLoading || !username || !password}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Logging in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="flex items-center gap-2" />
              Login
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
