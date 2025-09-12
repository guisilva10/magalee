// lib/sheets.ts
import { google } from "googleapis";

// Defina uma interface para os dados do usuário para ter tipagem forte
export interface SheetUser {
  userId: string;
  name: string;
  caloriesTarget: string;
  proteinTarget: string;
  email: string | null; // Pode ser nulo/vazio
  password: string | null; // Pode ser nulo/vazio
}

// Função para buscar o usuário pelo User_ID
export async function getUserFromSheet(
  userId: string,
): Promise<SheetUser | null> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Substitui \\n por \n real
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Profile!A:F", // Busca da coluna A até a F na aba 'Profile'
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("Nenhum dado encontrado na planilha.");
      return null;
    }

    // Pula o cabeçalho (linha 1) e procura pelo usuário
    const header = rows[0];
    const userRow = rows.slice(1).find((row) => row[0] === userId);

    if (!userRow) {
      console.log(`Usuário com ID ${userId} não encontrado na planilha.`);
      return null;
    }

    // Mapeia a linha para um objeto de usuário
    const userData: SheetUser = {
      userId: userRow[0] || "",
      name: userRow[1] || "",
      caloriesTarget: userRow[2] || "",
      proteinTarget: userRow[3] || "",
      email: userRow[4]?.trim() || null,
      password: userRow[5]?.trim() || null,
    };

    return userData;
  } catch (error) {
    console.error("Erro ao acessar a planilha do Google:", error);
    // Em caso de erro, você pode optar por lançar o erro ou retornar null
    // Retornar null pode ser mais seguro para não quebrar a aplicação
    return null;
  }
}
