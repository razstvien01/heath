"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { AuditRecordDto } from "@/dto/record/AuditRecordDto";
import { useState } from "react";
import ImageViewer from "@/components/imageViewer";
import { formatCurrency } from "@/utils/format";
import { DialogForm } from "@/components/dialogForm";
import { deleteRecordReq, editRecordReq } from "@/services/recordService";
import { isSerializedBuffer } from "@/utils/typeCheck";

interface RecordRowProps {
  record: AuditRecordDto;
  onSubmitDone: () => void;
  mode: string;
}

export function RecordRow({ record, onSubmitDone, mode }: RecordRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditRecordDialogOpen, setIsEditRecordDialogOpen] = useState(false);
  const [isDeleteRecordDialogOpen, setIsDeleteRecordDialogOpen] =
    useState(false);

  const handleEditRecord = async (
    values: Record<string, string | File | undefined>
  ): Promise<boolean> => {
    const { reason, amount, receipt, signature } = values;

    try {
      const formData = new FormData();
      formData.append("id", String(record.id));

      if (mode === "private") {
        formData.append("reason", String(reason));
        formData.append("amount", String(amount));
      }

      if (receipt) formData.append("receipt", receipt);
      else formData.append("receipt", String(record.receipt));

      if (signature) formData.append("signature", signature);

      const res = await editRecordReq(formData);

      if (res) {
        onSubmitDone();
        setIsLoading(false);
        return true;
      }
    } catch {
      console.error("Failed to edit record");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }

    return false;
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

  function getImageDataUrl(input: any): string | null {
    if (!input) return null;

    if (typeof input === "string" && input.startsWith("data:image/")) {
      return input; // already a base64 URL
    }

    if (input?.data) {
      return `data:image/png;base64,${Buffer.from(input.data).toString(
        "base64"
      )}`;
    }

    return null;
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

      <DialogForm
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
        fields={
          mode === "private"
            ? [
                {
                  id: "amount",
                  label: "Amount",
                  type: "number",
                  placeholder: "Enter amount",
                  required: true,
                  value: String(record.amount),
                },
                {
                  id: "reason",
                  label: "Reason",
                  type: "text",
                  placeholder: "Enter reason for the record",
                  required: true,
                  value: String(record.reason),
                },
                {
                  id: "receipt",
                  label: "Receipt",
                  type: "file",
                  accept: ".png,.jpg,.jpeg",
                  required: false,
                  value: getImageDataUrl(record.receipt),
                },
                {
                  id: "signature",
                  label: "Signature",
                  type: "signature",
                  required: false,
                  value: record.signature || "",
                },
              ]
            : [
                {
                  id: "receipt",
                  label: "Receipt",
                  type: "file",
                  accept: ".png,.jpg,.jpeg",
                  required: false,
                  value: getImageDataUrl(record.receipt),
                },
                {
                  id: "signature",
                  label: "Signature",
                  type: "signature",
                  required: false,
                  value: record.signature || "",
                },
              ]
        }
      />

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
