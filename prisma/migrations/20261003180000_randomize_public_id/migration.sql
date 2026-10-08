CREATE OR REPLACE FUNCTION generate_user_public_id()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
AS $$
DECLARE
  candidate TEXT;
  attempt INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(741923, 88712);

  FOR attempt IN 1..100 LOOP
    candidate := 'GEM@' || lpad(floor(random() * 100000000)::bigint::text, 8, '0');

    IF NOT EXISTS (
      SELECT 1 FROM "user" WHERE "publicId" = candidate
    ) THEN
      RETURN candidate;
    END IF;
  END LOOP;

  RAISE EXCEPTION 'Unable to allocate an unused 8-digit public ID';
END;
$$;

ALTER TABLE "user"
  ALTER COLUMN "publicId" SET DEFAULT generate_user_public_id();

ALTER TABLE "user"
  DROP CONSTRAINT "user_publicId_format_check";

DROP SEQUENCE "user_public_id_seq";

DO $$
DECLARE
  user_row RECORD;
BEGIN
  FOR user_row IN SELECT "id" FROM "user" ORDER BY "id" LOOP
    UPDATE "user"
    SET "publicId" = generate_user_public_id()
    WHERE "id" = user_row."id";
  END LOOP;
END;
$$;

ALTER TABLE "user"
  ADD CONSTRAINT "user_publicId_format_check"
  CHECK ("publicId" ~ '^GEM@[0-9]{8}$');