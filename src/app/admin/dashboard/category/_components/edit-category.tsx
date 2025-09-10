"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { renameCategory } from "@/server/sheet-data/get-category";

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  categoryName: string | null;
}

export function EditCategoryDialog({
  isOpen,
  onOpenChange,
  categoryName,
}: EditCategoryDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryName) {
      setNewName(categoryName);
      setError(null);
    }
  }, [categoryName]);

  const handleSave = () => {
    if (!categoryName) return;

    startTransition(async () => {
      const result = await renameCategory(categoryName, newName);
      if (result.success) {
        onOpenChange(false);
      } else {
        setError(result.error || "Ocorreu um erro desconhecido.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Alterar o nome desta categoria irá adicionar o novo nome como um
            prefixo na descrição de todas as refeições associadas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Novo Nome
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
            />
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
