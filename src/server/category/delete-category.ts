"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedDoc } from "../sheet-data/get-sheet-all-data";

// --- NOVA ACTION: Excluir uma categoria existente ---
export async function deleteCategory(categoryId: string) {
  try {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Categories"];
    if (!sheet) throw new Error("Planilha 'Categories' não encontrada.");

    const rows = await sheet.getRows();
    const rowToDelete = rows.find(
      (row) => row.get("CategoryID") === categoryId,
    );

    if (!rowToDelete) {
      return {
        success: false,
        error: "Categoria não encontrada para exclusão.",
      };
    }

    // Exclui a linha
    await rowToDelete.delete();

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: "Categoria excluída com sucesso!" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return {
      success: false,
      error: `Falha ao excluir a categoria: ${errorMessage}`,
    };
  }
}
