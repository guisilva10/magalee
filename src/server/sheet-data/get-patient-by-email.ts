import { google } from "googleapis";

// Interface para os dados de autenticação do paciente
export interface PatientAuthData {
  userId: string;
  name: string;
  email: string;
  password?: string | null; // A senha pode não ter sido criada ainda
  caloriesTarget: string;
  proteinTarget: string;
}

/**
 * Busca os dados de um paciente na planilha pelo seu e-mail.
 * Otimizado para autenticação, buscando apenas na aba 'Profile'.
 * @param {string} email - O e-mail do paciente a ser buscado.
 * @returns {Promise<PatientAuthData | null>} - Os dados do paciente ou null se não for encontrado.
 */
export async function getPatientByEmail(
  email: string,
): Promise<PatientAuthData | null> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Buscamos da coluna A até a F para garantir que email e senha sejam incluídos
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Profile!A2:F",
    });

    const profileRows = response.data.values || [];
    // A coluna de email é a 'E', que corresponde ao índice 4 no array
    const userProfile = profileRows.find((row) => row[4] === email);

    if (!userProfile) {
      console.log(`Paciente com email ${email} não encontrado.`);
      return null;
    }

    // Retorna os dados do perfil necessários para a autenticação
    return {
      userId: userProfile[0],
      name: userProfile[1],
      caloriesTarget: userProfile[2],
      proteinTarget: userProfile[3],
      email: userProfile[4],
      password: userProfile[5] || null, // Garante que retorne null se a célula da senha estiver vazia
    };
  } catch (error) {
    console.error("Error fetching patient data by email:", error);
    return null;
  }
}
