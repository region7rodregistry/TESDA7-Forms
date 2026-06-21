"use client";

import {
  useFieldArray,
  type Control,
  type ArrayPath,
  type FieldPath,
} from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { FormValues } from "@/lib/formSchema";
import { Field } from "@/components/form/fields";
import { Button } from "@/components/ui/button";

interface Column {
  key: string;
  label: string;
  type?: "text" | "date" | "number";
}

interface Props {
  control: Control<FormValues>;
  name: ArrayPath<FormValues>;
  columns: Column[];
  /** A fresh empty row for the Add button. */
  emptyRow: Record<string, string>;
  addLabel?: string;
  minRows?: number;
}

export function FieldArrayTable({
  control,
  name,
  columns,
  emptyRow,
  addLabel = "Add row",
  minRows = 0,
}: Props) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {fields.map((row, index) => (
          <div
            key={row.id}
            className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {columns.map((c) => (
              <Field
                key={c.key}
                control={control}
                name={`${name}.${index}.${c.key}` as FieldPath<FormValues>}
                label={c.label}
                type={c.type ?? "text"}
              />
            ))}
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={fields.length <= minRows}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(emptyRow as never)}
      >
        <Plus className="size-4" /> {addLabel}
      </Button>
    </div>
  );
}
