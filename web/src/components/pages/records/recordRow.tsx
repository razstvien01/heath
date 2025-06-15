"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { AuditRecordDto } from "@/dto/record/AuditRecordDto";
import { useState } from "react";
import ImageViewer from "@/components/imageViewer";
import { formatCurrency } from "@/utils/format";
import { DialogForm } from "@/components/dialogForm";
import { deleteRecordReq } from "@/services/recordService";

interface RecordRowProps {
  record: AuditRecordDto;
  onSubmitDone: () => void;
}

export function RecordRow({ record, onSubmitDone }: RecordRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditRecordDialogOpen, setIsEditRecordDialogOpen] = useState(false);
  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] =
    useState(false);

  const onEditSaved = async (
    receipt: File | null,
    signature: string | null,
    id: number
  ): Promise<void> => {
    const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/record/editRecord";

    const formData = new FormData();
    formData.append("id", id.toString());
    if (receipt) {
      formData.append("receipt", receipt);
    }

    if (signature) {
      formData.append("signature", signature);
    }

    const res = await fetch(fetchUrl, {
      method: "PUT",
      body: formData,
    });

    if (res.ok && onSubmitDone) {
      onSubmitDone();
    }
  };
  
  const handleDeleteRecord = async (): Promise<boolean> => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", String(record.id));

    try {
      const res = await deleteRecordReq(formData);

      setIsLoading(false);
      if (res) {
        onSubmitDone();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete record:", error);
      setIsLoading(false);
      return false;
    }
  };

  function isSerializedBuffer(obj: unknown): obj is { type: string; data: number[] } {
    return (
      typeof obj === "object" &&
      obj !== null &&
      (obj as { type?: string }).type === "Buffer" &&
      Array.isArray((obj as { data?: unknown }).data)
    );
  }

  return (
    <TableRow key={record.id}>
      <TableCell>{formatCurrency(record.amount)}</TableCell>
      <TableCell>
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {record.reason}
        </span>
      </TableCell>
      <TableCell>
        {isSerializedBuffer(record.receipt) &&
        record.receipt.data.length > 0 ? (
          <ImageViewer
            src={`data:image/png;base64,${Buffer.from(
              record.receipt.data
            ).toString("base64")}`}
          />
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            No receipt
          </span>
        )}
      </TableCell>

      <TableCell>
        {record.signature ? (
          <ImageViewer
            src={`data:image/png;base64,${record.signature}`}
            alt="Signature"
          />
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            No signature
          </span>
        )}
      </TableCell>

      <TableCell>{formatCurrency(record.runningBalance)}</TableCell>

      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {record?.createdAt
            ? new Date(record.createdAt).toLocaleString("en-US", {
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
              onClick={() => setIsEditRecordDialogOpen(true)}
              variant="secondary"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Update
              </span>
            </Button>
            <Button
              size="sm"
              disabled={isLoading}
              variant="destructive"
              onClick={() => setIsDeleteRecordDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Delete
              </span>
            </Button>
          </>
        </div>
      </TableCell>

      {/* <DialogForm
        open={isEditRecordDialogOpen}
        onOpenChange={setIsEditRecordDialogOpen}
        onSubmit={handleEditRecord}
        isLoading={isLoading}
        title="Update Record"
        description="Modify the record with the necessary details."
        icon={<Edit className="h-5 w-5 text-blue-500" />}
        successMessage="Record updated successfully!"
        errorMessage="Failed to update the audit. Please try again."
        submitText="Update Record"
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
      /> */}

      <DialogForm
        open={isDeleteRecordDialogOpen}
        onOpenChange={setIsDeleteRecordDialogOpen}
        onSubmit={handleDeleteRecord}
        isLoading={isLoading}
        title="Delete Record"
        description="Delete the record permanently. This action cannot be undone."
        icon={<Trash className="h-5 w-5 text-red-500" />}
        successMessage="Record deleted successfully!"
        errorMessage="Failed to delete the record. Please try again."
        submitText="Delete Record"
        fields={[]}
      />
    </TableRow>
  );
}
