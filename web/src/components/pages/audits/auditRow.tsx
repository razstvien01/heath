"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogForm } from "@/components/dialogForm";
import { TableCell, TableRow } from "@/components/ui/table";
import { AuditDto } from "@/dto/audit";
import { Edit, ExternalLink, Trash } from "lucide-react";
import { deleteAuditReq, updateAuditReq } from "@/services/auditService";
import Link from "next/link";

interface AuditRowProps {
  audit: AuditDto;
  onSubmitDone: () => void;
}

export function AuditRow({ audit, onSubmitDone }: AuditRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditAuditDialogOpen, setIsEditAuditDialogOpen] = useState(false);
  const [isDeleteAuditDialogOpen, setIsDeleteAuditDialogOpen] = useState(false);

  const handleEditAudit = async (
    values: Record<string, string | File | undefined>
  ): Promise<boolean> => {
    const { title, description, date } = values;

    if (!title) return false;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", String(audit.id));
    formData.append("name", title);
    formData.append("description", String(description));
    formData.append("date", String(date));

    try {
      const res = await updateAuditReq(formData);

      if (res) {
        onSubmitDone();
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Failed to update audit:", error);
      setIsLoading(false);
      return false;
    }
  };

  const handleDeleteAudit = async (): Promise<boolean> => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", String(audit.id));

    try {
      const res = await deleteAuditReq(formData);

      setIsLoading(false);
      if (res) {
        onSubmitDone();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete audit:", error);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <TableRow key={audit.id}>
      <TableCell>{audit.name}</TableCell>
      <TableCell>
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {audit.entries}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {audit.ownerGuid}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {audit.publicGuid}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {audit?.createdAt
            ? new Date(audit.createdAt).toLocaleString("en-US", {
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
              onClick={() => setIsEditAuditDialogOpen(true)}
              variant="secondary"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Update
              </span>
            </Button>

            <Button size="sm" asChild disabled={isLoading} variant="link">
              <Link
                href={`/records/${audit.publicGuid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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
              onClick={() => setIsDeleteAuditDialogOpen(true)}
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
        open={isEditAuditDialogOpen}
        onOpenChange={setIsEditAuditDialogOpen}
        onSubmit={handleEditAudit}
        isLoading={isLoading}
        title="Update Audit"
        description="Modify the audit record with the necessary details."
        icon={<Edit className="h-5 w-5 text-blue-500" />}
        successMessage="Audit updated successfully!"
        errorMessage="Failed to update the audit. Please try again."
        submitText="Update Audit"
        fields={[
          {
            id: "title",
            label: "Audit Title",
            placeholder: "Enter audit title",
            value: audit.name,
            required: true,
          },
          {
            id: "description",
            label: "Audit Description",
            placeholder: "Enter audit description",
            value: audit.description,
            required: false,
          },
          {
            id: "date",
            label: "Audit Date",
            type: "date",
            placeholder: "Select audit date",
            value: audit.createdAt
              ? new Date(audit.createdAt).toISOString().split("T")[0]
              : "",
            required: true,
          },
        ]}
      />

      <DialogForm
        open={isDeleteAuditDialogOpen}
        onOpenChange={setIsDeleteAuditDialogOpen}
        onSubmit={handleDeleteAudit}
        isLoading={isLoading}
        title="Delete Audit"
        description="Delete the audit permanently. This action cannot be undone."
        icon={<Trash className="h-5 w-5 text-red-500" />}
        successMessage="Audit deleted successfully!"
        errorMessage="Failed to delete the audit. Please try again."
        submitText="Delete Audit"
        fields={[]}
      />
    </TableRow>
  );
}
