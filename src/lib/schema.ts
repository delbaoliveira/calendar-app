import { pgTable, serial, text, date, timestamp, index } from "drizzle-orm/pg-core";

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    date: date("date").notNull(),
    color: text("color").notNull().default("#3b82f6"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("events_user_date_idx").on(table.userId, table.date)]
);
