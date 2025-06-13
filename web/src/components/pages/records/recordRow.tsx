"use client";

import { Button } from "@/components/ui/button";
import { Edit, SquareArrowOutUpRight, Trash } from "lucide-react";
import { ImageDialog } from "@/components/imageDialog";
import { RecordAddReceiptSignatureDialog } from "./recordAddReceiptSignatureDialog";
import { RecordDto } from "@/dto/record";
import { TableCell, TableRow } from "@/components/ui/table";
import { AuditRecordDto } from "@/dto/record/AuditRecordDto";
import ReceiptViewer from "@/components/receiptViewer";

interface RecordRowProps {
  record: AuditRecordDto;
  onSubmitDone: () => void;
}

type SerializedBuffer = {
  type: "Buffer";
  data: number[];
};

export function RecordRow({ record, onSubmitDone }: RecordRowProps) {
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

  const onDeleteClicked = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/record/deleteRecord";

    const formData = new FormData();
    formData.append("id", String(record.id));

    const res = await fetch(apiUrl, {
      method: "DELETE",
      body: formData,
    });

    if (res.ok) {
      if (onSubmitDone) {
        onSubmitDone();
      }
    }
  };

  function isSerializedBuffer(obj: any): obj is { data: number[] } {
    return (
      obj &&
      typeof obj === "object" &&
      obj.type === "Buffer" &&
      Array.isArray(obj.data)
    );
  }

  return (
    <TableRow key={record.id}>
      <TableCell>{record.amount}</TableCell>
      <TableCell>
        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {record.reason}
        </span>
      </TableCell>
      <TableCell>
        {isSerializedBuffer(record.receipt) &&
        record.receipt.data.length > 0 ? (
          <ReceiptViewer
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
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          {record.signature}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs text-muted-foreground truncate max-w-full inline-block">
          99999
        </span>
      </TableCell>
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
            {/* <Button
              size="sm"
              onClick={() => setIsEditAuditDialogOpen(true)}
              variant="secondary"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Update
              </span>
            </Button> */}

            {/* <Button size="sm" asChild disabled={isLoading} variant="link">
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
            </Button> */}
            {/* <Button
              size="sm"
              disabled={isLoading}
              variant="destructive"
              onClick={() => setIsDeleteAuditDialogOpen(true)}
            >
              <Trash className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:inline-block">
                Delete
              </span>
            </Button> */}
          </>
        </div>
      </TableCell>
    </TableRow>

    // <tr key={audit.id} className="text-center">
    //   <td>{audit.amount}</td>
    //   <td>{audit.reason}</td>
    //   <td>
    //     {audit.receipt === null ? (
    //       "No"
    //     ) : (
    //       <ImageDialog value={audit.receipt.data} />
    //     )}
    //   </td>
    //   <td>
    //     {audit.signature === null ? (
    //       "No"
    //     ) : (
    //       <ImageDialog value={audit.signature} />
    //     )}
    //   </td>
    //   <td>{audit.runningBalance}</td>
    //   <td>{audit.createdAt.toLocaleString()}</td>
    //   <td>
    //     <Button className="bg-sky-400">
    //       <SquareArrowOutUpRight />
    //     </Button>
    //     <RecordAddReceiptSignatureDialog
    //       onSave={(receipt, signature) =>
    //         onEditSaved(receipt, signature, audit.id)
    //       }
    //     >
    //       <Button className="bg-amber-500">
    //         <Edit />
    //       </Button>
    //     </RecordAddReceiptSignatureDialog>
    //     <Button className="bg-red-500" onClick={onDeleteClicked}>
    //       <Trash />
    //     </Button>
    //   </td>
    // </tr>
  );
}
