"use server";

import { getCategoryFromDescription } from "@/app/_lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

// --- TIPOS DE DADOS PARA ANALYTICS ---
export interface CaloriesPerDay {
  date: string; // Formato "dd/MMM"
  totalCalories: number;
}

export interface MealsByCategory {
  name: string; // Nome da categoria
  value: number; // Quantidade de refeições
}

export interface WaterPerDay {
  date: string;
  totalWater: number;
}

export interface AnalyticsData {
  totalMeals: number;
  averageCalories: number;
  totalWater: number;
  caloriesPerDay: CaloriesPerDay[];
  mealsByCategory: MealsByCategory[];
  waterPerDay: WaterPerDay[];
}

async function getAuthenticatedDoc(): Promise<GoogleSpreadsheet> {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"), // Corrige a formatação da chave
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID!,
    serviceAccountAuth,
  );
  await doc.loadInfo(); // Carrega as propriedades do documento e as planilhas
  return doc;
}

// --- FUNÇÃO PARA BUSCAR E PROCESSAR DADOS DE ANALYTICS ---
export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const doc = await getAuthenticatedDoc();
    const mealsSheet = doc.sheetsByTitle["Meals"];
    const waterSheet = doc.sheetsByTitle["Water"];
    if (!mealsSheet) throw new Error("Planilha 'Meals' não encontrada.");
    if (!waterSheet) throw new Error("Planilha 'Water' não encontrada.");

    const rows = await mealsSheet.getRows();
    const waterRows = await waterSheet.getRows(); // --- Cálculos ---

    const totalMeals = rows.length;
    const totalCaloriesSum = rows.reduce(
      (sum, row) => sum + parseFloat(row.get("Calories") || "0"),
      0,
    );
    const averageCalories =
      totalMeals > 0 ? Math.round(totalCaloriesSum / totalMeals) : 0;
    const totalWater = waterRows.reduce(
      (sum, row) => sum + parseFloat(row.get("Water_ml") || "0"),
      0,
    ); // 1. Agrupar calorias por dia

    const dailyCaloriesMap = new Map<string, number>();
    rows.forEach((row) => {
      const dateStr = row.get("Date"); // Ex: "2025-09-04"
      const calories = parseFloat(row.get("Calories") || "0");
      if (dateStr && !isNaN(calories)) {
        // Normaliza a data para evitar problemas com fuso horário
        const dateKey = format(parseISO(dateStr), "yyyy-MM-dd");
        const currentCalories = dailyCaloriesMap.get(dateKey) || 0;
        dailyCaloriesMap.set(dateKey, currentCalories + calories);
      }
    });

    const caloriesPerDay = Array.from(dailyCaloriesMap.entries())
      .map(([date, totalCalories]) => ({
        // Formata a data para exibição no gráfico
        date: format(parseISO(date), "dd/MMM", { locale: ptBR }),
        totalCalories,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // 2. Agrupar refeições por categoria

    const categoryCountMap = new Map<string, number>();
    rows.forEach((row) => {
      const description = row.get("Meal_description");
      if (description) {
        const category = getCategoryFromDescription(description);
        categoryCountMap.set(
          category,
          (categoryCountMap.get(category) || 0) + 1,
        );
      }
    });

    const mealsByCategory: MealsByCategory[] = Array.from(
      categoryCountMap.entries(),
    ).map(([name, value]) => ({ name, value }));

    // 3. Agrupar água por dia
    const dailyWaterMap = new Map<string, number>();
    waterRows.forEach((row) => {
      const dateStr = row.get("Date");
      const water = parseFloat(row.get("Water_ml") || "0");
      if (dateStr && !isNaN(water)) {
        const dateKey = format(parseISO(dateStr), "yyyy-MM-dd");
        const currentWater = dailyWaterMap.get(dateKey) || 0;
        dailyWaterMap.set(dateKey, currentWater + water);
      }
    });

    const waterPerDay = Array.from(dailyWaterMap.entries())
      .map(([date, totalWater]) => ({
        date: format(parseISO(date), "dd/MMM", { locale: ptBR }),
        totalWater,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalMeals,
      averageCalories,
      totalWater,
      caloriesPerDay,
      mealsByCategory,
      waterPerDay,
    };
  } catch (error) {
    console.error("Erro ao buscar dados para analytics:", error); // Retorna um estado vazio em caso de erro para não quebrar a página
    return {
      totalMeals: 0,
      averageCalories: 0,
      totalWater: 0,
      caloriesPerDay: [],
      mealsByCategory: [],
      waterPerDay: [],
    };
  }
}
