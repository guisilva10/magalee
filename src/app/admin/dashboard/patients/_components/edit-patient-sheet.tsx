"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/app/_components/ui/sheet";
import { Patient } from "@/server/sheet-data/get-sheet-all-data";
import { updatePatientData } from "@/server/patient/update-patient";
import { toast } from "sonner";

interface EditPatientSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  patient: Patient | null;
}

export function EditPatientSheet({
  isOpen,
  onOpenChange,
  patient,
}: EditPatientSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    calories: 0,
    protein: 0,
  });

  useEffect(() => {
    if (patient) {
      setEditFormData({
        name: patient.name,
        calories: patient.calories,
        protein: patient.protein,
      });
      setFeedback(null);
    }
  }, [patient]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }));
  };

  const handleSaveChanges = () => {
    if (!patient) return;
    setFeedback(null);

    startTransition(async () => {
      const result = await updatePatientData(patient.userId, editFormData);
      if (result.success) {
        toast.success(`${result.message}`);
        setTimeout(() => onOpenChange(false), 1500);
      } else {
        toast.error(`${result.error}`);
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="px-6 py-4">
        {patient && (
          <>
            <SheetHeader>
              <SheetTitle>Editar Paciente</SheetTitle>
              <SheetDescription>
                Altere as informações de {patient.name} aqui. Clique em salvar
                quando terminar.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="calories">Calorias (kcal)</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  value={editFormData.calories}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="protein">Proteína (g)</Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  value={editFormData.protein}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={patient.userId.split("@")[0]}
                  disabled
                  className="col-span-3"
                />
              </div>
            </div>
            <SheetFooter className="flex-col">
              <Button onClick={handleSaveChanges} disabled={isPending}>
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
              {feedback && (
                <p
                  className={`mt-2 text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {feedback.message}
                </p>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
