"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Patient } from "@/server/sheet-data/get-sheet-all-data";
import { getPatientStatus } from "@/app/_lib/utils";

interface PatientStatusChartProps {
  patients: Patient[];
  onSliceClick: (status: "green" | "yellow" | "red") => void;
}

// Cores para cada fatia do gráfico
const COLORS = {
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
};

// Nomes para a legenda do gráfico
const STATUS_NAMES = {
  green: "Na Meta",
  yellow: "Parcial",
  red: "Fora da Meta",
};

/**
 * Renderiza um gráfico de pizza interativo mostrando a distribuição
 * dos pacientes com base em seu status nutricional diário.
 */
export function PatientStatusChart({
  patients,
  onSliceClick,
}: PatientStatusChartProps) {
  // Conta quantos pacientes estão em cada categoria de status
  const statusCounts = patients.reduce(
    (acc, patient) => {
      const status = getPatientStatus(patient);
      acc[status]++;
      return acc;
    },
    { green: 0, yellow: 0, red: 0 },
  );

  // Formata os dados para o Recharts, removendo categorias sem pacientes
  const data = Object.entries(statusCounts)
    .map(([status, count]) => ({
      name: STATUS_NAMES[status as keyof typeof STATUS_NAMES],
      value: count,
      status: status as keyof typeof STATUS_NAMES,
    }))
    .filter((item) => item.value > 0);

  if (patients.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[250px] items-center justify-center text-center text-sm">
        Não há dados de pacientes para exibir o resumo de metas.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend iconSize={10} verticalAlign="bottom" height={36} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onClick={(e) => onSliceClick(e.payload.payload.status)}
          style={{ cursor: "pointer" }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
