ALTER TABLE "user" RENAME COLUMN "accountId" TO "publicId";
ALTER INDEX "user_accountId_key" RENAME TO "user_publicId_key";
ALTER TABLE "user"
  RENAME CONSTRAINT "user_accountId_format_check" TO "user_publicId_format_check";
ALTER SEQUENCE "user_account_id_seq" RENAME TO "user_public_id_seq";