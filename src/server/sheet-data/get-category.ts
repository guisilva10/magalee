"use server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { getCategoryFromDescription } from "@/app/_lib/utils";
import { revalidatePath } from "next/cache";

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

export async function deleteCategory(categoryName: string) {
  try {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Meals"];
    if (!sheet) throw new Error("Planilha 'Meals' não encontrada.");

    const rows = await sheet.getRows();
    const rowsToDelete = [];

    // Encontra todas as linhas que correspondem à categoria
    for (const row of rows) {
      const description = row.get("Meal_description");
      if (
        description &&
        getCategoryFromDescription(description) === categoryName
      ) {
        rowsToDelete.push(row);
      }
    }

    if (rowsToDelete.length === 0) {
      return {
        success: true,
        message: "Nenhuma refeição encontrada para esta categoria.",
      };
    }

    // Exclui as linhas em lote (iterando de trás para frente para evitar problemas de índice)
    for (let i = rowsToDelete.length - 1; i >= 0; i--) {
      await rowsToDelete[i].delete();
    }

    revalidatePath("/admin/dashboard/category"); // Atualiza a página de categorias
    return {
      success: true,
      message: `Categoria "${categoryName}" e todas as suas refeições foram excluídas.`,
    };
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return {
      success: false,
      error: "Falha ao excluir as refeições da categoria.",
    };
  }
}

export async function renameCategory(oldName: string, newName: string) {
  if (!newName || newName.trim() === "") {
    return { success: false, error: "O novo nome não pode estar vazio." };
  }
  try {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Meals"];
    if (!sheet) throw new Error("Planilha 'Meals' não encontrada.");

    const rows = await sheet.getRows();
    const rowsToUpdate = [];

    for (const row of rows) {
      const description = row.get("Meal_description");
      if (description && getCategoryFromDescription(description) === oldName) {
        // Adiciona o novo nome como um prefixo para garantir a categorização correta
        const newDescription = `${newName}: ${description}`;
        row.set("Meal_description", newDescription);
        rowsToUpdate.push(row.save()); // Adiciona a promessa de salvar ao array
      }
    }

    await Promise.all(rowsToUpdate); // Salva todas as alterações em paralelo

    revalidatePath("/admin/dashboard/category");
    return {
      success: true,
      message: `Categoria "${oldName}" renomeada para "${newName}".`,
    };
  } catch (error) {
    console.error("Erro ao renomear categoria:", error);
    return { success: false, error: "Falha ao renomear a categoria." };
  }
}
