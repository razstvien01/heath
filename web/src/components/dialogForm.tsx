"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import * as z from "zod";
import { SignatureMaker } from "@docuseal/signature-maker-react";
import ImageViewer from "./imageViewer";

interface FieldConfig {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | null;
  required: boolean;
  accept?: string;
  customComponent?: React.ReactNode;
}

interface DialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    values: Record<string, string | File | undefined>
  ) => Promise<boolean>;
  isLoading?: boolean;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
  submitText?: string;
  successText?: string;
  danger?: boolean;
  fields: FieldConfig[];
}

export function DialogForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  title,
  description,
  icon,
  fields = [],
  successMessage = "Operation successful!",
  errorMessage = "An error occurred.",
  submitText = "Submit",
  successText = "Success",
  danger = false,
}: DialogFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const schema = z.object(
    fields.reduce((acc, field) => {
      if (field.type === "file") {
        acc[field.id] = z
          .any()
          .refine((val) => !field.required || val instanceof File, {
            message: `${field.label} is required`,
          });
      } else if (field.type === "signature") {
        acc[field.id] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
      } else {
        acc[field.id] = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional();
      }
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: async (values) => {
      try {
        const result = schema.safeParse(values);
        if (result.success) {
          return { values: result.data, errors: {} };
        }
        return {
          values: {},
          errors: result.error.flatten().fieldErrors,
        };
      } catch {
        return { values: {}, errors: {} };
      }
    },
    defaultValues: fields.reduce((acc, field) => {
      const isStringType = !["file", "signature"].includes(field.type || "");
      acc[field.id] = isStringType
        ? field.value ?? ""
        : field.type === "file"
        ? undefined
        : field.value ?? null;
      return acc;
    }, {} as Record<string, unknown>),
  });

  const handleFormSubmit = async (values: Record<string, string>) => {
    setError(null);
    setSuccess(false);
    setLocalLoading(true);

    try {
      const result = await onSubmit(values);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onOpenChange(false);
        }, 1500);
      }
    } catch {
      setError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      const emptyFields = Object.fromEntries(
        fields.map((field) => [field.id, field.value ?? ""])
      );
      form.reset(emptyFields);
    }
  }, [open, fields, form]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>{description || ""}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 py-2"
          >
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            {fields.map((field) => (
              <FormField
                key={field.id}
                control={form.control}
                name={field.id}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </FormLabel>

                    <FormControl>
                      {field.type === "signature" ? (
                        <div className="space-y-2">
                          {fieldProps.value && (
                            <ImageViewer
                              src={
                                typeof fieldProps.value === "string"
                                  ? `data:image/png;base64,${fieldProps.value}`
                                  : ""
                              }
                              alt="Current Signature"
                              label="View Current Signature"
                            />
                          )}
                          <SignatureMaker
                            onChange={(e) => fieldProps.onChange(e.base64)}
                            withSubmit={false}
                            withDrawn={true}
                            canvasClass="bg-white border border-base-300 rounded-2xl w-full h-30"
                          />
                          <p className="text-xs text-muted-foreground">
                            {fieldProps.value
                              ? "Signature captured"
                              : "No signature yet"}
                          </p>
                        </div>
                      ) : field.type === "file" ? (
                        <div className="space-y-2">
                          {field.value && (
                            <ImageViewer
                              src={field.value}
                              label="View Current Receipt"
                            />
                          )}

                          <Input
                            type="file"
                            accept={field.accept}
                            disabled={localLoading || isLoading || success}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              fieldProps.onChange(file);
                            }}
                          />
                        </div>
                      ) : (
                        <Input
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          disabled={localLoading || isLoading || success}
                          {...fieldProps}
                        />
                      )}
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={localLoading || isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={danger ? "destructive" : "default"}
                disabled={localLoading || isLoading || success}
              >
                {localLoading || isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Processing...
                  </span>
                ) : success ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {successText}
                  </span>
                ) : (
                  submitText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
