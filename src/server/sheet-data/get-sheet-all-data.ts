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

export interface WaterLog {
  userId: string;
  date: string;
  waterMl: number;
}

export interface Patient {
  userId: string;
  name: string;
  calories: number;
  protein: number;
  avgWaterMl?: number;
}

export interface DashboardData {
  totalPatients: number;
  totalMealsToday: number;
  totalWaterToday: number;
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

    const patientsSheet = doc.sheetsByTitle["Profile"];
    const mealsSheet = doc.sheetsByTitle["Meals"];
    const waterSheet = doc.sheetsByTitle["Water"];

    if (!patientsSheet || !mealsSheet || !waterSheet) {
      throw new Error(
        "Uma ou mais planilhas (Profile, Meals, Water) não foram encontradas.",
      );
    }

    const [patientRows, mealRows, waterRows] = await Promise.all([
      patientsSheet.getRows(),
      mealsSheet.getRows(),
      waterSheet.getRows(),
    ]);

    // Mapeia os logs de água por usuário para otimizar a busca
    const waterLogsByUser = new Map<string, any[]>();
    waterRows.forEach((row) => {
      const userId = row.get("User_ID");
      if (userId) {
        if (!waterLogsByUser.has(userId)) {
          waterLogsByUser.set(userId, []);
        }
        waterLogsByUser.get(userId)?.push(row);
      }
    });

    const allPatients: Patient[] = patientRows.map((row) => {
      const userId = row.get("User_ID");
      const patientWaterRows = waterLogsByUser.get(userId) || [];

      // Calcula a média de consumo de água para o paciente
      const dailyWaterMap = new Map<string, number>();
      patientWaterRows.forEach((waterRow) => {
        const dateKey = startOfDay(
          new Date(waterRow.get("Date")),
        ).toISOString();
        const waterMl = parseFloat(waterRow.get("Water_ml") || "0");
        dailyWaterMap.set(dateKey, (dailyWaterMap.get(dateKey) || 0) + waterMl);
      });

      const totalWater = Array.from(dailyWaterMap.values()).reduce(
        (sum, value) => sum + value,
        0,
      );
      const avgWaterPerDay =
        dailyWaterMap.size > 0
          ? Math.round(totalWater / dailyWaterMap.size)
          : 0;

      return {
        userId: userId,
        name: row.get("Name"),
        calories: parseFloat(row.get("Calories_target") || "0"),
        protein: parseFloat(row.get("Protein_target") || "0"),
        avgWaterMl: avgWaterPerDay,
      };
    });

    const totalPatients = allPatients.length;
    const patientIdToNameMap = new Map(
      allPatients.map((p) => [p.userId, p.name]),
    );
    const allMeals: Meal[] = mealRows.map((row) => {
      const patientId = row.get("User_ID");
      const patientName =
        patientIdToNameMap.get(patientId) || "Paciente Desconhecido";
      return {
        userId: patientId,
        patientName,
        Meal_description: row.get("Meal_description"),
        Calories: parseFloat(row.get("Calories") || "0"),
        carbohydrates: parseFloat(row.get("Carbs") || "0"),
        protein: parseFloat(row.get("Protein") || "0"),
        fat: parseFloat(row.get("Fats") || "0"),
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

    const todaysWaterRows = waterRows.filter((row) => {
      const waterDate = toDate(row.get("Date"), { timeZone });
      return waterDate >= startOfToday && waterDate <= endOfToday;
    });

    const totalMealsToday = todaysMeals.length;
    const totalWaterToday = todaysWaterRows.reduce(
      (sum, row) => sum + parseFloat(row.get("Water_ml") || "0"),
      0,
    );

    const sortedMeals = [...allMeals].sort(
      (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime(),
    );
    const latestMeal = sortedMeals.length > 0 ? sortedMeals[0] : null;
    const recentMeals = sortedMeals.slice(0, 5);

    return {
      totalPatients,
      totalMealsToday,
      totalWaterToday,
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
      totalWaterToday: 0,
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
    const waterSheet = doc.sheetsByTitle["Water"];

    if (!mealsSheet || !waterSheet) {
      throw new Error("Planilha 'Meals' ou 'Water' não foi encontrada.");
    }

    const [mealRows, waterRows] = await Promise.all([
      mealsSheet.getRows(),
      waterSheet.getRows(),
    ]);

    const patientMealRows = mealRows.filter(
      (row) => row.get("User_ID") === userId,
    );
    const patientWaterRows = waterRows.filter(
      (row) => row.get("User_ID") === userId,
    ); // Calcula estatísticas de refeições

    const totalMeals = patientMealRows.length;
    const totalCalories = patientMealRows.reduce(
      (sum, row) => sum + parseFloat(row.get("Calories") || "0"),
      0,
    );
    const avgCaloriesPerMeal = totalMeals > 0 ? totalCalories / totalMeals : 0;

    // Calcula estatísticas de água
    const dailyWaterMap = new Map<string, number>();
    patientWaterRows.forEach((row) => {
      const dateKey = startOfDay(new Date(row.get("Date"))).toISOString();
      const waterMl = parseFloat(row.get("Water_ml") || "0");
      dailyWaterMap.set(dateKey, (dailyWaterMap.get(dateKey) || 0) + waterMl);
    });

    const totalWater = Array.from(dailyWaterMap.values()).reduce(
      (sum, value) => sum + value,
      0,
    );
    const avgWaterPerDay =
      dailyWaterMap.size > 0 ? totalWater / dailyWaterMap.size : 0;

    const recentMeals = patientMealRows
      .map((row) => ({
        description: row.get("Meal_description") as string,
        calories: parseFloat(row.get("Calories")),
        date: new Date(row.get("Date")),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

    return {
      success: true,
      stats: {
        totalMeals,
        totalCalories,
        avgCaloriesPerMeal: Math.round(avgCaloriesPerMeal),
        totalWater,
        avgWaterPerDay: Math.round(avgWaterPerDay),
        recentMeals: recentMeals.map((meal) => ({
          ...meal,
          date: meal.date.toISOString(),
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

  if (dailyConsumptions.size < 5) {
    return { text: "Dados Insuficientes", variant: "default" };
  }

  let totalAvgCalories = 0;
  let totalAvgProtein = 0;
  dailyConsumptions.forEach((day) => {
    totalAvgCalories += day.calories;
    totalAvgProtein += day.protein;
  });
  const avgCalories = totalAvgCalories / dailyConsumptions.size;
  const avgProtein = totalAvgProtein / dailyConsumptions.size;

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
  allWaterLogs: WaterLog[];
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
    const waterSheet = doc.sheetsByTitle["Water"];

    if (!patientsSheet || !mealsSheet || !waterSheet) {
      throw new Error("Planilhas não encontradas.");
    }

    const [patientRows, mealRows, waterRows] = await Promise.all([
      patientsSheet.getRows(),
      mealsSheet.getRows(),
      waterSheet.getRows(),
    ]);

    const patientRow = patientRows.find((row) => row.get("User_ID") === userId);
    if (!patientRow) {
      return {
        patient: null,
        allMeals: [],
        allWaterLogs: [],
        dietStatus: defaultStatus,
      };
    }
    // A interface do paciente é atualizada aqui, mas getPatientDetails não retorna avgWaterMl.
    // O ideal seria unificar, mas por agora vamos manter como está para não quebrar outras partes.
    const patient: Omit<Patient, "avgWaterMl"> & {
      calories: number;
      protein: number;
    } = {
      userId: patientRow.get("User_ID"),
      name: patientRow.get("Name"),
      calories: parseFloat(patientRow.get("Calories_target") || "0"),
      protein: parseFloat(patientRow.get("Protein_target") || "0"),
    };

    const allMeals: Meal[] = mealRows
      .filter((row) => row.get("User_ID") === userId)
      .map((row) => ({
        userId: row.get("User_ID"),
        patientName: patient.name,
        Meal_description: row.get("Meal_description"),
        Calories: parseFloat(row.get("Calories") || "0"),
        carbohydrates: parseFloat(row.get("Carbs") || "0"),
        protein: parseFloat(row.get("Protein") || "0"),
        fat: parseFloat(row.get("Fats") || "0"),
        Date: row.get("Date"),
      }));

    const allWaterLogs: WaterLog[] = waterRows
      .filter((row) => row.get("User_ID") === userId)
      .map((row) => ({
        userId: row.get("User_ID"),
        date: row.get("Date"),
        waterMl: parseFloat(row.get("Water_ml") || "0"),
      }));

    const dietStatus = calculateDietStatus(allMeals, patient);

    return { patient: patient as Patient, allMeals, allWaterLogs, dietStatus };
  } catch (error) {
    console.error("Erro ao buscar detalhes do paciente:", error);
    return {
      patient: null,
      allMeals: [],
      allWaterLogs: [],
      dietStatus: defaultStatus,
    };
  }
}
