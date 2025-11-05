ALTER TABLE "vendor_members" DROP CONSTRAINT "vendor_members_vendor_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "vendor_members" ADD COLUMN "id" varchar(24) PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "vendor_members_vendor_id_user_id_key" ON "vendor_members" USING btree ("vendor_id","user_id");--> statement-breakpoint
CREATE INDEX "vendor_members_vendor_id_idx" ON "vendor_members" USING btree ("vendor_id");