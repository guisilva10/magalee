"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { toDate } from "date-fns-tz";

// --- TIPOS DE DADOS (Interfaces) ---
export interface Meal {
  userId?: string;
  patientName: string;
  Meal_description: string;
  Calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  Date: string;
}

export interface Patient {
  userId: string;
  name: string;
  calories: number;
  protein: number;
}

export interface DashboardData {
  totalPatients: number;
  totalMealsToday: number;
  latestMeal: Meal | null;
  patients: Patient[];
  recentMeals: Meal[];
  error: string | null;
}

// --- FUNÇÃO DE AUTENTICAÇÃO E CONEXÃO ---
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

// --- FUNÇÃO PRINCIPAL QUE BUSCA OS DADOS ---
export async function getDashboardData(): Promise<DashboardData> {
  try {
    const doc = await getAuthenticatedDoc();

    // CORREÇÃO 1: Usar o nome correto da aba da planilha ("Profile")
    const patientsSheet = doc.sheetsByTitle["Profile"];
    const mealsSheet = doc.sheetsByTitle["Meals"];

    if (!patientsSheet || !mealsSheet) {
      throw new Error(
        "Uma ou mais planilhas (Profile, Meals) não foram encontradas.",
      );
    }

    const [patientRows, mealRows] = await Promise.all([
      patientsSheet.getRows(),
      mealsSheet.getRows(),
    ]);

    const allPatients: Patient[] = patientRows.map((row) => ({
      userId: row.get("User_ID"),
      name: row.get("Name"),
      calories: parseFloat(row.get("Calories_target")),
      protein: parseFloat(row.get("Protein_target")),
    }));

    const totalPatients = allPatients.length;
    const patientIdToNameMap = new Map(
      allPatients.map((p) => [p.userId, p.name]),
    );
    // --- 2. Processar dados das Refeições (esta parte já estava correta) ---
    const allMeals: Meal[] = mealRows.map((row) => {
      // Supondo que sua planilha "Meals" tenha uma coluna "User_ID"
      const patientId = row.get("User_ID");
      // Busca o nome do paciente no mapa. Se não encontrar, usa um valor padrão.
      const patientName =
        patientIdToNameMap.get(patientId) || "Paciente Desconhecido";

      return {
        userId: patientId,
        patientName: patientName,
        Meal_description: row.get("Meal_description"),
        Calories: parseFloat(row.get("Calories")),
        carbohydrates: parseFloat(row.get("Carbs")) || 0,
        protein: parseFloat(row.get("Protein")) || 0,
        fat: parseFloat(row.get("Fats")) || 0,
        // --- FIM DA ADIÇÃO ---
        Date: row.get("Date"),
      };
    });
    const timeZone = "America/Sao_Paulo";
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const todaysMeals = allMeals.filter((meal) => {
      const mealDate = toDate(meal.Date, { timeZone });
      return mealDate >= startOfToday && mealDate <= endOfToday;
    });
    const totalMealsToday = todaysMeals.length;

    const sortedMeals = [...allMeals].sort(
      (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime(),
    );

    const latestMeal = sortedMeals.length > 0 ? sortedMeals[0] : null;
    const recentMeals = sortedMeals.slice(0, 5);

    return {
      totalPatients,
      totalMealsToday,
      latestMeal,
      patients: allPatients,
      recentMeals,
      error: null,
    };
  } catch (err: any) {
    console.error("Erro ao buscar dados do Google Sheets:", err);
    return {
      totalPatients: 0,
      totalMealsToday: 0,
      latestMeal: null,
      patients: [],
      recentMeals: [],
      error:
        "Falha ao carregar dados da planilha. Verifique a configuração e o console do servidor.",
    };
  }
}

export async function getPatientStats(userId: string) {
  try {
    const doc = await getAuthenticatedDoc();
    const mealsSheet = doc.sheetsByTitle["Meals"];

    if (!mealsSheet) {
      throw new Error("Planilha 'Meals' não foi encontrada.");
    }

    const rows = await mealsSheet.getRows();

    // 1. Filtra todas as refeições para pegar apenas as do paciente selecionado
    const patientMealRows = rows.filter((row) => row.get("User_ID") === userId);

    if (patientMealRows.length === 0) {
      return {
        success: true,
        stats: {
          totalMeals: 0,
          totalCalories: 0,
          avgCaloriesPerMeal: 0,
          recentMeals: [],
        },
      };
    }

    // 2. Mapeia as linhas para objetos estruturados e ordena por data
    const patientMeals = patientMealRows
      .map((row) => ({
        description: row.get("Meal_description") as string,
        calories: parseFloat(row.get("Calories")),
        date: new Date(row.get("Date")),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // 3. Calcula as estatísticas
    const totalMeals = patientMeals.length;
    const totalCalories = patientMeals.reduce(
      (sum, meal) => sum + meal.calories,
      0,
    );
    const avgCaloriesPerMeal = totalMeals > 0 ? totalCalories / totalMeals : 0;
    const recentMeals = patientMeals.slice(0, 5); // Pega as 5 mais recentes

    return {
      success: true,
      stats: {
        totalMeals,
        totalCalories,
        avgCaloriesPerMeal: Math.round(avgCaloriesPerMeal),
        recentMeals: recentMeals.map((meal) => ({
          ...meal,
          date: meal.date.toISOString(), // Serializa a data para o cliente
        })),
      },
    };
  } catch (error) {
    console.error("Erro ao buscar estatísticas do paciente:", error);
    return {
      success: false,
      error: "Não foi possível carregar as estatísticas do paciente.",
    };
  }
}

function calculateDietStatus(
  allMeals: Meal[],
  patientTargets: Patient,
): {
  text: string;
  variant: "success" | "warning" | "destructive" | "default";
} {
  const today = startOfDay(new Date());
  const thirtyDaysAgo = subDays(today, 29);

  // 1. Filtra refeições dos últimos 30 dias e agrupa por dia
  const dailyConsumptions = new Map<
    string,
    { calories: number; protein: number }
  >();
  allMeals.forEach((meal) => {
    const mealDate = startOfDay(new Date(meal.Date));
    if (mealDate >= thirtyDaysAgo) {
      const dateString = mealDate.toISOString().split("T")[0];
      if (!dailyConsumptions.has(dateString)) {
        dailyConsumptions.set(dateString, { calories: 0, protein: 0 });
      }
      const day = dailyConsumptions.get(dateString)!;
      day.calories += meal.Calories;
      day.protein += meal.protein;
    }
  });

  // 2. Verifica se há dados suficientes
  if (dailyConsumptions.size < 5) {
    // Exige pelo menos 5 dias de registros nos últimos 30
    return { text: "Dados Insuficientes", variant: "default" };
  }

  // 3. Calcula a média diária de consumo
  let totalAvgCalories = 0;
  let totalAvgProtein = 0;
  dailyConsumptions.forEach((day) => {
    totalAvgCalories += day.calories;
    totalAvgProtein += day.protein;
  });
  const avgCalories = totalAvgCalories / dailyConsumptions.size;
  const avgProtein = totalAvgProtein / dailyConsumptions.size;

  // 4. Compara a média com as metas (com uma margem de 15%)
  const calRatio = avgCalories / patientTargets.calories;
  const protRatio = avgProtein / patientTargets.protein;

  if (calRatio > 1.15 || protRatio > 1.2) {
    return { text: "Consumo Acima da Meta", variant: "destructive" };
  }
  if (calRatio < 0.85 || protRatio < 0.8) {
    return { text: "Consumo Abaixo da Meta", variant: "warning" };
  }

  return { text: "Alimentação Adequada", variant: "success" };
}

export async function getPatientDetails(userId: string): Promise<{
  patient: Patient | null;
  allMeals: Meal[];
  dietStatus: {
    text: string;
    variant: "success" | "warning" | "destructive" | "default";
  };
}> {
  const defaultStatus = { text: "Sem dados", variant: "default" as const };
  try {
    const doc = await getAuthenticatedDoc();
    const patientsSheet = doc.sheetsByTitle["Profile"];
    const mealsSheet = doc.sheetsByTitle["Meals"];

    if (!patientsSheet || !mealsSheet) {
      throw new Error("Planilhas não encontradas.");
    }

    const [patientRows, mealRows] = await Promise.all([
      patientsSheet.getRows(),
      mealsSheet.getRows(),
    ]);

    // Encontra o perfil do paciente
    const patientRow = patientRows.find((row) => row.get("User_ID") === userId);
    if (!patientRow) {
      return { patient: null, allMeals: [], dietStatus: defaultStatus };
    }
    const patient: Patient = {
      userId: patientRow.get("User_ID"),
      name: patientRow.get("Name"),
      calories: parseFloat(patientRow.get("Calories_target")),
      protein: parseFloat(patientRow.get("Protein_target")),
    };

    // Filtra e mapeia todas as refeições do paciente
    const allMeals: Meal[] = mealRows
      .filter((row) => row.get("User_ID") === userId)
      .map((row) => ({
        userId: row.get("User_ID"),
        patientName: patient.name,
        Meal_description: row.get("Meal_description"),
        Calories: parseFloat(row.get("Calories")),
        carbohydrates: parseFloat(row.get("Carbs")),
        protein: parseFloat(row.get("Proteins")),
        fat: parseFloat(row.get("Fats")),
        Date: row.get("Date"),
      }));

    const dietStatus = calculateDietStatus(allMeals, patient);

    return { patient, allMeals, dietStatus };
  } catch (error) {
    console.error("Erro ao buscar detalhes do paciente:", error);
    return { patient: null, allMeals: [], dietStatus: defaultStatus };
  }
}
