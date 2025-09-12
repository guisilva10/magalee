import { google } from "googleapis";

// Interface para os dados a serem atualizados
interface UpdateUserData {
  userId: string;
  email: string;
  password: string; // Senha já criptografada
}

// Configuração da autenticação com a API do Google Sheets
const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    // O escopo de 'spreadsheets' permite leitura e escrita.
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

/**
 * Atualiza o email e a senha de um usuário na planilha do Google Sheets.
 * @param {UpdateUserData} data - Os dados a serem atualizados, incluindo userId, email e senha.
 * @returns {Promise<boolean>} - Retorna true se a atualização for bem-sucedida, false caso contrário.
 */
export async function updateUserInSheet({
  userId,
  email,
  password,
}: UpdateUserData): Promise<boolean> {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Profile!A:F"; // Buscamos em todas as colunas para encontrar o usuário

    // 1. LER a planilha para encontrar a linha do usuário
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows) {
      console.error("Nenhuma linha encontrada na planilha.");
      return false;
    }

    // O findIndex nos dá o índice no array de dados (começando em 0)
    // Pulamos o cabeçalho (slice(1))
    const userRowIndex = rows.slice(1).findIndex((row) => row[0] === userId);

    if (userRowIndex === -1) {
      console.error(
        `Usuário com ID ${userId} não encontrado para atualização.`,
      );
      return false;
    }

    // 2. CALCULAR a linha correta na planilha
    // O índice do array é 0-based. A primeira linha de dados está no índice 0.
    // As linhas da planilha são 1-based. A primeira linha de dados é a linha 2 (após o cabeçalho).
    // Portanto, a linha real na planilha é o índice do array + 2.
    const sheetRowNumber = userRowIndex + 2;

    // 3. ATUALIZAR as colunas de Email (E) e Password (F) para aquela linha específica
    const updateRange = `Profile!E${sheetRowNumber}:F${sheetRowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      // CORREÇÃO: A propriedade correta é 'requestBody', não 'resource'.
      requestBody: {
        values: [[email, password]], // Os valores precisam estar em um array de arrays
      },
    });

    console.log(
      `Usuário ${userId} atualizado com sucesso na linha ${sheetRowNumber}.`,
    );
    return true;
  } catch (error) {
    console.error("Erro ao atualizar a planilha do Google:", error);
    return false;
  }
}
