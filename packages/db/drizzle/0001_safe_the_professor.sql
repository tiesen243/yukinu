ALTER TABLE "products" DROP CONSTRAINT "products_vendor_id_vendors_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "vendor_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_rating_check" CHECK ("product_reviews"."rating" >= 1 AND "product_reviews"."rating" <= 5);