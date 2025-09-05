import { getSheetData } from "@/server/sheet-data/get-sheet-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getSheetData();
    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao acessar Google Sheets" },
      { status: 500 },
    );
  }
}
