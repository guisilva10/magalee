"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { startOfDay, endOfDay } from "date-fns";
import { toDate } from "date-fns-tz";

// --- TIPOS DE DADOS (Interfaces) ---
export interface Meal {
  userId?: string;
  patientName: string;
  Meal_description: string;
  Calories: number;
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
