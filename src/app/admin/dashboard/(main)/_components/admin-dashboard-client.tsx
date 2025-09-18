"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Badge } from "@/app/_components/ui/badge";
import { Separator } from "@/app/_components/ui/separator";
import { DashboardData, Patient } from "@/server/sheet-data/get-sheet-all-data";
import {
  Users,
  UtensilsCrossed,
  CalendarClock,
  AlertCircle,
  TrendingUp,
  Clock,
  Droplet,
} from "lucide-react";
import { StatusIndicator } from "./status-indicator";
import { getPatientStatus } from "@/app/_lib/utils";
import { useState } from "react";
import { PieChartIcon } from "@radix-ui/react-icons";
import { PatientStatusChart } from "./patient-chart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";

interface AdminDashboardClientProps {
  initialData: DashboardData;
}

export default function AdminDashboardPage({
  initialData,
}: AdminDashboardClientProps) {
  const {
    totalPatients,
    totalMealsToday,
    latestMeal,
    patients,
    recentMeals,
    totalWaterToday,
    error,
  } = initialData;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState<{
    title: string;
    patients: Patient[];
  }>({ title: "", patients: [] });

  // Função chamada ao clicar em uma fatia do gráfico
  const handleSliceClick = (status: "green" | "yellow" | "red") => {
    const statusMap = {
      green: { title: "Pacientes na Meta", status: "green" },
      yellow: { title: "Pacientes com Meta Parcial", status: "yellow" },
      red: { title: "Pacientes Fora da Meta", status: "red" },
    };

    const selected = statusMap[status];
    const filteredPatients = patients.filter(
      (p) => getPatientStatus(p) === selected.status,
    );

    setDrawerData({ title: selected.title, patients: filteredPatients });
    setIsDrawerOpen(true);
  };

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="border-destructive/20 bg-destructive/5 w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-8 text-center">
            <div className="bg-destructive/10 rounded-full p-3">
              <AlertCircle className="text-destructive h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-destructive text-lg font-semibold">
                Erro no Sistema
              </h3>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-6">
      {/* Header */}
      <div className="space-y-2 p-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral dos pacientes e registros nutricionais
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pacientes Ativos
            </CardTitle>
            <div className="bg-primary/10 rounded-full p-2">
              <Users className="text-primary h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{totalPatients}</div>
            <div className="text-muted-foreground flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>Total na plataforma</span>
            </div>
          </CardContent>
          <div className="from-primary/70 to-primary absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Registros Hoje
            </CardTitle>
            <div className="rounded-full bg-red-600/10 p-2">
              <UtensilsCrossed className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{totalMealsToday}</div>
            <div className="text-muted-foreground flex items-center space-x-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>Refeições registradas</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-400 to-red-600" />
        </Card>

        <Card className="relative overflow-hidden md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Último Registro
            </CardTitle>
            <div className="rounded-full bg-amber-500/10 p-2">
              <CalendarClock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="truncate text-lg font-semibold">
              {latestMeal?.patientName || "Nenhum registro"}
            </div>
            {latestMeal ? (
              <div className="space-y-1">
                <p className="text-muted-foreground truncate text-xs">
                  {latestMeal.Meal_description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {latestMeal.Calories} kcal
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">
                Aguardando primeiro registro
              </p>
            )}
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-600" />
        </Card>
        <Card className="relative overflow-hidden md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Água Consumida
            </CardTitle>
            <div className="rounded-full bg-blue-500/10 p-2">
              <Droplet className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="truncate text-lg font-semibold">
              {totalWaterToday || 0}ml
            </div>
            {totalWaterToday > 0 ? ( // <-- LÓGICA CORRIGIDA AQUI
              <p className="text-muted-foreground text-xs">
                Total registrado hoje
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Aguardando primeiro registro
              </p>
            )}
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
        </Card>
      </div>

      <Separator />

      {/* Tabelas de Dados */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <Users className="text-primary h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Pacientes</h3>
              <p className="text-muted-foreground text-sm">
                Lista completa com metas nutricionais
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-3">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="text-center font-semibold">
                      Meta Calorias
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Meta Proteína
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <TableRow
                        key={patient.userId}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {patient.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {patient.caloriesTarget}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {patient.proteinTarget}g
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusIndicator status={getPatientStatus(patient)} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground py-8 text-center"
                      >
                        Nenhum paciente cadastrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PieChartIcon className="text-primary h-5 w-5" />
              <h3 className="text-lg font-semibold">Resumo de Metas</h3>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-base font-medium">
                  Distribuição por Status Diário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatientStatusChart
                  patients={patients}
                  onSliceClick={handleSliceClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <UtensilsCrossed className="text-primary h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">Atividade Recente</h3>
              <p className="text-muted-foreground text-sm">
                Últimas refeições registradas
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-3">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="font-semibold">Paciente</TableHead>
                    <TableHead className="font-semibold">Refeição</TableHead>
                    <TableHead className="text-center font-semibold">
                      Kcal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMeals.length > 0 ? (
                    recentMeals.map((meal, index) => (
                      <TableRow
                        key={`${meal.patientName}-${index}`}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {meal.patientName}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate text-sm">
                            {meal.Meal_description}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            {meal.Calories}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-muted-foreground py-8 text-center"
                      >
                        Nenhuma refeição registrada ainda
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full px-6 py-4 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawerData.title}</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {drawerData.patients.length > 0 ? (
              <ul className="divide-y">
                {drawerData.patients.map((p) => (
                  <li
                    key={p.userId}
                    className="flex justify-between py-2 text-sm"
                  >
                    <span>{p.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {p.consumedCaloriesToday}kcal / {p.consumedProteinToday}g
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum paciente nesta categoria.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
