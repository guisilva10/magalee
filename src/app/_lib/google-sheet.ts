import { google } from "googleapis";

// Define interfaces for our data structures
export interface Meal {
  date: string;
  description: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

// NOVO: Interface para os registros de água
export interface WaterLog {
  date: string;
  amount_ml: number;
}

export interface PatientData {
  userId: string;
  name: string;
  caloriesTarget: string;
  proteinTarget: string;
  email?: string;
  password?: string;
  meals: Meal[];
  waterLogs: WaterLog[]; // NOVO: Adicionado campo para os registros de água
}

export async function getPatientData(
  email: string,
): Promise<PatientData | null> {
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

    // 1. Fetch user profile data
    const profileResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Profile!A2:F",
    });

    const profileRows = profileResponse.data.values || [];
    const userProfile = profileRows.find((row) => row[4] === email);

    if (!userProfile) {
      console.log("User not found in Profile sheet");
      return null;
    }

    const userId = userProfile[0];

    // 2. Fetch all meals data
    const mealsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Meals!A2:G", // Range includes all meal columns
    });

    const mealRows = mealsResponse.data.values || [];

    // 3. Filter meals for the specific user
    const userMeals: Meal[] = mealRows
      .filter((row) => row[0] === userId) // Filter by User_ID
      .map((row) => ({
        date: row[1],
        description: row[2],
        calories: parseInt(row[3], 10) || 0,
        carbs: parseInt(row[4], 10) || 0,
        protein: parseInt(row[5], 10) || 0,
        fats: parseInt(row[6], 10) || 0,
      }));

    // NOVO: 4. Fetch all water data
    const waterResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Water!A2:C", // Range para a aba "Water" (User_ID, Date, Water_ml)
    });

    const waterRows = waterResponse.data.values || [];

    // NOVO: 5. Filter water logs for the specific user
    const userWaterLogs: WaterLog[] = waterRows
      .filter((row) => row[0] === userId) // Filtra pelo mesmo User_ID
      .map((row) => ({
        date: row[1],
        amount_ml: parseInt(row[2], 10) || 0, // Converte a coluna C (Water_ml) para número
      }));

    // 6. Return combined data
    return {
      userId: userProfile[0],
      name: userProfile[1],
      caloriesTarget: userProfile[2],
      proteinTarget: userProfile[3],
      email: userProfile[4],
      password: userProfile[5] || null,
      meals: userMeals,
      waterLogs: userWaterLogs, // NOVO: Adiciona os dados de água ao retorno
    };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}
