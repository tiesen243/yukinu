ALTER TABLE "vendors" ADD COLUMN "owner_id" varchar(24) NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "image_url" varchar(512);--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;