import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { and, eq, gte, lt, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json({ error: "year and month are required" }, { status: 400 });
  }

  const startDate =`${year}-${month.padStart(2, "0")}-01`;
  const endDate =
    Number(month) === 12
      ? `${Number(year) + 1}-01-01`
      : `${year}-${String(Number(month) + 1).padStart(2, "0")}-01`;

  const result = await db
    .select({
      id: events.id,
      title: events.title,
      date: events.date,
      color: events.color,
    })
    .from(events)
    .where(
      and(
        eq(events.userId, userId),
        gte(events.date, startDate),
        lt(events.date, endDate)
      )
    )
    .orderBy(asc(events.date), asc(events.createdAt));

  return NextResponse.json(result);
}
