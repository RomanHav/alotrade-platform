-- 1) дефолт для майбутніх вставок
ALTER TABLE "SiteSettings"
  ALTER COLUMN "titleSuffix" SET DEFAULT 'Alcotrade | ';

-- 2) заповнити існуючі NULL
UPDATE "SiteSettings"
SET "titleSuffix" = 'Alcotrade | '
WHERE "titleSuffix" IS NULL;

-- 3) зробити NOT NULL
ALTER TABLE "SiteSettings"
  ALTER COLUMN "titleSuffix" SET NOT NULL;
