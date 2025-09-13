"use client";

import {
  BarChart as BarChartIcon,
  FileText,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { AnalyticsData } from "@/server/sheet-data/get-analytics";

// Definindo cores para as fatias do gráfico de pizza e barras
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

// Helper para renderizar um rótulo personalizado com porcentagem no gráfico de Pizza
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  return (
    <main className="flex-1 p-6">
      <div className="mx-auto w-full">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">Visão Geral</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-lg border bg-white text-gray-800 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium tracking-tight">
                Total de Refeições
              </h3>
              <FileText className="h-4 w-4 text-gray-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {data.totalMeals.toLocaleString("pt-BR")}
              </div>
              <p className="text-xs text-gray-500">
                Refeições registradas no total
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-white text-gray-800 shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="text-sm font-medium tracking-tight">
                Média de Calorias
              </h3>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">
                {data.averageCalories.toLocaleString("pt-BR")} kcal
              </div>
              <p className="text-xs text-gray-500">
                Média por refeição registrada
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="col-span-1 rounded-lg border bg-white text-gray-800 shadow-sm lg:col-span-2">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5" />
                Calorias Consumidas por Dia
              </h3>
              <p className="text-sm text-gray-500">
                Total de calorias de todas as refeições por dia.
              </p>
            </div>
            <div className="p-6 pt-0">
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
            </div>
          </div>
          <div className="col-span-1 rounded-lg border bg-white text-gray-800 shadow-sm">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <PieChartIcon className="h-5 w-5" />
                Distribuição de Refeições
              </h3>

              <p className="text-sm text-gray-500">
                Percentual de cada categoria de refeição.
              </p>
            </div>
            <div className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  {" "}
                  <Pie
                    data={data.mealsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="category"
                  >
                    {data.mealsByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-1 rounded-lg border bg-white text-gray-800 shadow-sm">
            <div className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <BarChartIcon className="h-5 w-5" />
                Contagem por Categoria
              </h3>

              <p className="text-sm text-gray-500">
                Total de refeições registradas para cada categoria.
              </p>
            </div>

            <div className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.mealsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Total de Refeições" fill="#8884d8">
                    {data.mealsByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
