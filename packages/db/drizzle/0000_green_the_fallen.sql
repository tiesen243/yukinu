CREATE TYPE "public"."role" AS ENUM('admin', 'seller', 'user');--> statement-breakpoint
CREATE TABLE "account" (
	"provider" varchar(255) NOT NULL,
	"account_id" varchar(255) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"password" varchar(255),
	CONSTRAINT "account_provider_account_id_pk" PRIMARY KEY("provider","account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"user_id" varchar(24) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_index" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_index" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_username_index" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "users_role_index" ON "users" USING btree ("role");