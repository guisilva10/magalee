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

export interface Alarm {
  date: string;
  reminderText: string;
  fixedTime: string | null;
  frequencyMinutes: number | null;
  status: string;
  lastSent: string | null;
  uniqueId: string;
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
  height: number;
  weight: number;
  imc: number;
  weightTarget: number;
  age: number;
  imgTarget: number;
  carbsTarget: string;
  fatTarget: string;
  email?: string;
  password?: string;
  meals: Meal[];
  waterLogs: WaterLog[];
  alarms: Alarm[];
  createdAt: string;
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
      range: "Profile!A2:O",
    });

    const profileRows = profileResponse.data.values || [];
    const userProfile = profileRows.find((row) => row[2] === email);

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
        protein: parseInt(row[4], 10) || 0,
        carbs: parseInt(row[5], 10) || 0,
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

    const alarmsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Alarms!A2:H", // Range para a aba "Alarms"
    });

    const alarmRows = alarmsResponse.data.values || [];

    // NOVO: 7. Filter alarms for the specific user
    const userAlarms: Alarm[] = alarmRows
      .filter((row) => row[0] === userId) // Filtra pelo mesmo User_ID
      .map((row) => ({
        date: row[1],
        reminderText: row[2],
        fixedTime: row[3] || null, // Coluna D (Horario_Fixo)
        frequencyMinutes: parseFloat(row[4]) || null, // Coluna E (Frequencia_Horas)
        status: row[5], // Coluna F (Status)
        lastSent: row[6] || null, // Coluna G (Ultimo_Envio)
        uniqueId: row[7], // Coluna H (Unique_ID)
      }));

    return {
      userId: userProfile[0], // Coluna A
      name: userProfile[1], // Coluna B
      email: userProfile[2], // Coluna C
      weightTarget: userProfile[3],
      height: userProfile[4],
      age: userProfile[5],
      imgTarget: userProfile[6],
      caloriesTarget: userProfile[7], // Coluna H
      proteinTarget: userProfile[8], // Coluna I
      carbsTarget: userProfile[9],
      fatTarget: userProfile[10],
      password: userProfile[11] || null, // Coluna L
      createdAt: userProfile[12],
      weight: userProfile[13],
      imc: userProfile[14],
      meals: userMeals,
      waterLogs: userWaterLogs,
      alarms: userAlarms,
    };
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}
