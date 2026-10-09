-- AlterTable
ALTER TABLE "saved_location" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
