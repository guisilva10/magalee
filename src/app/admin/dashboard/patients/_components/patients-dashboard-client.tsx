"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { User, Users, FileText, Pencil, Target, Flame } from "lucide-react";
import { DashboardData, Patient } from "@/server/sheet-data/get-sheet-all-data";

interface PatientsDashboardProps {
  patients: DashboardData;
}

export default function PatientsDashboard({
  patients: dashboardData,
}: PatientsDashboardProps) {
  const patients = dashboardData?.patients || [];

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewReport = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto w-full">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Pacientes</h1>

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
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription className="text-xs">
                        ID: {patient.userId}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-sm font-bold">
                        {patient.calories.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-muted-foreground">Kcal</p>
                    </div>
                    <div>
                      <p className="text-primary text-sm font-bold">
                        {patient.protein}g
                      </p>
                      <p className="text-muted-foreground">Proteína</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button onClick={() => handleViewReport(patient)}>
                    <FileText className="size-4" /> Ver Relatório
                  </Button>
                  <Button variant="outline">
                    <Pencil className="size-4" /> Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Relatório de {selectedPatient.name}
                </DialogTitle>
                <DialogDescription>
                  Detalhes e metas nutricionais do paciente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-gray-500" />
                  <p>
                    <span className="font-semibold">Nome:</span>{" "}
                    {selectedPatient.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Flame className="h-5 w-5 text-gray-500" />
                  <p>
                    <span className="font-semibold">Meta de Calorias:</span>{" "}
                    {selectedPatient.calories.toLocaleString("pt-BR")} kcal
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Target className="h-5 w-5 text-gray-500" />
                  <p>
                    <span className="font-semibold">Meta de Proteína:</span>{" "}
                    {selectedPatient.protein}g
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <p className="break-all">
                    <span className="font-semibold">User ID:</span>{" "}
                    {selectedPatient.userId.split("@")[0]}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
