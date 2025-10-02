-- 1) дефолт для майбутніх вставок
ALTER TABLE "SiteSettings"
  ALTER COLUMN "titleSuffix" SET DEFAULT '| Alcotrade';

-- 2) оновити існуючі значення:
--    - там де NULL
--    - та, якщо раніше випадково стояло 'Alcotrade | ' — замінити на новий варіант
UPDATE "SiteSettings"
SET "titleSuffix" = '| Alcotrade'
WHERE "titleSuffix" IS NULL
   OR "titleSuffix" = 'Alcotrade | ';

-- 3) зробити NOT NULL (можеш пропустити, якщо вже NOT NULL)
ALTER TABLE "SiteSettings"
  ALTER COLUMN "titleSuffix" SET NOT NULL;

