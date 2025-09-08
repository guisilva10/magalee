"use server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { getCategoryFromDescription } from "@/app/_lib/utils";

interface MealItem {
  patientName: string;
  Calories: number;
}

export interface CategoryData {
  categoryName: string;
  totalCalories: number;
  mealCount: number;
  meals: MealItem[];
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

// --- FUNÇÃO ATUALIZADA PARA AGRUPAR DADOS ---
export async function getMealDataGroupedByCategory(): Promise<CategoryData[]> {
  try {
    const doc = await getAuthenticatedDoc();
    const mealsSheet = doc.sheetsByTitle["Meals"];
    const patientsSheet = doc.sheetsByTitle["Profile"];

    if (!mealsSheet || !patientsSheet) {
      throw new Error("Planilha 'Meals' ou 'Profile' não encontrada.");
    }

    const [mealRows, patientRows] = await Promise.all([
      mealsSheet.getRows(),
      patientsSheet.getRows(),
    ]);

    const patientIdToNameMap = new Map(
      patientRows.map((row) => [row.get("User_ID"), row.get("Name")]),
    );

    const categoriesMap = new Map<string, MealItem[]>();

    mealRows.forEach((row) => {
      const description = row.get("Meal_description");
      const calories = parseFloat(row.get("Calories"));

      if (!description || isNaN(calories)) {
        return; // Pula linhas inválidas
      }

      // --- MUDANÇA PRINCIPAL: Usa a função inteligente para obter a categoria ---
      const categoryName = getCategoryFromDescription(description);

      const patientId = row.get("User_ID");
      const patientName = patientIdToNameMap.get(patientId) || "Desconhecido";

      const mealItem: MealItem = { patientName, Calories: calories };

      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, []);
      }
      categoriesMap.get(categoryName)!.push(mealItem);
    });

    const result: CategoryData[] = Array.from(
      categoriesMap,
      ([categoryName, meals]) => ({
        categoryName,
        meals,
        mealCount: meals.length,
        totalCalories: meals.reduce((sum, meal) => sum + meal.Calories, 0),
      }),
    );

    return result.sort((a, b) => a.categoryName.localeCompare(b.categoryName));
  } catch (err) {
    console.error("Erro ao agrupar dados de refeições por categoria:", err);
    return [];
  }
}
