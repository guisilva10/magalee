"use client";

import { BarChart, FileText, PieChart, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { AnalyticsData } from "@/server/sheet-data/get-analytics";

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  return (
    <main className="flex-1 p-6">
      <div className="mx-auto w-full">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Visão Geral</h1>

        {/* --- Grid de Resumo --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Refeições
              </CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.totalMeals.toLocaleString("pt-BR")}
              </div>
              <p className="text-muted-foreground text-xs">
                Refeições registradas no total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Média de Calorias
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.averageCalories.toLocaleString("pt-BR")} kcal
              </div>
              <p className="text-muted-foreground text-xs">
                Média por refeição registrada
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- Grid dos Gráficos --- */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Gráfico de Linha */}
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Calorias Consumidas por Dia
              </CardTitle>
              <CardDescription>
                Total de calorias de todas as refeições por dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.caloriesPerDay}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalCalories"
                    name="Total de Calorias"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Pizza */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Distribuição de Refeições
              </CardTitle>
              <CardDescription>
                Percentual de cada categoria de refeição.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.caloriesPerDay}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalCalories"
                    name="Total de Calorias"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
