'use client';

type Range = 'day' | 'week' | 'month';

type Row = {
  name: string;
  role: string;
  desc: string;
  date: string;
  views: number;
};

function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}

export default function NewsStatsTable({ range }: { range: Range }) {
  const rows: Row[] =
    range === 'week'
      ? sample.slice(0, 7).map((r, i) => ({ ...r, views: r.views * 6 + i }))
      : range === 'month'
        ? sample.slice(0, 10).map((r, i) => ({ ...r, views: r.views * 20 + i }))
        : sample.slice(0, 7);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th className="py-2 pr-3 font-medium">Назва статті</th>
            <th className="px-3 py-2 font-medium">Дата</th>
            <th className="px-3 py-2 font-medium">Опис</th>
            <th className="py-2 pl-3 font-medium">Перегляди</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((r) => (
            <tr key={r.name + r.date}>
              <td className="py-3 pr-3">
                <div className="font-medium">{r.name}</div>
                {r.role && <div className="text-neutral-500">{r.role}</div>}
              </td>
              <td className="px-3 py-3 whitespace-nowrap tabular-nums">{r.date}</td>
              <td className="px-3 py-3 text-neutral-700 dark:text-neutral-300" title={r.desc}>
                {truncate(r.desc, 72)}
              </td>
              <td className="py-3 pl-3 tabular-nums">{r.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const sample: Row[] = [
  {
    name: 'Як змінилась логістика напоїв у 2025 році',
    role: 'Аналітика',
    desc: 'Детальний огляд нових логістичних маршрутів, впливу тарифів та інвойс-правил на імпорт алкоголю в Україні у 2025 році.',
    date: '2025-03-01',
    views: 112,
  },
  {
    name: 'Гайд: як обрати вино до риби',
    role: 'Блог сомельє',
    desc: 'Пояснюємо базові правила поєднань, розбираємо кислотність, тіло та аромат, наводимо 7 перевірених пар для популярних страв з рибою.',
    date: '2025-03-02',
    views: 98,
  },
  {
    name: 'Case study: реліз нового бренду ігристого',
    role: 'Кейс',
    desc: 'Як ми вивели на ринок нове ігристе вино: позиціювання, дегустаційні ноти, дизайн етикетки та перші результати кампанії.',
    date: '2025-03-02',
    views: 87,
  },
  {
    name: 'ПДВ для HoReCa: що змінилось',
    role: 'Фінанси',
    desc: 'Огляд актуальних ставок ПДВ та податкових пільг для HoReCa, приклади розрахунків і типові помилки під час оформлення накладних.',
    date: '2025-03-03',
    views: 80,
  },
  {
    name: 'Як читати етикетку вина за 30 секунд',
    role: 'Освіта',
    desc: 'Короткий чек-лист: апелясьйон, сорт, рік, виробник, алкоголюмісність, залишковий цукор. На що дивитись у першу чергу.',
    date: '2025-03-04',
    views: 75,
  },
  {
    name: 'Прогноз трендів: безалкогольні напої',
    role: 'Тренди',
    desc: 'Чому категорія no/low-alcohol зростає, які смаки заходять у барних мапах, і як адаптувати пропозицію під молодшу аудиторію.',
    date: '2025-03-04',
    views: 69,
  },
  {
    name: 'FAQ для менеджера з продажів алкоголю',
    role: 'Довідник',
    desc: 'Відповідаємо на часті запитання щодо ліцензій, акцизних марок, температури зберігання та повернення товару.',
    date: '2025-03-05',
    views: 63,
  },
  {
    name: 'Рітейл vs HoReCa: як розрізняти асортимент',
    role: 'Аналітика',
    desc: 'Пояснюємо різницю в SKU-матриці, ціноутворенні та промостратегіях для каналу роздріб та каналу HoReCa.',
    date: '2025-03-06',
    views: 55,
  },
  {
    name: 'Як зібрати дегустаційний сет для команди',
    role: 'Освіта',
    desc: 'Покроковий план: цілі, підбір зразків, склянки, температури, бланки оцінювання і як фіксувати зворотний зв’язок.',
    date: '2025-03-06',
    views: 50,
  },
  {
    name: 'UX-патерни для каталогу напоїв у CMS',
    role: 'Продакт',
    desc: 'Найзручніші фільтри, сортування, картки з дегустаційними нотами та як підсвітити в наявності/передзамовлення.',
    date: '2025-03-07',
    views: 44,
  },
];
