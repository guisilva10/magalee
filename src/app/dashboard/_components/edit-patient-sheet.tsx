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
import { updatePatientData } from "@/server/patient/update-patient-data";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

interface PatientData {
  userId: string;
  name: string;
  caloriesTarget: string;
  proteinTarget: string;
  height: number;
  weightTarget: number;
  age: number;
  imgTarget: number;
  carbsTarget: string;
  fatTarget: string;
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
  const [height, setHeight] = useState(data.height);
  const [weightTarget, setWeightTarget] = useState(data.weightTarget);
  const [age, setAge] = useState(data.age);

  const [calories, setCalories] = useState(data.caloriesTarget);
  const [protein, setProtein] = useState(data.proteinTarget);
  const [carbs, setCarbs] = useState(data.carbsTarget);
  const [fat, setFat] = useState(data.fatTarget);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setHeight(data.height);
      setWeightTarget(data.weightTarget);
      setAge(data.age);
      setCalories(data.caloriesTarget);
      setProtein(data.proteinTarget);
      setCarbs(data.carbsTarget);
      setFat(data.fatTarget);
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await updatePatientData(data.userId, {
        name,
        height: Number(height),
        weightTarget: Number(weightTarget),
        age: Number(age),
        calories: Number(calories),
        protein: Number(protein),
        carbsTarget: carbs,
        fatTarget: fat,
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
      <SheetContent className="flex w-full flex-col px-4 sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Configurações do Perfil</SheetTitle>
          <SheetDescription>
            Altere seus dados pessoais e metas. As alterações serão salvas
            diretamente na sua planilha.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col justify-between pt-4"
        >
          <div className="space-y-6 overflow-y-auto pr-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Suas informações de perfil e medidas corporais.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weightTarget">Peso Alvo (kg)</Label>
                  <Input
                    id="weightTarget"
                    type="number"
                    value={weightTarget}
                    onChange={(e) => setWeightTarget(Number(e.target.value))}
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas Nutricionais</CardTitle>
                <CardDescription>
                  Seus objetivos diários de calorias e macronutrientes.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <div className="space-y-2">
                  <Label htmlFor="carbs">Meta de Carboidratos (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Meta de Gorduras (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <SheetFooter className="pt-6">
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
