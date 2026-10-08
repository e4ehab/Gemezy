-- AlterTable
ALTER TABLE "user" ALTER COLUMN "accountId" SET DEFAULT ('GEM@'::text || nextval('user_account_id_seq'::regclass)::text);
