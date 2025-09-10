"use client";

import { Button } from "@/app/_components/ui/button";
import { Patient } from "@/server/sheet-data/get-sheet-all-data";
import { FaWhatsapp } from "react-icons/fa6";

interface ThirtyDayData {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface SendMonthlyReportProps {
  patient: Patient;
  // Recebe os dados agregados dos últimos 30 dias (do gráfico)
  last30DaysData: ThirtyDayData[];
  dietStatus: {
    text: string;
  };
}

export function SendMonthlyReport({
  patient,
  last30DaysData,
  dietStatus,
}: SendMonthlyReportProps) {
  const handleSendReport = () => {
    const phoneNumber = patient.userId.split("@")[0];
    if (!phoneNumber) {
      alert("ID do paciente não contém um número de telefone válido.");
      return;
    }

    // 1. Calcular as médias dos últimos 30 dias
    const totalDaysWithMeals = last30DaysData.filter(
      (day) => day.protein > 0 || day.carbs > 0,
    ).length;

    if (totalDaysWithMeals === 0) {
      alert(
        "Não há dados de refeições nos últimos 30 dias para gerar o relatório.",
      );
      return;
    }

    const totalProtein = last30DaysData.reduce(
      (sum, day) => sum + day.protein,
      0,
    );
    const totalCarbs = last30DaysData.reduce((sum, day) => sum + day.carbs, 0);
    const totalFat = last30DaysData.reduce((sum, day) => sum + day.fat, 0);

    // Calcula as calorias totais a partir dos macros (1g P/C = 4 kcal, 1g F = 9 kcal)
    const totalCalories = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

    const avgCalories = totalCalories / totalDaysWithMeals;
    const avgProtein = totalProtein / totalDaysWithMeals;
    const avgCarbs = totalCarbs / totalDaysWithMeals;
    const avgFat = totalFat / totalDaysWithMeals;

    // 2. Montar a mensagem do relatório mensal
    const message = [
      `Olá, *${patient.name}*! 📈`,
      ``,
      `Aqui está o seu *relatório de performance dos últimos 30 dias*:`,
      ``,
      `📊 *Status Geral:* ${dietStatus.text}`,
      ``,
      `*Sua média diária de consumo foi:*`,
      `🔥 *Calorias:* ${avgCalories.toFixed(0)} kcal`,
      `🍗 *Proteínas:* ${avgProtein.toFixed(1)}g`,
      `🍞 *Carboidratos:* ${avgCarbs.toFixed(1)}g`,
      `🥑 *Gorduras:* ${avgFat.toFixed(1)}g`,
      ``,
      `Estou acompanhando seu progresso. Vamos continuar com o ótimo trabalho! ✨`,
    ].join("%0A");

    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <Button onClick={handleSendReport}>
      <FaWhatsapp />
      Enviar Relatório Mensal
    </Button>
  );
}
