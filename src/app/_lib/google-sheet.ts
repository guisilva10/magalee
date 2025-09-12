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

export interface PatientData {
  userId: string;
  name: string;
  caloriesTarget: string; // Renomeado para maior clareza
  proteinTarget: string; // Renomeado para maior clareza
  email?: string;
  password?: string;
  meals: Meal[];
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
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // 1. Fetch user profile data

    const profileResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      // CORREÇÃO: O range foi estendido para 'A2:F' para incluir as colunas de email e senha.
      range: "Profile!A2:F",
    });

    const profileRows = profileResponse.data.values || [];
    // A busca agora funcionará, pois a coluna 5 (índice 4) está incluída no range.
    const userProfile = profileRows.find((row) => row[4] === email);

    if (!userProfile) {
      console.log("User not found in Profile sheet");
      return null;
    }

    const userId = userProfile[0]; // 2. Fetch all meals data

    const mealsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Meals!A2:G", // Range includes all meal columns
    });

    const mealRows = mealsResponse.data.values || []; // 3. Filter meals for the specific user

    const userMeals: Meal[] = mealRows
      .filter((row) => row[0] === userId) // Filter by User_ID
      .map((row) => ({
        date: row[1],
        description: row[2],
        calories: parseInt(row[3], 10) || 0,
        carbs: parseInt(row[4], 10) || 0,
        protein: parseInt(row[5], 10) || 0,
        fats: parseInt(row[6], 10) || 0,
      })); // 4. Return combined data

    return {
      userId: userProfile[0],
      name: userProfile[1],
      caloriesTarget: userProfile[2], // Renomeado
      proteinTarget: userProfile[3], // Renomeado
      email: userProfile[4],
      password: userProfile[5] || null,
      meals: userMeals,
    };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}
