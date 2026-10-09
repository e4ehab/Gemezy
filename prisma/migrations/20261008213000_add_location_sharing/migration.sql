ALTER TABLE "saved_location"
ADD COLUMN "shareId" TEXT,
ADD COLUMN "visibility" "LocationVisibility" NOT NULL DEFAULT 'PRIVATE';

UPDATE "saved_location"
SET "shareId" = replace(gen_random_uuid()::text, '-', '')
WHERE "shareId" IS NULL;

ALTER TABLE "saved_location"
ALTER COLUMN "shareId" SET NOT NULL;

CREATE UNIQUE INDEX "saved_location_shareId_key" ON "saved_location"("shareId");
