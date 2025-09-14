"use client";

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
import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { AlarmData, editAlarm } from "@/server/sheet-data/update-alarm";
import { Alarm } from "@/app/_lib/google-sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { toast } from "sonner";

interface EditAlarmSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  alarm: Alarm | null;
}

export function EditAlarmSheet({
  isOpen,
  onOpenChange,
  alarm,
}: EditAlarmSheetProps) {
  const [frequencyValue, setFrequencyValue] = useState("");
  const [frequencyUnit, setFrequencyUnit] = useState<"minutos" | "horas">(
    "minutos",
  );

  const [formData, setFormData] = useState({
    date: "",
    reminderText: "",
    fixedTime: "",
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (alarm) {
      setFormData({
        date: alarm.date,
        reminderText: alarm.reminderText,
        fixedTime: alarm.fixedTime || "",
      });

      // Lógica para preencher os campos de frequência de forma amigável
      const totalMinutes = alarm.frequencyMinutes;
      if (totalMinutes && totalMinutes > 0) {
        if (totalMinutes % 60 === 0) {
          setFrequencyValue((totalMinutes / 60).toString());
          setFrequencyUnit("horas");
        } else {
          setFrequencyValue(totalMinutes.toString());
          setFrequencyUnit("minutos");
        }
      } else {
        setFrequencyValue("");
        setFrequencyUnit("minutos");
      }
    }
  }, [alarm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alarm) return;

    const valueAsNumber = parseInt(frequencyValue, 10);
    let totalMinutes: number | null = null;
    if (!isNaN(valueAsNumber) && valueAsNumber > 0) {
      totalMinutes =
        frequencyUnit === "horas" ? valueAsNumber * 60 : valueAsNumber;
    }

    startTransition(async () => {
      const result = await editAlarm(alarm.uniqueId, {
        ...formData,
        frequencyMinutes: totalMinutes,
      });

      if (result.success) {
        toast.success("Alarme atualizado com sucesso");
        onOpenChange(false);
      } else {
        toast.error(`Erro: ${result.message}`);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto px-6">
        <SheetHeader>
          <SheetTitle>Editar Alarme</SheetTitle>
          <SheetDescription>
            Faça alterações no seu lembrete. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="reminderText">Texto do Lembrete</Label>
              <Input
                id="reminderText"
                name="reminderText"
                value={formData.reminderText}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fixedTime">Horário Fixo (ex: 10:00)</Label>
              <Input
                id="fixedTime"
                name="fixedTime"
                type="time"
                value={formData.fixedTime || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Frequência (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 30"
                  value={frequencyValue}
                  onChange={(e) => setFrequencyValue(e.target.value)}
                  min="1"
                  className="w-2/3"
                />
                <Select
                  value={frequencyUnit}
                  onValueChange={(value: "minutos" | "horas") =>
                    setFrequencyUnit(value)
                  }
                >
                  <SelectTrigger className="w-1/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutos">Minutos</SelectItem>
                    <SelectItem value="horas">Horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
