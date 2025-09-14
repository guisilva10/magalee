import { getSheetData } from "@/server/sheet-data/get-sheet-data";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Nome não fornecido" }, { status: 400 });
  }

  const data = await getSheetData();
  const user = data.find((row: any) => row.Nome === name);

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json(user);
}
