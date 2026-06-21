"use client";

import { useController, type Control, type FieldPath } from "react-hook-form";
import type { FormValues } from "@/lib/formSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Name = FieldPath<FormValues>;

interface FieldProps {
  control: Control<FormValues>;
  name: Name;
  label: string;
  type?: "text" | "date" | "time" | "email" | "number";
  placeholder?: string;
  required?: boolean;
  /** Transform the value on change (e.g. uppercase, digits-only). */
  transform?: (v: string) => string;
  className?: string;
  wide?: boolean;
}

export function Field({
  control,
  name,
  label,
  type = "text",
  placeholder,
  required,
  transform,
  className,
  wide,
}: FieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className={cn("space-y-1.5", wide && "sm:col-span-2 lg:col-span-3", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        value={(field.value as string) ?? ""}
        onChange={(e) => field.onChange(transform ? transform(e.target.value) : e.target.value)}
        onBlur={field.onBlur}
        aria-invalid={!!error}
      />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}

interface SelectFieldProps {
  control: Control<FormValues>;
  name: Name;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  onValueChangeSideEffect?: (value: string) => void;
  className?: string;
  wide?: boolean;
}

export function SelectField({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  required,
  onValueChangeSideEffect,
  className,
  wide,
}: SelectFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <div className={cn("space-y-1.5", wide && "sm:col-span-2 lg:col-span-3", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Select
        value={(field.value as string) ?? ""}
        onValueChange={(v) => {
          field.onChange(v);
          onValueChangeSideEffect?.(v as string);
        }}
      >
        <SelectTrigger id={name} className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
