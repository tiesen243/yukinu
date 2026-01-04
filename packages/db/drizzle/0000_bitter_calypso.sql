CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'shipped', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('bank_transfer', 'cash_on_delivery');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'vendor_owner', 'vendor_staff', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('pending', 'approved', 'suspended');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"account_id" varchar(100) NOT NULL,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"recipient_name" varchar(255) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"street" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attributes" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"url" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"parent_id" varchar(24),
	"name" varchar(100) NOT NULL,
	"description" text,
	"image" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"vendor_id" varchar(24),
	"product_id" varchar(24),
	"product_variant_id" varchar(24),
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"note" text,
	"is_completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orders_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"user_id" varchar(24),
	"address_id" varchar(24),
	"voucher_id" varchar(24),
	"total_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"method" "payment_method" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"method_reference" varchar(255),
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_attributes" (
	"product_id" varchar(24) NOT NULL,
	"attribute_id" varchar(24) NOT NULL,
	"value" varchar(255) NOT NULL,
	CONSTRAINT "product_attributes_product_id_attribute_id_pk" PRIMARY KEY("product_id","attribute_id")
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"url" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"sku" varchar(100) NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"vendor_id" varchar(24),
	"category_id" varchar(24),
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"sold" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"full_name" varchar(255),
	"bio" text,
	"gender" varchar(50),
	"date_of_birth" date
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"token" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"payment_id" varchar(24) NOT NULL,
	"gateway" varchar(100) NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"amount_in" numeric(20, 2) DEFAULT '0.00' NOT NULL,
	"amount_out" numeric(20, 2) DEFAULT '0.00' NOT NULL,
	"transaction_content" text,
	"reference_number" varchar(255),
	"body" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"username" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"image" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "variant_options" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "variant_options_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1000 CACHE 1),
	"variant_id" varchar(24) NOT NULL,
	"value" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_balances" (
	"vendor_id" varchar(24) NOT NULL,
	"balance" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendor_balances_vendor_id_pk" PRIMARY KEY("vendor_id")
);
--> statement-breakpoint
CREATE TABLE "vendor_staffs" (
	"vendor_id" varchar(24) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendor_staffs_vendor_id_user_id_pk" PRIMARY KEY("vendor_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "vendor_transfers" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"vendor_id" varchar(24) NOT NULL,
	"reference" varchar(100) NOT NULL,
	"amount_in" numeric(10, 2),
	"amount_out" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"owner_id" varchar(24),
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(500),
	"address" varchar(500),
	"contact" varchar(100),
	"payout_bank_name" varchar(50),
	"payout_account_name" varchar(255),
	"payout_account_number" varchar(100),
	"status" "vendor_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"token" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"type" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_amount" numeric(10, 2),
	"discount_percentage" integer,
	"expiry_date" timestamp NOT NULL,
	CONSTRAINT "vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"product_id" varchar(24) NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_variant_id_product_variants_id_fk" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_balances" ADD CONSTRAINT "vendor_balances_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_staffs" ADD CONSTRAINT "vendor_staffs_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_staffs" ADD CONSTRAINT "vendor_staffs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_transfers" ADD CONSTRAINT "vendor_transfers_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_provider_account_id_uq_idx" ON "accounts" USING btree ("provider","account_id");--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "addresses_user_id_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attributes_name_idx" ON "attributes" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_items_vendor_id_idx" ON "order_items" USING btree ("vendor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_order_product_uq_idx" ON "order_items" USING btree ("order_id","product_id") WHERE "order_items"."product_variant_id" is null;--> statement-breakpoint
CREATE UNIQUE INDEX "order_items_order_product_variant_uq_idx" ON "order_items" USING btree ("order_id","product_variant_id") WHERE "order_items"."product_variant_id" is not null;--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "product_attributes_product_id_idx" ON "product_attributes" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_attributes_attribute_id_idx" ON "product_attributes" USING btree ("attribute_id");--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_reviews_product_id_idx" ON "product_reviews" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_product_id_idx" ON "product_variants" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_variants_product_id_sku_idx" ON "product_variants" USING btree ("product_id","sku");--> statement-breakpoint
CREATE INDEX "products_vendor_id_idx" ON "products" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "products_category_id_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_id_token_uq_idx" ON "sessions" USING btree ("id","token");--> statement-breakpoint
CREATE INDEX "tickets_user_id_idx" ON "tickets" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_reference_number_uq_idx" ON "transactions" USING btree ("reference_number");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "variant_options_variant_id_idx" ON "variant_options" USING btree ("variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "variant_options_variant_id_value_idx" ON "variant_options" USING btree ("variant_id","value");--> statement-breakpoint
CREATE UNIQUE INDEX "variants_name_idx" ON "variants" USING btree ("name");--> statement-breakpoint
CREATE INDEX "vendor_balances_vendor_id_idx" ON "vendor_balances" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_staffs_vendor_id_idx" ON "vendor_staffs" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendor_transactions_vendor_id_idx" ON "vendor_transfers" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "vendors_owner_id_idx" ON "vendors" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "verifications_user_id_idx" ON "verifications" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vouchers_code_uq_idx" ON "vouchers" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "wishlist_items_user_product_uq_idx" ON "wishlist_items" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE INDEX "wishlist_items_user_id_idx" ON "wishlist_items" USING btree ("user_id");