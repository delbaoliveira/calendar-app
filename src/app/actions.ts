"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const date = formData.get("date") as string;
  const color = formData.get("color") as string;

  if (!title || !date) {
    return { error: "Title and date are required" };
  }

  await db.insert(events).values({
    userId,
    title,
    date,
    color: color || "#3b82f6",
  });

  revalidatePath("/");
}

export async function deleteEvent(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)));
  revalidatePath("/");
}
