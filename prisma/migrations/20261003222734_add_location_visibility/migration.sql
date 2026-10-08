-- CreateEnum
CREATE TYPE "LocationVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'SHARED', 'Unlisted');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "account_type" TEXT DEFAULT 'public',
ADD COLUMN     "visibility" "LocationVisibility" NOT NULL DEFAULT 'PRIVATE';
