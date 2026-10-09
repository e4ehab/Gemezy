-- AlterTable
ALTER TABLE "saved_location" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
