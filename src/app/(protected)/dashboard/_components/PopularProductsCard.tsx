'use client';

type Range = 'day' | 'week' | 'month';
type Row = { product: string; views: number };

export default function PopularProductsCard({ range }: { range: Range }) {
  const rows: Row[] =
    range === 'week'
      ? [
          { product: 'Product 1', views: 640 },
          { product: 'Product 2', views: 210 },
          { product: 'Product 3', views: 90 },
        ]
      : range === 'month'
        ? [
            { product: 'Product 1', views: 2410 },
            { product: 'Product 2', views: 980 },
            { product: 'Product 3', views: 310 },
          ]
        : [
            { product: 'Product 1', views: 115 },
            { product: 'Product 2', views: 20 },
            { product: 'Product 3', views: 5 },
          ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th className="py-2 pr-3 font-medium">Назва продукту</th>
            <th className="px-3 py-2 font-medium">Перегляди</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((r) => (
            <tr key={r.product}>
              <td className="py-2 pr-3">{r.product}</td>
              <td className="px-3 py-2 tabular-nums">{r.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
