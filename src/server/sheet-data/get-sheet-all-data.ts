/* eslint-disable @typescript-eslint/no-explicit-any */
// Local: /app/_lib/google-sheets-service.ts

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { startOfDay, endOfDay } from "date-fns";
import { toDate } from "date-fns-tz";

// --- TIPOS DE DADOS (Interfaces) ---
export interface Meal {
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

    // --- 1. Processar dados dos Pacientes ---
    // CORREÇÃO 2: Usar os nomes exatos das colunas da sua planilha "Profile"
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
