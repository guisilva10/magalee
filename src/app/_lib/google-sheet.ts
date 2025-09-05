import { google } from "googleapis";

export async function getPatientData(name: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Profile!A2:D", // aba Profile
  });

  const rows = response.data.values || [];

  const user = rows.find((row) => row[1] === name);

  if (!user) return null;

  return {
    userId: user[0],
    name: user[1],
    calories: user[2],
    protein: user[3],
  };
}
