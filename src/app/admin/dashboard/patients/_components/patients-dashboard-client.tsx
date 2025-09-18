"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Users, FileText, Pencil, Trash2 } from "lucide-react";
import { DashboardData, Patient } from "@/server/sheet-data/get-sheet-all-data";
import { EditPatientSheet } from "./edit-patient-sheet";
import Link from "next/link";
import { deletePatientData } from "@/server/patient/delete-patient";
import { toast } from "sonner";

interface PatientsDashboardProps {
  patients: DashboardData;
}

// Componente para exibir um item de métrica no card do paciente
const MetricItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div>
    <p className="text-sm font-bold">{value}</p>
    <p className="text-muted-foreground text-xs">{label}</p>
  </div>
);

export default function PatientsDashboard({
  patients: dashboardData,
}: PatientsDashboardProps) {
  const patients = dashboardData?.patients || [];

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsSheetOpen(true);
  };

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      const result = await deletePatientData(userId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto w-full">
        <h1 className="mb-8 text-3xl font-bold">Pacientes</h1>

        <div className="">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pacientes
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {Array.isArray(patients) ? patients.length : 0}
              </div>

              <p className="text-muted-foreground text-xs">
                Pacientes cadastrados
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(patients) &&
            patients.map((patient) => (
              <Card
                key={patient.userId}
                className="flex w-full flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          {patient.name}
                        </CardTitle>

                        <CardDescription className="text-xs">
                          ID: {patient.userId.split("@")[0]}
                        </CardDescription>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={isPending}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá
                            permanentemente o paciente{" "}
                            <span className="font-semibold">
                              {patient.name}
                            </span>{" "}
                            do banco de dados.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className={buttonVariants({
                              variant: "destructive",
                            })}
                            disabled={isPending}
                            onClick={() => handleDelete(patient.userId)}
                          >
                            {isPending ? "Excluindo..." : "Excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Layout de grade para as métricas */}
                  <div className="grid grid-cols-3 gap-x-2 gap-y-4 text-sm">
                    <MetricItem label="Peso (kg)" value={patient.weight} />
                    <MetricItem
                      label="Altura (m)"
                      value={(patient.height / 100).toFixed(2)}
                    />
                    <MetricItem label="Idade" value={`${patient.age} anos`} />
                    <MetricItem
                      label="Meta (Kcal)"
                      value={patient.caloriesTarget}
                    />
                    <MetricItem
                      label="Proteína (g)"
                      value={patient.proteinTarget}
                    />
                    <MetricItem
                      label="Meta Peso (kg)"
                      value={patient.weightTarget}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link
                    href={`/admin/dashboard/patients/${encodeURIComponent(patient.userId)}`}
                    className={buttonVariants({ variant: "default" })}
                  >
                    <FileText className="mr-2 size-4" /> Ver Relatório
                  </Link>

                  <Button variant="outline" onClick={() => handleEdit(patient)}>
                    <Pencil className="mr-2 size-4" /> Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      <EditPatientSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        patient={patientToEdit}
      />
    </main>
  );
}
