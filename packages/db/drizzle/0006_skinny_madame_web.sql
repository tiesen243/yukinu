ALTER TABLE "accounts" DROP CONSTRAINT "accounts_provider_account_id_pk";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "id" varchar(24) PRIMARY KEY NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_id_idx" ON "accounts" USING btree ("provider","account_id");