"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { CircleOff, Edit, ExternalLink, Save, Trash } from "lucide-react";
import Link from "next/link";
import type Owner from "@/models/Owner";
import { ConfirmationDialog } from "@/components/ui/confirmationDialog";

interface OwnerRowProps {
  owner: Owner;
  onSubmitDone: () => void;
  onDelete?: () => void;
}

export function OwnerRow({ owner, onSubmitDone, onDelete }: OwnerRowProps) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setName(owner.name);
  }, [owner.name]);

  const onSubmit = async () => {
    if (!name) return;

    setIsLoading(true);
    const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/owner/updateOwner";

    const formData = new FormData();
    formData.append("username", name);
    formData.append("password", password);
    formData.append("guid", owner.managementGuid);

    try {
      const res = await fetch(fetchUrl, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setEditMode(false);
        setPassword("");
        onSubmitDone();
      }
    } catch (error) {
      console.error("Failed to update owner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteClicked = async () => {
    setIsLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/owner/deleteOwner";

    const formData = new FormData();
    formData.append("guid", owner.managementGuid);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (res.ok && onDelete) {
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
      <TableCell>
        {editMode ? (
          <Input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-[200px]"
          />
        ) : (
          owner.name
        )}
      </TableCell>
      <TableCell>
        {editMode ? (
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="max-w-[200px]"
          />
        ) : (
          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            ********
          </span>
        )}
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
          {editMode ? (
            <>
              <Button
                size="sm"
                onClick={() => setEditMode(false)}
                variant="destructive"
                disabled={isLoading}
              >
                <CircleOff className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">
                  Cancel
                </span>
              </Button>
              <Button
                size="sm"
                onClick={onSubmit}
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={isLoading || !name}
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Save
                    </span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => setEditMode(true)}
                className="bg-amber-500 hover:bg-amber-600"
                disabled={isLoading}
              >
                <Edit className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only sm:inline-block">
                  Edit
                </span>
              </Button>

              <Button
                size="sm"
                className="bg-sky-500 hover:bg-sky-600"
                asChild
                disabled={isLoading}
              >
                <Link href={`/audits/${owner.managementGuid}`}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Audits
                  </span>
                </Link>
              </Button>

              <ConfirmationDialog onYes={onDeleteClicked}>
                <Button
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                  disabled={isLoading}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Delete
                  </span>
                </Button>
              </ConfirmationDialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
