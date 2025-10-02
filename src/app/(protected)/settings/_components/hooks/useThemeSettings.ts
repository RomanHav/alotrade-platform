'use client';

import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

function applyTheme(mode: ThemeMode, persist: boolean) {
  const html = document.documentElement;
  const setDark = (v: boolean) => html.classList.toggle('dark', v);

  if (mode === 'light') {
    setDark(false);
    if (persist) localStorage.setItem('theme', 'light');
  } else if (mode === 'dark') {
    setDark(true);
    if (persist) localStorage.setItem('theme', 'dark');
  } else {
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(!!prefersDark);
    if (persist) localStorage.removeItem('theme');
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
  }
}

function readInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
  return saved === 'light' || saved === 'dark' ? saved : 'system';
}

export function useThemeSettings() {
  const [mounted, setMounted] = useState(false);
  const [initial, setInitial] = useState<ThemeMode>('system');
  const [draft, setDraftState] = useState<ThemeMode>('system');

  useEffect(() => {
    setMounted(true);
    const init = readInitialTheme();
    setInitial(init);
    setDraftState(init);
    applyTheme(init, false);
  }, []);

  const dirty = mounted && draft !== initial;

  const setDraft = (mode: ThemeMode) => {
    setDraftState(mode);
    applyTheme(mode, false);
  };

  const save = async () => {
    if (!dirty) return;
    applyTheme(draft, true);
    setInitial(draft);
  };

  return { draft, setDraft, dirty, save };
}
