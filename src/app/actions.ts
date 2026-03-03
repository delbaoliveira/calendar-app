"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const color = formData.get("color") as string;

  if (!title || !date) {
    return { error: "Title and date are required" };
  }

  const sql = getDb();
  await sql`INSERT INTO events (title, date, color) VALUES (${title}, ${date}, ${color || "#3b82f6"})`;
  revalidatePath("/");
}

export async function deleteEvent(id: number) {
  const sql = getDb();
  await sql`DELETE FROM events WHERE id = ${id}`;
  revalidatePath("/");
}
