"use client";

import { useState, useMemo } from "react";
import { Patient, Meal } from "@/server/sheet-data/get-sheet-all-data"; // Ajuste o caminho
import { format, isSameDay, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
// --- 1. IMPORTANDO COMPONENTES DE TABELA ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";

interface PatientDetailClientProps {
  patient: Patient;
  allMeals: Meal[];
  dietStatus: {
    text: string;
    variant: "success" | "warning" | "destructive" | "default";
  };
}

const parseDateAsLocal = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export function PatientDetailClient({
  patient,
  allMeals,
  dietStatus,
}: PatientDetailClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const dailyMeals = useMemo(() => {
    return allMeals.filter((meal) =>
      isSameDay(parseDateAsLocal(meal.Date), selectedDate),
    );
  }, [allMeals, selectedDate]);

  const dailyTotals = useMemo(() => {
    return dailyMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.Calories;
        acc.carbs += meal.carbohydrates;
        acc.protein += meal.protein;
        acc.fat += meal.fat;
        return acc;
      },
      { calories: 0, carbs: 0, protein: 0, fat: 0 },
    );
  }, [dailyMeals]);

  const chartData = useMemo(() => {
    const last30Days = new Map<
      string,
      { protein: number; carbs: number; fat: number }
    >();
    const today = startOfDay(new Date());

    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dateString = format(date, "dd/MM");
      last30Days.set(dateString, { protein: 0, carbs: 0, fat: 0 });
    }

    allMeals.forEach((meal) => {
      const mealDate = startOfDay(parseDateAsLocal(meal.Date));

      if (mealDate >= subDays(today, 29)) {
        const dateString = format(mealDate, "dd/MM");
        const dayData = last30Days.get(dateString);
        if (dayData) {
          dayData.protein += meal.protein;
          dayData.carbs += meal.carbohydrates;
          dayData.fat += meal.fat;
        }
      }
    });

    return Array.from(last30Days.entries())
      .map(([name, data]) => ({ name, ...data }))
      .reverse();
  }, [allMeals]);

  return (
    <main className="flex-1 p-6">
      <div>
        <h1 className="relative mb-2 text-3xl font-bold text-gray-800">
          Relatório de {patient.name}
          <Badge className="absolute top-0 ml-2" variant={dietStatus.variant}>
            {dietStatus.text}
          </Badge>
        </h1>
        <p className="mb-8 text-gray-500">
          Análise detalhada de consumo e macronutrientes.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Consumo do Dia</CardTitle>
              <CardDescription>
                Refeições registradas na data selecionada.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDate(subDays(selectedDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSelectedDate(
                    new Date(selectedDate.setDate(selectedDate.getDate() + 1)),
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dailyMeals.length > 0 ? (
            <div>
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium">
                      Calorias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-2xl font-bold">
                      {Math.round(dailyTotals.calories)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium">
                      Carboidratos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-2xl font-bold">
                      {Math.round(dailyTotals.carbs)}g
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium">
                      Proteínas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-2xl font-bold">
                      {Math.round(dailyTotals.protein)}g
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-sm font-medium">
                      Gorduras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-2xl font-bold">
                      {Math.round(dailyTotals.fat)}g
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* --- 2. SUBSTITUINDO A LISTA PELA TABELA --- */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[45%]">Refeição</TableHead>
                    <TableHead className="text-right">Calorias</TableHead>
                    <TableHead className="text-right">Carbs (g)</TableHead>
                    <TableHead className="text-right">Proteínas (g)</TableHead>
                    <TableHead className="text-right">Gorduras (g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyMeals.map((meal, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {meal.Meal_description}
                      </TableCell>
                      <TableCell className="text-primary text-right font-semibold">
                        {meal.Calories.toFixed(0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {meal.carbohydrates.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {meal.protein.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {meal.fat.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              Nenhuma refeição encontrada para esta data.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumo de Macronutrientes (Últimos 30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="carbs" name="Carboidratos (g)" fill="#8884d8" />
                <Bar dataKey="protein" name="Proteínas (g)" fill="#82ca9d" />
                <Bar dataKey="fat" name="Gorduras (g)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
