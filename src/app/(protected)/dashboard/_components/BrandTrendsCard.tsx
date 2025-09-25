'use client';

import { Eye, Boxes } from 'lucide-react';
import { useMemo } from 'react';
import MedalOne from '@/components/icons/MedalOne';

type Range = 'day' | 'week' | 'month';

type Row = { name: string; views: number };

export default function BrandTrendsCard({ range }: { range: Range }) {
  const rows: Row[] = useMemo(() => {
    if (range === 'week')
      return [
        { name: 'Brand 1', views: 2600 },
        { name: 'Brand 2', views: 1710 },
        { name: 'Brand 3', views: 980 },
        { name: 'Brand 4', views: 420 },
        { name: 'Brand 5', views: 310 },
        { name: 'Brand 6', views: 210 },
      ];
    if (range === 'month')
      return [
        { name: 'Brand 1', views: 8200 },
        { name: 'Brand 2', views: 5630 },
        { name: 'Brand 3', views: 3210 },
        { name: 'Brand 4', views: 1890 },
        { name: 'Brand 5', views: 1120 },
        { name: 'Brand 6', views: 760 },
      ];
    return [
      { name: 'Brand 1', views: 500 },
      { name: 'Brand 2', views: 320 },
      { name: 'Brand 3', views: 140 },
      { name: 'Brand 4', views: 45 },
      { name: 'Brand 5', views: 32 },
      { name: 'Brand 6', views: 25 },
    ];
  }, [range]);

  return (
    <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {rows.map((r, index) => (
        <li key={r.name} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            {index === 0 ? <MedalOne /> : <Boxes className={'h-4 w-4 text-neutral-900'} />}
            <span className="font-medium">{r.name}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Eye className="h-4 w-4" />
            <span className="tabular-nums">{r.views}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
