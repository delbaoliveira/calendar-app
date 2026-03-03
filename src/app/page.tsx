import { ensureSchema } from "@/lib/db";
import Calendar from "./calendar";

export const dynamic = "force-dynamic";

export default async function Home() {
  await ensureSchema();
  return <Calendar />;
}
