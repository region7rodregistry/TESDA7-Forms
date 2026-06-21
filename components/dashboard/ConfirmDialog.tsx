"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: "complete" | "delete";
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  variant,
  title,
  description,
  confirmLabel,
  onConfirm,
  loading,
}: Props) {
  const isDelete = variant === "delete";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center sm:text-center">
          <motion.div
            initial={{ scale: 0, rotate: isDelete ? -10 : 0 }}
            animate={
              isDelete
                ? { scale: 1, rotate: [0, -8, 8, -6, 6, 0] }
                : { scale: [0, 1.15, 1] }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`mx-auto mb-2 flex size-16 items-center justify-center rounded-full ${
              isDelete ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isDelete ? (
              <AlertTriangle className="size-8" />
            ) : (
              <CheckCircle2 className="size-8" />
            )}
          </motion.div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={isDelete ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmLabel ?? (isDelete ? "Delete" : "Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
