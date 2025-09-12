import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/app/_components/ui/sheet";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { useState, useEffect, useTransition } from "react";

import { Loader2 } from "lucide-react";
import { updatePatientData } from "@/server/sheet-data/update-patient-data";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface PatientData {
  userId: string;
  name: string;
  calories: string;
  protein: string;
}

interface SettingsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: PatientData;
}

export function SettingsSheet({
  isOpen,
  onOpenChange,
  data,
}: SettingsSheetProps) {
  const [name, setName] = useState(data.name);
  const [calories, setCalories] = useState(data.calories);
  const [protein, setProtein] = useState(data.protein);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setCalories(data.calories);
      setProtein(data.protein);
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updatePatientData(data.userId, {
        name,
        calories: Number(calories),
        protein: Number(protein),
      });

      if (result.success) {
        toast.success("Perfil atualizado com sucesso");
        onOpenChange(false);
      } else {
        toast.error("Ocorreu um erro desconhecido.");
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col px-4 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Configurações do Perfil</SheetTitle>
          <SheetDescription>
            Altere seus dados pessoais e metas. As alterações serão salvas
            diretamente na sua planilha.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              readOnly
              className="cursor-not-allowed opacity-50"
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calories">Meta de Calorias (kcal)</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Meta de Proteínas (g)</Label>
            <Input
              id="protein"
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              disabled={isPending}
            />
          </div>

          <SheetFooter className="mt-auto">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
