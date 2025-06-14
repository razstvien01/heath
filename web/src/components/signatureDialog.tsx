"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SetStateAction } from "react";
import { Signature } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignatureMaker } from "@docuseal/signature-maker-react";

export function SignatureDialog({
  onChange,
  value,
}: {
  onChange?: (e: { base64: SetStateAction<null> }) => void;
  value?: string | null;
}) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className={value ? "bg-green-500" : "bg-red-500"}>
                <Signature />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="bg-slate-900 text-slate-50 p-2">
              {value ? "Has Signature" : "No Signature"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Signature</DialogTitle>
        </DialogHeader>
        <SignatureMaker
          onChange={onChange}
          withSubmit={false}
          withDrawn={true}
          canvasClass="bg-white border border-base-300 rounded-2xl w-full h-30"
        />
      </DialogContent>
    </Dialog>
  );
}
