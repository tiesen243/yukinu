CREATE TABLE "product_variant_combinations" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variant_groups" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_product_id_products_id_fk";
--> statement-breakpoint
DROP INDEX "product_variants_product_id_idx";--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "variant_group_id" varchar(24) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "code" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "extra_price" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "code" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variant_combinations" ADD CONSTRAINT "product_variant_combinations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variant_groups" ADD CONSTRAINT "product_variant_groups_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_variant_combinations_product_id_idx" ON "product_variant_combinations" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variant_groups_product_id_idx" ON "product_variant_groups" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variant_groups_name_idx" ON "product_variant_groups" USING btree ("name");--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_variant_group_id_product_variant_groups_id_fk" FOREIGN KEY ("variant_group_id") REFERENCES "public"."product_variant_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "product_variants_variant_group_id_idx" ON "product_variants" USING btree ("variant_group_id");--> statement-breakpoint
CREATE INDEX "product_variants_name_idx" ON "product_variants" USING btree ("name");--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "stock";