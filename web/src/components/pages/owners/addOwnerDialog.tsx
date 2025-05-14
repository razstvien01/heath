"use client";

import { UserPlus } from "lucide-react";
import { DialogProps } from "@/components/ui/dialogProps";
interface AddOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (username: string, password: string) => Promise<boolean>;
  isLoading: boolean;
}

export function AddOwnerDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddOwnerDialogProps) {
  const handleDialogSubmit = async (values: Record<string, string>) => {
    const { username, password, confirmPassword } = values;

    if (!username || !password || !confirmPassword) return false;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    return await onSubmit(username, password);
  };

  return (
    <DialogProps
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleDialogSubmit}
      isLoading={isLoading}
      title="Add New Owner"
      description="Create a new owner account with username and password."
      icon={<UserPlus className="h-5 w-5 text-emerald-500" />}
      successMessage="Owner added successfully!"
      errorMessage="Failed to add owner. Please try again."
      submitText="Add Owner"
      fields={[
        {
          id: "username",
          label: "Username",
          placeholder: "Enter username",
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
        {
          id: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          placeholder: "Re-enter password",
        },
      ]}
    />
  );
}
