"use client";

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
import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmitRequest = () => {
    console.log("Request submitted:", { email, reason });
  };

  return (
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
          running balances. Each entry supports descriptions, receipts, and even
          digital signatures.
        </p>
      </div>

      {/* Right side - Actions */}
      <div className="md:w-1/2 p-10 flex flex-col justify-center items-center space-y-6 bg-background">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Access Heath
        </h2>

        <div className="w-full max-w-sm space-y-4">
          <Button
            className="w-full"
            variant="default"
            onClick={() => console.log("Admin login")}
          >
            Log in as Admin
          </Button>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => console.log("Owner login")}
          >
            Log in as Owner
          </Button>

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
  );
}
