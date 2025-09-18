"use client";

import { useEffect, useTransition } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/app/_components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Patient } from "@/server/sheet-data/get-sheet-all-data";
import { updatePatientData } from "../../../../../server/patient/update-patient";
import { toast } from "sonner";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/app/_components/ui/card";

interface EditPatientSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  patient: Patient | null;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  weight: z
    .number("Deve ser um número.")
    .positive({ message: "O peso deve ser positivo." }),
  height: z
    .number("Deve ser um número.")
    .positive({ message: "A altura deve ser positiva." }),
  age: z
    .number("Deve ser um número.")
    .positive({ message: "A idade deve ser positiva." }),
  caloriesTarget: z.string().min(1, { message: "Campo obrigatório." }),
  proteinTarget: z.string().min(1, { message: "Campo obrigatório." }),
  carbsTarget: z.string().min(1, { message: "Campo obrigatório." }),
  fatTarget: z.string().min(1, { message: "Campo obrigatório." }),
  weightTarget: z
    .number("Deve ser um número.")
    .positive({ message: "A meta de peso deve ser positiva." }),
});

type FormSchema = z.infer<typeof formSchema>;

export function EditPatientSheet({
  isOpen,
  onOpenChange,
  patient,
}: EditPatientSheetProps) {
  const [isPending, startTransition] = useTransition(); // 2. Configuração do formulário com react-hook-form e Zod

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      caloriesTarget: "",
      proteinTarget: "",
      carbsTarget: "",
      fatTarget: "",
      height: 0,
      weight: 0,
      age: 0,
      weightTarget: 0,
    },
  });

  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name || "",
        weight: patient.weight || 0,
        height: patient.height || 0,
        age: patient.age || 0,
        caloriesTarget: patient.caloriesTarget || "",
        proteinTarget: patient.proteinTarget || "",
        carbsTarget: patient.carbsTarget || "",
        fatTarget: patient.fatTarget || "",
        weightTarget: patient.weightTarget || 0,
      });
    }
  }, [patient, form]); // 4. Função de submissão do formulário

  function onSubmit(values: FormSchema) {
    if (!patient) return;

    startTransition(async () => {
      const result = await updatePatientData(patient.userId, values);
      if (result.success) {
        toast.success(result.message || "Paciente atualizado com sucesso!");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Falha ao atualizar o paciente.");
      }
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto lg:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar Perfil</SheetTitle>
          <SheetDescription>
            Altere as informações de {patient?.name || "paciente"}{" "}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col px-6 py-4"
          >
            <div className="space-y-4 py-4">
              <Card className="px-4">
                <h3 className="text-muted-foreground mb-4 text-sm font-medium">
                  Dados Pessoais
                </h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Repetir para os outros campos */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Idade</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
              <Card className="px-4">
                <h3 className="text-muted-foreground mb-4 pt-4 text-sm font-medium">
                  Metas Nutricionais
                </h3>
                <FormField
                  control={form.control}
                  name="caloriesTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calorias (kcal)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proteinTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proteínas (g)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carbsTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carboidratos (g)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fatTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gorduras (g)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta de Peso (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            // Garante que o valor passado para o form state é um número
                            field.onChange(e.target.valueAsNumber || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>
            </div>
            <SheetFooter className="px-6 pb-4">
              <SheetClose asChild>
                <Button size="sm" variant="outline">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
