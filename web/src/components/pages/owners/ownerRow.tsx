"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Edit,
  ExternalLink,
  Trash,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type Owner from "@/models/Owner";
import { ConfirmationDialog } from "@/components/confirmationDialog";
import { deleteOwnerReq, updateOwnerReq } from "@/services/ownerService";
import { DialogForm } from "@/components/dialogForm";

interface OwnerRowProps {
  owner: Owner;
  onSubmitDone: () => void;
  onDelete?: () => void;
}

export function OwnerRow({ owner, onSubmitDone, onDelete }: OwnerRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOwnerDialogOpen, setIsEditOwnerDialogOpen] = useState(false);

  const handleEditOwner = async (
    values: Record<string, string>
  ): Promise<boolean> => {
    // if (!name || !password) return;
    const { username, password } = values;

    if (!username || !password) return false;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("guid", owner.managementGuid!);

    try {
      const res = await updateOwnerReq(formData);

      if (res) {
        onSubmitDone();
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Failed to update owner:", error);
      setIsLoading(false);
      return false;
    }
  };

  const onDeleteClicked = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("guid", owner.managementGuid!);

    try {
      const res = await deleteOwnerReq(formData);

      if (res && onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Failed to delete owner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableRow key={owner.id}>
      <TableCell>owner.name</TableCell>
      <TableCell>
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          ********
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {owner.managementGuid}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {owner?.createdAt
            ? new Date(owner.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
            : "N/A"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 justify-end">
          <>
            <Button
              size="sm"
              onClick={() => setIsEditOwnerDialogOpen(true)}
              variant="secondary"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Edit
              </span>
            </Button>

            <Button size="sm" asChild disabled={isLoading} variant="link">
              <Link href={`/audits/${owner.managementGuid}`}>
                <ExternalLink className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">
                  Audits
                </span>
              </Link>
            </Button>

            <ConfirmationDialog onYes={onDeleteClicked}>
              <Button size="sm" disabled={isLoading} variant="destructive">
                <Trash className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">
                  Delete
                </span>
              </Button>
            </ConfirmationDialog>
          </>
        </div>
      </TableCell>
      <DialogForm
        open={isEditOwnerDialogOpen}
        onOpenChange={setIsEditOwnerDialogOpen}
        onSubmit={handleEditOwner}
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
    </TableRow>
  );
}
