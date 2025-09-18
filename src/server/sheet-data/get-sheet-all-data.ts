"use server";

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { toDate } from "date-fns-tz";

// --- TIPOS DE DADOS (Interfaces) ---
export interface Alarm {
  uniqueId: string;
  title: string;
  time: string;
  frequencyMinutes: number;
  isActive: boolean;
  lastSent: string;
  date: string;
}

export interface Meal {
  userId?: string;
  patientName: string;
  Meal_description: string;
  Calories: number;
  carbohydrates: number;
  protein: number;
  fat: number;
  Date: string;
  CategoryName?: string;
}

export interface WaterLog {
  userId: string;
  date: string;
  waterMl: number;
}

export interface Patient {
  userId: string;
  name: string;
  email?: string;
  weightTarget: number;
  height: number;
  age: number;
  imc: number;
  caloriesTarget: string;
  proteinTarget: string;
  carbsTarget: string;
  fatTarget: string;
  password?: string;
  weight: number;
  createdAt: string;
  meals: Meal[];
  waterLogs: WaterLog[];
  alarms: Alarm[];
  consumedCaloriesToday: number;
  consumedProteinToday: number;
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
export async function getAuthenticatedDoc(): Promise<GoogleSpreadsheet> {
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

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const doc = await getAuthenticatedDoc();
    const patientsSheet = doc.sheetsByTitle["Profile"];
    const mealsSheet = doc.sheetsByTitle["Meals"];
    const waterSheet = doc.sheetsByTitle["Water"];
    const alarmsSheet = doc.sheetsByTitle["Alarms"];
    const categoriesSheet = doc.sheetsByTitle["Categories"];

    if (
      !patientsSheet ||
      !mealsSheet ||
      !waterSheet ||
      !alarmsSheet ||
      !categoriesSheet
    ) {
      throw new Error(
        "Uma ou mais planilhas (Profile, Meals, Water, Alarms) não foram encontradas.",
      );
    }

    const [patientRows, mealRows, waterRows, alarmRows, categoryRows] =
      await Promise.all([
        patientsSheet.getRows(),
        mealsSheet.getRows(),
        waterSheet.getRows(),
        alarmsSheet.getRows(),
        categoriesSheet.getRows(),
      ]);

    const categoryMap = new Map<string, string>();
    categoryRows.forEach((row) => {
      const id = row.get("CategoryID");
      const name = row.get("CategoryName");
      if (id && name) {
        categoryMap.set(id, name);
      }
    });

    // 1. Agrupar refeições, águas e alarmes por userId para eficiência
    const mealsByUser = new Map<string, Meal[]>();
    mealRows.forEach((row) => {
      const userId = row.get("User_ID");
      if (!userId) return;
      if (!mealsByUser.has(userId)) mealsByUser.set(userId, []);

      const categoryId = row.get("CategoryID");
      const categoryName = categoryId ? categoryMap.get(categoryId) : undefined;
      mealsByUser.get(userId)?.push({
        userId,
        patientName: "", // Será preenchido depois com o nome do paciente
        Meal_description: row.get("Meal_description"),
        Calories: parseFloat(row.get("Calories") || "0"),
        carbohydrates: parseFloat(row.get("Carbs") || "0"),
        protein: parseFloat(row.get("Proteins") || "0"), // Corrigido para "Proteins"
        fat: parseFloat(row.get("Fats") || "0"), // Corrigido para "Fats"
        Date: row.get("Date"),
        CategoryName: categoryName,
      });
    });

    const waterLogsByUser = new Map<string, WaterLog[]>();
    waterRows.forEach((row) => {
      const userId = row.get("User_ID");
      if (!userId) return;
      if (!waterLogsByUser.has(userId)) waterLogsByUser.set(userId, []);
      waterLogsByUser.get(userId)?.push({
        userId,
        date: row.get("Date"),
        waterMl: parseFloat(row.get("Water_ml") || "0"),
      });
    });

    const alarmsByUser = new Map<string, Alarm[]>();
    alarmRows.forEach((row) => {
      const userId = row.get("user_id"); // Corrigido para "user_id" minúsculo
      if (!userId) return;
      if (!alarmsByUser.has(userId)) alarmsByUser.set(userId, []);
      alarmsByUser.get(userId)?.push({
        uniqueId: row.get("Unique_ID"),
        title: row.get("Titulo_Lembrete"),
        time: row.get("Horario_Fix"),
        frequencyMinutes: parseInt(row.get("Frequencia_Minutos") || "0", 10),
        isActive: row.get("Ativo") === "TRUE",
        lastSent: row.get("Ultimo_Envio"),
        date: row.get("Date"),
      });
    });

    const timeZone = "America/Sao_Paulo";
    const startOfToday = startOfDay(new Date());
    const endOfToday = endOfDay(new Date());

    // 2. Construir o array final de pacientes com todos os dados aninhados
    const allPatients: Patient[] = patientRows.map((row) => {
      const userId = row.get("User_ID");
      const patientMeals = mealsByUser.get(userId) || [];
      const patientWaterLogs = waterLogsByUser.get(userId) || [];
      const patientAlarms = alarmsByUser.get(userId) || [];

      // Preenche o nome do paciente nas refeições
      patientMeals.forEach((meal) => (meal.patientName = row.get("Name")));

      const todaysConsumption = patientMeals
        .filter((meal) => {
          const mealDate = toDate(meal.Date, { timeZone });
          return mealDate >= startOfToday && mealDate <= endOfToday;
        })
        .reduce(
          (acc, meal) => {
            acc.calories += meal.Calories;
            acc.protein += meal.protein;
            return acc;
          },
          { calories: 0, protein: 0 },
        );

      return {
        userId,
        name: row.get("Name"),
        email: row.get("Email"),
        password: row.get("Password"),
        createdAt: row.get("CreatedAt"),
        caloriesTarget: row.get("Calories_target") || "0",
        proteinTarget: row.get("Protein_target") || "0",
        carbsTarget: row.get("Carbs_target") || "0",
        fatTarget: row.get("Fat_target") || "0",
        height: parseFloat(row.get("Height") || "0"),
        weight: parseFloat(row.get("Weight") || "0"),
        imc: parseFloat(row.get("Imc") || "0"),
        weightTarget: parseFloat(row.get("Weigth_target") || "0"),
        age: parseInt(row.get("Age") || "0", 10),
        meals: patientMeals,
        waterLogs: patientWaterLogs,
        alarms: patientAlarms,
        consumedCaloriesToday: todaysConsumption.calories,
        consumedProteinToday: todaysConsumption.protein,
      };
    });

    // 3. Calcular totais para o dashboard
    const allMealsToday = allPatients
      .flatMap((p) => p.meals)
      .filter((meal) => {
        const mealDate = toDate(meal.Date, { timeZone });
        return mealDate >= startOfToday && mealDate <= endOfToday;
      });

    const allWaterToday = allPatients
      .flatMap((p) => p.waterLogs)
      .filter((log) => {
        const logDate = toDate(log.date, { timeZone });
        return logDate >= startOfToday && logDate <= endOfToday;
      });

    const totalWaterToday = allWaterToday.reduce(
      (sum, log) => sum + log.waterMl,
      0,
    );

    const sortedMeals = [...allPatients.flatMap((p) => p.meals)].sort(
      (a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime(),
    );

    return {
      totalPatients: allPatients.length,
      totalMealsToday: allMealsToday.length,
      totalWaterToday,
      latestMeal: sortedMeals.length > 0 ? sortedMeals[0] : null,
      patients: allPatients,
      recentMeals: sortedMeals.slice(0, 5),
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
      error: "Falha ao carregar dados da planilha.",
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

export type DietStatus = {
  text: string;
  variant: "success" | "warning" | "destructive" | "default";
};

function calculateDietStatus(
  allMeals: Meal[],
  patientTargets: Patient,
): DietStatus {
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

  const targetCalories = parseFloat(patientTargets.caloriesTarget) || 0;
  const targetProtein = parseFloat(patientTargets.proteinTarget) || 0;

  if (targetCalories === 0 || targetProtein === 0) {
    return { text: "Metas não definidas", variant: "default" };
  }

  const calRatio = avgCalories / targetCalories;
  const protRatio = avgProtein / targetProtein;

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
  dietStatus: DietStatus;
  error: string | null;
}> {
  const defaultStatus: DietStatus = { text: "Sem dados", variant: "default" };
  try {
    const doc = await getAuthenticatedDoc();
    const patientsSheet = doc.sheetsByTitle["Profile"];
    const mealsSheet = doc.sheetsByTitle["Meals"];
    const waterSheet = doc.sheetsByTitle["Water"];
    const alarmsSheet = doc.sheetsByTitle["Alarms"];
    const categoriesSheet = doc.sheetsByTitle["Categories"]; // <-- NOVO

    if (
      !patientsSheet ||
      !mealsSheet ||
      !waterSheet ||
      !alarmsSheet ||
      !categoriesSheet
    ) {
      // <-- NOVO
      throw new Error("Planilhas não encontradas.");
    }

    const [patientRows, mealRows, waterRows, alarmRows, categoryRows] =
      await Promise.all([
        // <-- NOVO
        patientsSheet.getRows(),
        mealsSheet.getRows(),
        waterSheet.getRows(),
        alarmsSheet.getRows(),
        categoriesSheet.getRows(), // <-- NOVO
      ]);

    const patientRow = patientRows.find((row) => row.get("User_ID") === userId);
    if (!patientRow) {
      return {
        patient: null,
        dietStatus: defaultStatus,
        error: "Paciente não encontrado.",
      };
    }

    // NOVO: Criar um mapa de ID da categoria para o nome da categoria para consulta rápida
    const categoryMap = new Map<string, string>();
    categoryRows.forEach((row) => {
      const id = row.get("CategoryID");
      const name = row.get("CategoryName");
      if (id && name) {
        categoryMap.set(id, name);
      }
    });

    const patientName = patientRow.get("Name");

    const patientMeals: Meal[] = mealRows
      .filter((row) => row.get("User_ID") === userId)
      .map((row) => {
        // NOVO: Busca o nome da categoria usando o mapa
        const categoryId = row.get("CategoryID");
        const categoryName = categoryId
          ? categoryMap.get(categoryId)
          : undefined;

        return {
          userId,
          patientName,
          Meal_description: row.get("Meal_description"),
          Calories: parseFloat(row.get("Calories") || "0"),
          carbohydrates: parseFloat(row.get("Carbs") || "0"),
          protein: parseFloat(row.get("Proteins") || "0"),
          fat: parseFloat(row.get("Fats") || "0"),
          Date: row.get("Date"),
          CategoryName: categoryName, // <-- NOVO
        };
      });

    // O resto da função permanece o mesmo...
    const patientWaterLogs: WaterLog[] = waterRows
      .filter((row) => row.get("User_ID") === userId)
      .map((row) => ({
        userId,
        date: row.get("Date"),
        waterMl: parseFloat(row.get("Water_ml") || "0"),
      }));

    const patientAlarms: Alarm[] = alarmRows
      .filter((row) => row.get("user_id") === userId)
      .map((row) => ({
        uniqueId: row.get("Unique_ID"),
        title: row.get("Titulo_Lembrete"),
        time: row.get("Horario_Fix"),
        frequencyMinutes: parseInt(row.get("Frequencia_Minutos") || "0", 10),
        isActive: row.get("Ativo") === "TRUE",
        lastSent: row.get("Ultimo_Envio"),
        date: row.get("Date"),
      }));

    const timeZone = "America/Sao_Paulo";
    const todaysConsumption = patientMeals
      .filter(
        (meal) => toDate(meal.Date, { timeZone }) >= startOfDay(new Date()),
      )
      .reduce(
        (acc, meal) => {
          acc.calories += meal.Calories;
          acc.protein += meal.protein;
          return acc;
        },
        { calories: 0, protein: 0 },
      );

    const patient: Patient = {
      userId,
      name: patientName,
      email: patientRow.get("Email"),
      password: patientRow.get("Password"),
      createdAt: patientRow.get("CreatedAt"),
      caloriesTarget: patientRow.get("Calories_target") || "0",
      proteinTarget: patientRow.get("Protein_target") || "0",
      carbsTarget: patientRow.get("Carbs_target") || "0",
      fatTarget: patientRow.get("Fat_target") || "0",
      height: parseFloat(patientRow.get("Height") || "0"),
      weight: parseFloat(patientRow.get("Weight") || "0"),
      imc: parseFloat(patientRow.get("Imc") || "0"),
      weightTarget: parseFloat(patientRow.get("Weight_target") || "0"),
      age: parseInt(patientRow.get("Age") || "0", 10),
      meals: patientMeals,
      waterLogs: patientWaterLogs,
      alarms: patientAlarms,
      consumedCaloriesToday: todaysConsumption.calories,
      consumedProteinToday: todaysConsumption.protein,
    };

    const dietStatus = calculateDietStatus(patient.meals, patient);

    return { patient, dietStatus, error: null };
  } catch (error: any) {
    console.error("Erro ao buscar detalhes do paciente:", error);
    return {
      patient: null,
      dietStatus: defaultStatus,
      error: "Falha ao carregar detalhes do paciente.",
    };
  }
}
