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

interface DeleteCategoryAlertProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categoryName: string | null;
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
            Esta ação é irreversível. Todas as{" "}
            <span className="font-bold text-red-600">
              refeições registradas
            </span>{" "}
            na categoria "{categoryName}" serão permanentemente excluídas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Excluindo..." : "Sim, excluir tudo"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
