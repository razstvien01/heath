"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [guid, setGuid] = useState("");
  const [guidError, setGuidError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!guid.trim()) {
      setGuidError("GUID is required.");
      return;
    }

    setGuidError("");
    console.log(`Logging in with GUID: ${guid}`);
    
    router.push(`/owners/${guid}`);
  };

  const handleSubmitRequest = () => {
    console.log("Account request submitted:", { email, reason });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Intro */}
        <div className="md:w-1/2 bg-muted p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to Heath
          </h1>
          <p className="text-lg text-muted-foreground mb-6 italic">
            “Streamline Records. Empower Accountability.”
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Heath is a streamlined ledger and auditing app designed to simplify
            money tracking and accountability. Built for transparency and
            precision, Heath empowers users to create and manage multiple
            financial ledgers, record detailed entries, and maintain accurate
            running balances. Each entry supports descriptions, receipts, and
            even digital signatures.
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center items-center space-y-6 bg-background">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Access Heath
          </h2>

          <div className="w-full max-w-sm space-y-4">
            {/* GUID Input */}
            <div className="space-y-2">
              <Label htmlFor="guid">Enter Your GUID</Label>
              <Input
                id="guid"
                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                value={guid}
                onChange={(e) => {
                  setGuid(e.target.value);
                  if (guidError) setGuidError("");
                }}
              />
              {guidError && (
                <p className="text-sm text-red-500 mt-1">{guidError}</p>
              )}
            </div>
            <Button
              className="w-full"
              variant="default"
              onClick={() => handleLogin()}
            >
              Log in
            </Button>

            {/* Visual separator with label */}
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Don’t have an account?
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Request Account Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Request Account Creation
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request an Account</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason / Role</Label>
                    <Input
                      id="reason"
                      placeholder="e.g., Clinic Owner at XYZ Health"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSubmitRequest} className="w-full">
                    Submit Request
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <footer className="w-full bg-muted p-4 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Heath App. All rights reserved.
      </footer>
    </div>
  );
}
