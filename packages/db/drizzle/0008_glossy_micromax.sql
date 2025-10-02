CREATE TABLE "wishlist_items" (
	"user_id" varchar(24) NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wishlist_items_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
DROP TABLE "whishlist_items" CASCADE;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whishlist_items_user_id_idx" ON "wishlist_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "whishlist_items_product_id_idx" ON "wishlist_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "whishlist_items_user_product_unique_idx" ON "wishlist_items" USING btree ("user_id","product_id");