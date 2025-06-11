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

interface FieldConfig {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  required: boolean;
}

interface DialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Record<string, string>) => Promise<boolean>;
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
      acc[field.id] = field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional();
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
      acc[field.id] = field.value ?? "";
      return acc;
    }, {} as Record<string, string>),
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
          {description && <DialogDescription>{description}</DialogDescription>}
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
                      <Input
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        disabled={localLoading || isLoading || success}
                        {...fieldProps}
                      />
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
