ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "profiles_user_id_idx";--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "user_id";--> statement-breakpoint
CREATE VIEW "public"."user_view" AS (select "users"."id", "users"."username", "users"."email", "users"."role", "profiles"."avatar_url" from "users" inner join "profiles" on "users"."id" = "profiles"."id" where "users"."status" = 'active');