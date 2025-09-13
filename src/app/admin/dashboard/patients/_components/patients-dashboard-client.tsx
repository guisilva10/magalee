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
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { Users, FileText, Pencil } from "lucide-react";
import { DashboardData, Patient } from "@/server/sheet-data/get-sheet-all-data";
import { PatientReportDialog } from "./patient-dialog";
import { EditPatientSheet } from "./edit-patient-sheet";
import Link from "next/link";

interface PatientsDashboardProps {
  patients: DashboardData;
}

export default function PatientsDashboard({
  patients: dashboardData,
}: PatientsDashboardProps) {
  const patients = dashboardData?.patients || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const handleViewReport = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDialogOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsSheetOpen(true);
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
                        ID: {patient.userId.split("@")[0]}
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
                    <div>
                      <p className="text-primary text-sm font-bold">
                        {patient.avgWaterMl}ml
                      </p>
                      <p className="text-muted-foreground">Hidratação</p>
                    </div>
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

      <PatientReportDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        patient={selectedPatient}
      />

      <EditPatientSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        patient={patientToEdit}
      />
    </main>
  );
}
