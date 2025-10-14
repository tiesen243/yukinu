ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_product_id_variant_id_pk";--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "id" varchar(24) PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "order_items_variant_id_idx" ON "order_items" USING btree ("variant_id");