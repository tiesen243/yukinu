CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"priority" "ticket_priority" DEFAULT 'medium' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP VIEW IF EXISTS "public"."users_view";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'moderator', 'vendor_owner', 'vendor_staff', 'user');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
CREATE VIEW "public"."users_view" AS (select "users"."id", "users"."email", "users"."username", "users"."role", "users"."status", "profiles"."avatar_url" as "avatar_url" from "users" inner join "profiles" on "users"."id" = "profiles"."id");
ALTER TABLE "vendor_members" DROP COLUMN "role";--> statement-breakpoint
DROP TYPE "public"."vendor_role";
