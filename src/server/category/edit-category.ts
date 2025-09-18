"use server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDoc } from "../sheet-data/get-sheet-all-data";
import { CategoryFormData } from "./create-category";

export async function updateCategory(
  categoryId: string,
  data: CategoryFormData,
) {
  try {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Categories"];
    if (!sheet) throw new Error("Planilha 'Categories' não encontrada.");

    const rows = await sheet.getRows();
    const rowToUpdate = rows.find(
      (row) => row.get("CategoryID") === categoryId,
    );

    if (!rowToUpdate) {
      return {
        success: false,
        error: "Categoria não encontrada para atualização.",
      };
    }

    // Atualiza os campos
    rowToUpdate.set("CategoryName", data.categoryName);
    rowToUpdate.set("Description", data.description || "");
    await rowToUpdate.save();

    revalidatePath("/admin/dashboard/categories");
    return { success: true, message: "Categoria atualizada com sucesso!" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return {
      success: false,
      error: `Falha ao atualizar a categoria: ${errorMessage}`,
    };
  }
}
