import { prisma } from '@/lib/prisma';

/** Транслит UA→Latin (ГОСТ-like, без діакритики) */
function translitUaToLatin(input: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    ґ: 'g',
    д: 'd',
    е: 'e',
    є: 'ie',
    ж: 'zh',
    з: 'z',
    и: 'y',
    і: 'i',
    ї: 'i',
    й: 'i',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ь: '',
    ю: 'iu',
    я: 'ia',
    А: 'a',
    Б: 'b',
    В: 'v',
    Г: 'h',
    Ґ: 'g',
    Д: 'd',
    Е: 'e',
    Є: 'ie',
    Ж: 'zh',
    З: 'z',
    И: 'y',
    І: 'i',
    Ї: 'i',
    Й: 'i',
    К: 'k',
    Л: 'l',
    М: 'm',
    Н: 'n',
    О: 'o',
    П: 'p',
    Р: 'r',
    С: 's',
    Т: 't',
    У: 'u',
    Ф: 'f',
    Х: 'kh',
    Ц: 'ts',
    Ч: 'ch',
    Ш: 'sh',
    Щ: 'sch',
    Ь: '',
    Ю: 'iu',
    Я: 'ia',
    '’': '',
    "'": '',
    ʼ: '',
  };
  return input
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('');
}

/** Базова нормалізація у slug */
function normalizeToSlug(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // залишаємо латиницю/цифри/-/пробіли
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Згенерувати унікальний slug для продукту.
 * @param name - назва (UA або будь-якою мовою)
 * @param excludeId - виключити id при перевірці (для update)
 */
export async function slug(name: string, excludeId?: string): Promise<string> {
  const latin = translitUaToLatin(name);
  const base = normalizeToSlug(latin) || 'product';
  let slug = base;
  let i = 1;

  // якщо є excludeId — не вважаємо поточний запис колізією
  // (корисно при оновленні назви того ж продукту)
  // тут while-цикл робить інкрементальні -2, -3, ...
  // оптимізується індексом @@unique(slug)
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
