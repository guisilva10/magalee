"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Separator } from "@/app/_components/ui/separator";
import { Loader2 } from "lucide-react";
import {
  getPatientStats,
  Patient,
} from "@/server/sheet-data/get-sheet-all-data";

interface PatientStats {
  totalMeals: number;
  totalCalories: number;
  avgCaloriesPerMeal: number;
  recentMeals: {
    description: string;
    calories: number;
    date: string;
  }[];
}

interface PatientReportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  patient: Patient | null;
}

export function PatientReportDialog({
  isOpen,
  onOpenChange,
  patient,
}: PatientReportDialogProps) {
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [stats, setStats] = useState<PatientStats | null>(null);

  useEffect(() => {
    if (isOpen && patient) {
      const fetchStats = async () => {
        setIsLoadingStats(true);
        setStats(null);
        const result = await getPatientStats(patient.userId);
        if (result.success && result.stats) {
          setStats(result.stats);
        } else {
          console.error(result.error);
        }
        setIsLoadingStats(false);
      };
      fetchStats();
    }
  }, [isOpen, patient]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Relatório de {patient?.name}
          </DialogTitle>
          <DialogDescription>
            Estatísticas de refeições registradas pelo paciente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingStats ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="ml-4 text-gray-600">Buscando estatísticas...</p>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Refeições
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stats.totalMeals}</p>
                    <p className="text-muted-foreground text-xs">
                      Total Registrado
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      Média Calórica
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {stats.avgCaloriesPerMeal.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Kcal por Refeição
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Últimas Refeições
                </h3>
                {stats.recentMeals.length > 0 ? (
                  <ul className="space-y-3">
                    {stats.recentMeals.map((meal, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {meal.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(meal.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-primary font-semibold">
                          {meal.calories.toLocaleString("pt-BR")} kcal
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Nenhuma refeição registrada.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              Não foi possível carregar as estatísticas.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
