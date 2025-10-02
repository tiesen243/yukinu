CREATE TABLE "whishlist_items" (
	"user_id" varchar(24) NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whishlist_items_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "whishlist_items" ADD CONSTRAINT "whishlist_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whishlist_items_user_id_idx" ON "whishlist_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "whishlist_items_product_id_idx" ON "whishlist_items" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "whishlist_items_user_product_unique_idx" ON "whishlist_items" USING btree ("user_id","product_id");