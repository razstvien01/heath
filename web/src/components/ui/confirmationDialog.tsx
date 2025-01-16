"use client"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"

export function ConfirmationDialog({ onYes, onNo, children }: { onYes?: () => void, onNo?: () => void, children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onYes} className="bg-emerald-500">Yes</Button>
          <DialogClose>
            <Button onClick={onNo} className="bg-rose-500">No</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}