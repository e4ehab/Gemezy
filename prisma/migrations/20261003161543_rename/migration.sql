-- AlterTable
ALTER TABLE "user" ALTER COLUMN "publicId" SET DEFAULT ('GEM@'::text || nextval('user_public_id_seq'::regclass)::text);
