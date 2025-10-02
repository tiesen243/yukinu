CREATE TYPE "public"."order_status" AS ENUM('new', 'pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"order_id" varchar(24) NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"variant_id" varchar(24) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24),
	"shipping_address_id" varchar(24),
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "categories_parent_id_index";--> statement-breakpoint
DROP INDEX "categories_name_index";--> statement-breakpoint
DROP INDEX "addresses_user_id_index";--> statement-breakpoint
DROP INDEX "profiles_user_id_index";--> statement-breakpoint
DROP INDEX "profiles_full_name_index";--> statement-breakpoint
DROP INDEX "account_user_id_index";--> statement-breakpoint
DROP INDEX "session_user_id_index";--> statement-breakpoint
DROP INDEX "users_email_index";--> statement-breakpoint
DROP INDEX "users_username_index";--> statement-breakpoint
DROP INDEX "users_role_index";--> statement-breakpoint
DROP INDEX "users_status_index";--> statement-breakpoint
DROP INDEX "vendor_users_user_id_index";--> statement-breakpoint
DROP INDEX "vendors_name_index";--> statement-breakpoint
DROP INDEX "vendors_status_index";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "gender" varchar(50);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_vendor_id_idx" ON "products" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "addresses_user_id_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profiles_user_id_idx" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profiles_full_name_idx" ON "profiles" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vendor_users_user_id_idx" ON "vendor_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vendors_name_idx" ON "vendors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "vendors_status_idx" ON "vendors" USING btree ("status");