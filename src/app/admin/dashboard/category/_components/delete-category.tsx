"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { Button, buttonVariants } from "@/app/_components/ui/button";

interface DeleteCategoryAlertProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categoryName?: string | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteCategoryAlert({
  isOpen,
  onOpenChange,
  categoryName,
  onConfirm,
  isPending,
}: DeleteCategoryAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente a
            categoria{" "}
            <span className="text-destructive font-semibold">
              "{categoryName}"
            </span>
            . Todas as refeições associadas a ela perderão essa categorização.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : "Sim, excluir categoria"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
