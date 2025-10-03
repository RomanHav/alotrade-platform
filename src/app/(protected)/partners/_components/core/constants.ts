export const COL_WIDTHS = {
  select: 48,
  image: 120,
  name: 260,
  link: 300,
  actions: 96,
} as const;

export const ukCollator = new Intl.Collator('uk', { sensitivity: 'base', ignorePunctuation: true });
