'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { EyeIcon } from 'lucide-react';
import Link from 'next/link';

const TrafficSourceCard = dynamic(() => import('./TrafficSourceCard'), { ssr: false });
const LanguageShareCard = dynamic(() => import('./LanguageShareCard'), { ssr: false });
const ProductPerUserCard = dynamic(() => import('./ProductPerUserCard'), { ssr: false });
const BrandTrendsCard = dynamic(() => import('./BrandTrendsCard'), { ssr: false });
const PopularProductsCard = dynamic(() => import('./PopularProductsCard'), { ssr: false });
const NewsStatsTable = dynamic(() => import('./NewsStatsTable'), { ssr: false });

type Range = 'day' | 'week' | 'month';

const ranges = [
  { label: 'День', value: 'day' },
  { label: 'Неділя', value: 'week' },
  { label: 'Місяць', value: 'month' },
];

type DashboardMainProps = {
  userName?: string;
};

export default function DashboardMain({ userName = 'користувачу' }: DashboardMainProps) {
  const [rangeTop, setRangeTop] = useState<Range>('day');
  const [rangeBrands, setRangeBrands] = useState<Range>('day');
  const [rangeProducts, setRangeProducts] = useState<Range>('day');
  const [rangeNews, setRangeNews] = useState<Range>('day');

  return (
    <div className="px-4 pt-16 md:px-8 2xl:px-10">
      <div className={'mb-8 flex items-center gap-5'}>
        <h1 className="text-4xl font-semibold md:text-4xl">Доброго дня, {userName}</h1>
        <Link href={'https://alcotrade.com.ua'} target={'_blank'} title="Переглянути сайт">
          <EyeIcon size={24} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CardSection title="Джерело трафіку" range={rangeTop} onRangeChange={setRangeTop}>
          <TrafficSourceCard range={rangeTop} />
        </CardSection>

        <CardSection title="Частка мов" range={rangeTop} onRangeChange={setRangeTop}>
          <LanguageShareCard range={rangeTop} />
        </CardSection>

        <CardSection title="Продукт / Користувач" range={rangeTop} onRangeChange={setRangeTop}>
          <ProductPerUserCard range={rangeTop} />
        </CardSection>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <CardSection
          className="lg:col-span-1"
          title="Тренди відвідування брендів"
          range={rangeBrands}
          onRangeChange={setRangeBrands}
        >
          <BrandTrendsCard range={rangeBrands} />
        </CardSection>

        <CardSection
          title="Популярні товари"
          range={rangeProducts}
          onRangeChange={setRangeProducts}
        >
          <PopularProductsCard range={rangeProducts} />
        </CardSection>
      </div>

      <div className="mt-6">
        <CardSection title="Статистика по новинам" range={rangeNews} onRangeChange={setRangeNews}>
          <NewsStatsTable range={rangeNews} />
        </CardSection>
      </div>
    </div>
  );
}

function CardSection({
  title,
  children,
  range,
  onRangeChange,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  range: Range;
  onRangeChange: (r: Range) => void;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-medium md:text-lg">{title}</h2>
        <RangeSelect value={range} onChange={onRangeChange} />
      </div>
      {children}
    </section>
  );
}

function RangeSelect({ value, onChange }: { value: Range; onChange: (v: Range) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
      {ranges.map((r) => (
        <button
          key={r.value}
          onClick={() => onChange(r.value as Range)}
          className={[
            'px-3 py-1 text-sm',
            value === r.value
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800',
          ].join(' ')}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
