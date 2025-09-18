"use server";

import { revalidatePath } from "next/cache";
import { getAuthenticatedDoc } from "../sheet-data/get-sheet-all-data";

// 1. Define a estrutura de dados que a action espera receber do formulário
export interface PatientUpdateData {
  name: string;
  weight: number;
  height: number;
  age: number;
  caloriesTarget: string;
  proteinTarget: string;
  carbsTarget: string;
  fatTarget: string;
  weightTarget: number;
}

export async function updatePatientData(
  userId: string,
  data: PatientUpdateData,
) {
  try {
    // Autentica e carrega o documento do Google Sheets
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Profile"];

    if (!sheet) {
      throw new Error("Planilha 'Profile' não foi encontrada.");
    }

    const rows = await sheet.getRows();
    const rowToUpdate = rows.find((row) => row.get("User_ID") === userId);

    if (!rowToUpdate) {
      return { success: false, error: "Paciente não encontrado na planilha." };
    } // 2. Atualiza todas as colunas com os novos dados do formulário
    // ATENÇÃO: Os nomes das colunas aqui devem ser IDÊNTICOS aos da sua planilha.

    rowToUpdate.set("Name", data.name);
    rowToUpdate.set("Weight", data.weight);
    rowToUpdate.set("Height", data.height);
    rowToUpdate.set("Age", data.age);
    rowToUpdate.set("Calories_target", data.caloriesTarget);
    rowToUpdate.set("Protein_target", data.proteinTarget);
    rowToUpdate.set("Carbs_target", data.carbsTarget);
    rowToUpdate.set("Fat_target", data.fatTarget);
    // Corrigido para corresponder ao nome da coluna na sua planilha
    rowToUpdate.set("Weigth_target", data.weightTarget); // Salva as alterações

    await rowToUpdate.save(); // 3. Limpa o cache para que a página seja recarregada com os novos dados

    revalidatePath("/admin/dashboard/patients");

    return { success: true, message: "Paciente atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar dados do paciente:", error);
    return {
      success: false,
      error: "Falha ao se comunicar com a planilha.",
    };
  }
}
