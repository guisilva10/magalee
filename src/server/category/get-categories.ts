"use server";

import { getAuthenticatedDoc } from "../sheet-data/get-sheet-all-data"; // Verifique se o caminho está correto

// Tipagem para uma refeição individual, associada a um paciente
interface MealItem {
  patientName: string;
  Calories: number;
}

// Tipagem para o resultado final que o componente do cliente espera
interface CategoryData {
  CategoryID: string;
  CategoryName: string;
  Description: string;
  totalCalories: number;
  mealCount: number;
  meals: MealItem[];
}

export async function getCategoriesWithMealData(): Promise<CategoryData[]> {
  try {
    const doc = await getAuthenticatedDoc();
    // Carrega as três planilhas necessárias
    const categoriesSheet = doc.sheetsByTitle["Categories"];
    const mealsSheet = doc.sheetsByTitle["Meals"];
    const patientsSheet = doc.sheetsByTitle["Profile"];

    if (!categoriesSheet || !mealsSheet || !patientsSheet) {
      throw new Error(
        "Uma ou mais planilhas (Categories, Meals, Profile) não foram encontradas.",
      );
    }

    // Busca os dados de todas as planilhas em paralelo para mais eficiência
    const [categoryRows, mealRows, patientRows] = await Promise.all([
      categoriesSheet.getRows(),
      mealsSheet.getRows(),
      patientsSheet.getRows(),
    ]);

    // Cria um mapa para associar rapidamente o ID do paciente ao seu nome
    const patientIdToNameMap = new Map<string, string>(
      patientRows.map((row) => [row.get("User_ID"), row.get("Name")]),
    );

    // ETAPA 1: Construir a base de dados a partir da planilha "Categories"
    // Usamos um Map para ter acesso rápido a cada categoria pelo seu ID.
    const categoriesMap = new Map<string, CategoryData>();
    categoryRows.forEach((row) => {
      const categoryId = row.get("CategoryID");
      if (categoryId) {
        categoriesMap.set(categoryId, {
          CategoryID: categoryId,
          CategoryName: row.get("CategoryName") || "Sem Nome",
          Description: row.get("Description") || "",
          // Inicializa os dados agregados
          meals: [],
          mealCount: 0,
          totalCalories: 0,
        });
      }
    });

    // ETAPA 2: Processar as refeições e agrupá-las nas categorias existentes
    mealRows.forEach((row) => {
      // A refeição DEVE ter um CategoryID para ser associada
      const categoryId = row.get("CategoryID");
      const calories = parseFloat(row.get("Calories"));

      // Pula a linha se não tiver ID de categoria ou se as calorias forem inválidas
      if (!categoryId || isNaN(calories)) {
        return;
      }

      // Verifica se a categoria da refeição existe no nosso mapa
      const category = categoriesMap.get(categoryId);
      if (category) {
        const patientId = row.get("User_ID");
        const patientName = patientIdToNameMap.get(patientId) || "Desconhecido";

        const mealItem: MealItem = { patientName, Calories: calories };

        // Atualiza os dados da categoria com a nova refeição
        category.meals.push(mealItem);
        category.mealCount += 1;
        category.totalCalories += calories;
      }
    });

    // ETAPA 3: Converter o mapa de volta para um array e ordenar
    const result = Array.from(categoriesMap.values());

    return result.sort((a, b) => a.CategoryName.localeCompare(b.CategoryName));
  } catch (err) {
    console.error("Erro ao buscar e agrupar dados das categorias:", err);
    return []; // Retorna um array vazio em caso de erro
  }
}
