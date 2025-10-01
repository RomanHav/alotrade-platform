'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ThemeMode = 'light' | 'dark' | 'system';

export default function ThemeSettings({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (v: ThemeMode) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">Тема застосунку</h2>
      <Tabs value={value} onValueChange={(v) => onChange(v as ThemeMode)} className="w-xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="light">Світла</TabsTrigger>
          <TabsTrigger value="dark">Темна</TabsTrigger>
          <TabsTrigger value="system">За замовчуванням</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
