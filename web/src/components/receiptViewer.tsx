import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ReceiptViewer({ src }: { src: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-primary"
      >
        <Eye className="w-4 h-4" /> View
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-fit p-0">
          <DialogTitle>Receipt Image</DialogTitle>
          <Image
            src={src}
            alt="Receipt"
            width={800}
            height={600}
            className="rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
