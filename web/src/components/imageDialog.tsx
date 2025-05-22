"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ImageDialog({ value }: { value: [] | string }) {
  const [imgSrc, setImgSrc] = useState("")

  useEffect(() => {
    if (typeof value === "string") {
      setImgSrc("data:image/png;base64," + value)
    } else {
      const uint8array = new Uint8Array(value)
      const blob = new Blob([uint8array], { type: "image/jpeg" });

      const reader = new FileReader()
      reader.onload = (readerEvt) => {
        let binaryString = readerEvt.target?.result;
        if (typeof binaryString === 'string') {
          console.log("array ", binaryString)
          setImgSrc(binaryString)
        }
      }
      reader.readAsDataURL(blob)
    }
  }, [value])


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 h-50 w-50">
          <img src={imgSrc} />
        </div>
      </DialogContent>
    </Dialog>
  )
}