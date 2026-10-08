CREATE SEQUENCE "user_account_id_seq"
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 99999999
  NO CYCLE;

ALTER TABLE "user" ADD COLUMN "accountId" TEXT;
ALTER SEQUENCE "user_account_id_seq" OWNED BY "user"."accountId";

UPDATE "user"
SET "accountId" = 'GEM@' || nextval('"user_account_id_seq"')::text;

ALTER TABLE "user"
  ALTER COLUMN "accountId" SET DEFAULT ('GEM@' || nextval('"user_account_id_seq"'::regclass)::text),
  ALTER COLUMN "accountId" SET NOT NULL;

CREATE UNIQUE INDEX "user_accountId_key" ON "user"("accountId");

ALTER TABLE "user"
  ADD CONSTRAINT "user_accountId_format_check"
  CHECK ("accountId" ~ '^GEM@[0-9]{1,8}$');