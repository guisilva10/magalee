// app/actions/updatePatient.ts
"use server";

import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { revalidatePath } from "next/cache";

async function getAuthenticatedDoc(): Promise<GoogleSpreadsheet> {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID!,
    serviceAccountAuth,
  );
  await doc.loadInfo();
  return doc;
}

interface PatientUpdateData {
  name: string;
  calories: number;
  protein: number;
  height: number;
  weightTarget: number;
  age: number;
  imgTarget?: number;
  carbsTarget: string;
  fatTarget: string;
}

export async function updatePatientData(
  userId: string,
  data: PatientUpdateData,
) {
  try {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByTitle["Profile"];

    if (!sheet) {
      throw new Error("Planilha 'Profile' não foi encontrada.");
    }

    const rows = await sheet.getRows();
    const rowToUpdate = rows.find((row) => row.get("User_ID") === userId);

    if (!rowToUpdate) {
      return { success: false, error: "Paciente não encontrado na planilha." };
    }

    rowToUpdate.set("Name", data.name);
    rowToUpdate.set("Calories_target", data.calories);
    rowToUpdate.set("Protein_target", data.protein);
    rowToUpdate.set("Weigth_target", data.weightTarget);
    rowToUpdate.set("Height", data.height);
    rowToUpdate.set("Age", data.age);
    rowToUpdate.set("Carbs_target", data.carbsTarget);
    rowToUpdate.set("Fats_target", data.fatTarget);

    await rowToUpdate.save();

    revalidatePath("/dashboard");

    return { success: true, message: "Dados atualizados com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar dados do paciente:", error);
    return {
      success: false,
      error: "Falha ao se comunicar com a planilha. Tente novamente.",
    };
  }
}
