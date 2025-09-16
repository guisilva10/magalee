"use server";

import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { revalidatePath } from "next/cache";

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

// Interface para os dados que vamos receber do formulário
interface PatientUpdateData {
  name: string;
  calories: number;
  protein: number;
}

export async function updatePatientData(
  userId: string,
  data: PatientUpdateData,
) {
  try {
    // 1. Autentica e carrega o documento do Google Sheets
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Profile"];

    if (!sheet) {
      throw new Error("Planilha 'Profile' não foi encontrada.");
    }

    // 2. Carrega todas as linhas da planilha
    const rows = await sheet.getRows();

    // 3. Encontra a linha específica do paciente pelo User_ID
    const rowToUpdate = rows.find((row) => row.get("User_ID") === userId);

    if (!rowToUpdate) {
      return { success: false, error: "Paciente não encontrado na planilha." };
    }

    // 4. Atualiza os valores nas colunas correspondentes
    //    Certifique-se que os nomes das colunas ("Name", "Calories_target", etc.)
    //    batem EXATAMENTE com os da sua planilha.
    rowToUpdate.set("Name", data.name);
    rowToUpdate.set("Calories_target", data.calories);
    rowToUpdate.set("Protein_target", data.protein);

    // 5. Salva as alterações na planilha
    await rowToUpdate.save();

    // 6. Limpa o cache para que a página seja recarregada com os novos dados
    revalidatePath("/dashboard/patients"); // Ajuste o caminho se for diferente

    return { success: true, message: "Paciente atualizado com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar dados do paciente:", error);
    // Retorna um objeto de erro genérico para o cliente
    return {
      success: false,
      error: "Falha ao se comunicar com a planilha.",
    };
  }
}
