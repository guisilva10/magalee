// app/actions/updateAlarmStatus.ts

"use server";

import { google } from "googleapis";
import { revalidatePath } from "next/cache";

export interface AlarmData {
  date: string;
  reminderText: string;
  fixedTime: string | null;
  frequencyMinutes: number | null;
}

// Função para autorizar e obter o cliente do Google Sheets
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    // IMPORTANTE: O escopo agora permite escrita na planilha
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

async function findAlarmRow(
  sheets: any,
  spreadsheetId: string,
  uniqueId: string,
) {
  // 1. Obter metadados da planilha para encontrar o sheetId da aba "Alarms"
  const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
  const alarmsSheet = spreadsheetMeta.data.sheets?.find(
    (s: any) => s.properties?.title === "Alarms",
  );
  if (!alarmsSheet?.properties?.sheetId) {
    throw new Error("Aba 'Alarms' não encontrada.");
  }
  const alarmsSheetId = alarmsSheet.properties.sheetId;

  // 2. Ler os dados para encontrar o índice da linha
  const range = "Alarms!A2:H";
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const rows = response.data.values;
  if (!rows) throw new Error("Nenhum dado encontrado na aba 'Alarms'.");

  const rowIndex = rows.findIndex((row: any[]) => row[7] === uniqueId);
  if (rowIndex === -1) throw new Error("Alarme não encontrado.");

  // O número da linha na planilha é o índice + 2
  const rowNumber = rowIndex + 2;

  return { rowNumber, alarmsSheetId };
}

export async function updateAlarmStatus(uniqueId: string, isActive: boolean) {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const newStatus = isActive ? "ativo" : "desativado";

    // 1. Ler a planilha para encontrar a linha do alarme
    const range = "Alarms!A2:H"; // Coluna H é a do Unique_ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("Nenhum alarme encontrado na planilha.");
    }

    // O índice da linha na API é baseado em 0, mas na planilha é baseado em 1.
    // A primeira linha de dados está no índice 0, que corresponde à linha 2 da planilha.
    const rowIndex = rows.findIndex((row) => row[7] === uniqueId); // Coluna H (índice 7)

    if (rowIndex === -1) {
      throw new Error(`Alarme com ID ${uniqueId} não encontrado.`);
    }

    // A linha real na planilha é o índice encontrado + 2 (porque começamos da linha A2)
    const rowToUpdate = rowIndex + 2;

    // 2. Atualizar a célula de Status (Coluna F) na linha encontrada
    const updateRange = `Alarms!F${rowToUpdate}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[newStatus]],
      },
    });

    // 3. Revalidar o cache da página do dashboard para mostrar os dados atualizados
    revalidatePath("/dashboard");

    return { success: true, message: "Status do alarme atualizado." };
  } catch (error) {
    console.error("Erro ao atualizar o status do alarme:", error);
    // Em um app de produção, você poderia retornar uma mensagem de erro mais detalhada
    return { success: false, message: "Falha ao atualizar o alarme." };
  }
}

export async function deleteAlarm(uniqueId: string) {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

    const { rowNumber, alarmsSheetId } = await findAlarmRow(
      sheets,
      spreadsheetId,
      uniqueId,
    );

    // Usa batchUpdate para deletar a dimensão (linha)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: alarmsSheetId,
                dimension: "ROWS",
                // O índice da API é 0-based, então linha 5 é índice 4
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Alarme apagado com sucesso." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function editAlarm(uniqueId: string, data: AlarmData) {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

    const { rowNumber } = await findAlarmRow(sheets, spreadsheetId, uniqueId);

    const updateRange = `Alarms!B${rowNumber}:E${rowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            data.date,
            data.reminderText,
            data.fixedTime || "",
            // Salva o valor em minutos ou uma string vazia se for nulo
            data.frequencyMinutes ?? "",
          ],
        ],
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Alarme atualizado com sucesso." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
