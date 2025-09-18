"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedDoc } from "../sheet-data/get-sheet-all-data";

export async function deletePatientData(userId: string) {
  if (!userId) {
    return { success: false, error: "ID do usuário não fornecido." };
  }

  try {
    // Autentica e carrega o documento do Google Sheets
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Profile"];

    if (!sheet) {
      throw new Error("Planilha 'Profile' não foi encontrada.");
    }

    // Pega todas as linhas e encontra a que corresponde ao userId
    const rows = await sheet.getRows();
    const rowToDelete = rows.find((row) => row.get("User_ID") === userId);

    if (!rowToDelete) {
      return { success: false, error: "Paciente não encontrado na planilha." };
    }

    // Exclui a linha da planilha
    await rowToDelete.delete();

    // Limpa o cache para que a página seja recarregada sem o paciente excluído
    revalidatePath("/admin/dashboard/patients");

    return { success: true, message: "Paciente excluído com sucesso!" };
  } catch (error) {
    console.error("Erro ao excluir dados do paciente:", error);
    return {
      success: false,
      error: "Falha ao se comunicar com a planilha.",
    };
  }
}
