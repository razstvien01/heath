"use client"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { SetStateAction, useState } from "react"
import { Input } from "@/components/ui/input"
import { SignatureDialog } from "@/components/ui/signatureDialog"
import { Button } from "@/components/ui/button"

export function RecordAddReceiptSignatureDialog({ 
  onSave,
  children 
}: {  
    onSave?: (receipt: File | null, signature: string | null) => void,
    children: React.ReactNode 
  }) {
  const [receiptInput, setReceiptInput] = useState<File | null>(null)
  const [signatureInput, setSignatureInput] = useState(null)

  const onReceiptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setReceiptInput(file);
      }
  }

  const onSignatureInputChange = (e: { base64: SetStateAction<null>; }) => {
    setSignatureInput(e.base64);
  }

  function onSaveClicked(): void {
    if (onSave) {
      onSave(receiptInput, signatureInput);
    }
    setSignatureInput(null);
    setReceiptInput(null);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Record</DialogTitle>
        </DialogHeader>
        <table>
          <tbody>
            <tr>
              <td>
                Receipt
              </td>
              <td>
                <Input onChange={onReceiptInputChange} type="file" accept=".png,.jpg,.jpeg" className="icon-upload"/>
              </td>
            </tr>
            <tr>
              <td className="w-24">
                Signature
              </td>
              <td>
                <SignatureDialog value={signatureInput} onChange={onSignatureInputChange}/>
              </td>
            </tr>
          </tbody>
        </table>
        <DialogFooter>
          <DialogClose>
            <Button onClick={onSaveClicked} className="bg-emerald-500">Save</Button>
            <Button className="bg-rose-500">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}