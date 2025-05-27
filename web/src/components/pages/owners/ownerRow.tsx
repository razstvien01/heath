"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, ExternalLink, Trash } from "lucide-react";
import Link from "next/link";
import type Owner from "@/models/Owner";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditOwner = async (
    values: Record<string, string>
  ): Promise<boolean> => {
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

  const handleDeleteOwner = async (): Promise<boolean> => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("guid", owner.managementGuid!);

    try {
      const res = await deleteOwnerReq(formData);

      if (res && onDelete) {
        onDelete();
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

  return (
    <TableRow key={owner.id}>
      <TableCell>{owner.name}</TableCell>
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
                Update
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
            <Button
              size="sm"
              disabled={isLoading}
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Delete
              </span>
            </Button>
          </>
        </div>
      </TableCell>
      <DialogForm
        open={isEditOwnerDialogOpen}
        onOpenChange={setIsEditOwnerDialogOpen}
        onSubmit={handleEditOwner}
        isLoading={isLoading}
        title="Update Owner"
        description="Update the owner account with username and password."
        icon={<Edit className="h-5 w-5 text-amber-500" />}
        successMessage="Owner updated successfully!"
        errorMessage="Failed to update the owner. Please try again."
        submitText="Update Owner"
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
      <DialogForm
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSubmit={handleDeleteOwner}
        isLoading={isLoading}
        title="Delete Owner"
        description="Delete the owner account permanently. This action cannot be undone."
        icon={<Trash className="h-5 w-5 text-red-500" />}
        successMessage="Owner deleted successfully!"
        errorMessage="Failed to delete the owner. Please try again."
        submitText="Delete Owner"
        fields={[]}
      />
    </TableRow>
  );
}
