"use client";

import { Button } from "@/components/ui/button";
import { Edit, SquareArrowOutUpRight, Trash } from "lucide-react";
import { ImageDialog } from "@/components/imageDialog";
import { RecordAddReceiptSignatureDialog } from "./recordAddReceiptSignatureDialog";
import AuditRecord from "@/models/AuditRecord";

export function RecordRow({
  audit,
  onEditSuccess: onEditSuccess,
  onDeleteSuccess,
}: {
  audit: AuditRecord;
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
}) {
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

    if (res.ok && onEditSuccess) {
      onEditSuccess();
    }
  };

  const onDeleteClicked = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/record/deleteRecord";

    const formData = new FormData();
    formData.append("id", audit.id.toString());

    const res = await fetch(apiUrl, {
      method: "DELETE",
      body: formData,
    });

    if (res.ok) {
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    }
  };

  return (
    <tr key={audit.id} className="text-center">
      <td>{audit.amount}</td>
      <td>{audit.reason}</td>
      <td>
        {audit.receipt === null ? (
          "No"
        ) : (
          <ImageDialog value={audit.receipt.data} />
        )}
      </td>
      <td>
        {audit.signature === null ? (
          "No"
        ) : (
          <ImageDialog value={audit.signature} />
        )}
      </td>
      <td>{audit.runningBalance}</td>
      <td>{audit.createdAt.toLocaleString()}</td>
      <td>
        <Button className="bg-sky-400">
          <SquareArrowOutUpRight />
        </Button>
        <RecordAddReceiptSignatureDialog
          onSave={(receipt, signature) =>
            onEditSaved(receipt, signature, audit.id)
          }
        >
          <Button className="bg-amber-500">
            <Edit />
          </Button>
        </RecordAddReceiptSignatureDialog>
        <Button className="bg-red-500" onClick={onDeleteClicked}>
          <Trash />
        </Button>
      </td>
    </tr>
  );
}
