ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "profiles_user_id_idx";--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "user_id";--> statement-breakpoint
CREATE VIEW "public"."users_view" AS (select "users"."id", "users"."email", "users"."username", "users"."role", "profiles"."avatar_url" as "avatar_url" from "users" left join "profiles" on "profiles"."id" = "users"."id" where "users"."status" = 'active');