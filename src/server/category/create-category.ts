"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedDoc } from "../sheet-data/get-sheet-all-data"; // Verifique se o caminho está correto
import { v4 as uuidv4 } from "uuid";

// Definição do tipo de dados que o formulário enviará
export interface CategoryFormData {
  categoryName: string;
  description?: string; // Opcional
}

// ACTION: Criar uma nova categoria
export async function createCategory(data: CategoryFormData) {
  try {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Categories"];

    if (!sheet) {
      throw new Error(
        "A planilha 'Categories' não foi encontrada. Verifique se ela foi criada no Google Sheets.",
      );
    }

    // Adiciona uma nova linha com um ID único gerado
    await sheet.addRow({
      CategoryID: uuidv4(),
      CategoryName: data.categoryName,
      Description: data.description || "", // Garante que não seja undefined
    });

    // Força a atualização dos dados na página de categorias
    revalidatePath("/admin/dashboard/category"); // Ajuste o caminho se for diferente
    return { success: true, message: "Categoria criada com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    // Transforma o erro em uma string para o frontend
    const errorMessage =
      error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
    return {
      success: false,
      error: `Falha ao criar a categoria: ${errorMessage}`,
    };
  }
}
