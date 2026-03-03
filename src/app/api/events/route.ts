import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json({ error: "year and month are required" }, { status: 400 });
  }

  const sql = getDb();
  const startDate = `${year}-${month.padStart(2, "0")}-01`;
  const endDate =
    Number(month) === 12
      ? `${Number(year) + 1}-01-01`
      : `${year}-${String(Number(month) + 1).padStart(2, "0")}-01`;

  const events = await sql`
    SELECT id, title, date, color
    FROM events
    WHERE date >= ${startDate}::date AND date < ${endDate}::date
    ORDER BY date, created_at
  `;

  return NextResponse.json(events);
}
