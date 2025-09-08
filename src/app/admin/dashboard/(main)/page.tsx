// /app/admin/dashboard/page.tsx

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
import { getDashboardData } from "@/server/sheet-data/get-sheet-all-data";
import {
  Users,
  UtensilsCrossed,
  CalendarClock,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const {
    totalPatients,
    totalMealsToday,
    latestMeal,
    patients,
    recentMeals,
    error,
  } = await getDashboardData();

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="rounded-full bg-indigo-600/10 p-2">
              <UtensilsCrossed className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{totalMealsToday}</div>
            <div className="text-muted-foreground flex items-center space-x-1 text-xs">
              <Clock className="h-3 w-3" />
              <span>Refeições registradas</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
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
                      Calorias
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Proteína
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
                            {patient.calories}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {patient.protein}g
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
                        Nenhum paciente cadastrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
    </div>
  );
}
