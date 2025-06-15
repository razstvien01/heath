import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ImageViewerButton({
  src,
  alt = "Image",
}: {
  src: string;
  alt?: string;
}) {
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
          <DialogTitle>{alt}</DialogTitle>
          <div
            className={`rounded-lg ${
              alt.toLowerCase().includes("signature") ? "bg-white" : ""
            }`}
          >
            <Image
              src={src}
              alt={alt}
              width={800}
              height={600}
              className="rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
