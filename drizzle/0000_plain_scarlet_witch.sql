CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"date" date NOT NULL,
	"color" text DEFAULT '#3b82f6' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "events_user_date_idx" ON "events" USING btree ("user_id","date");