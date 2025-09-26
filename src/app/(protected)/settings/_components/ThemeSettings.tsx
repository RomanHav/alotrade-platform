'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect } from 'react';

export default function ThemeSettings() {
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme');

      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('system');
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">Тема застосунку</h2>
      <Tabs
        value={theme}
        onValueChange={(val) => setTheme(val as 'light' | 'dark' | 'system')}
        className="w-1/2"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="light">Світла</TabsTrigger>
          <TabsTrigger value="dark">Темна</TabsTrigger>
          <TabsTrigger value="system">За замовчуванням</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
