CREATE TABLE "vendor_collection_items" (
	"collection_id" varchar(24) NOT NULL,
	"product_id" varchar(24) NOT NULL,
	CONSTRAINT "vendor_collection_items_collection_id_product_id_pk" PRIMARY KEY("collection_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "vendor_collections" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"vendor_id" varchar(24) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vendor_collection_items" ADD CONSTRAINT "vendor_collection_items_collection_id_vendor_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."vendor_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_collection_items" ADD CONSTRAINT "vendor_collection_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_collections" ADD CONSTRAINT "vendor_collections_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vendor_collection_items_collection_id_idx" ON "vendor_collection_items" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "vendor_collection_items_product_id_idx" ON "vendor_collection_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "vendor_collections_vendor_id_idx" ON "vendor_collections" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_collections_name_idx" ON "vendor_collections" USING btree ("name");