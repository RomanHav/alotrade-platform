'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeSettings from './ThemeSettings';
import ProfileSettings from './ProfileSettings';
import SearchEnginesSettings from './SearchEnginesSettings';
import UserAndRolesTable from './UsersTable/UsersAndRolesTable';
import { AddUserModalProvider } from './UsersTable/context';

type ThemeMode = 'light' | 'dark' | 'system';

type role = { role: string };

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
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(prefersDark);
    if (persist) localStorage.removeItem('theme');
  }

  window.dispatchEvent(new CustomEvent('themechange', { detail: { mode } }));
}

function readInitialTheme(): ThemeMode {
  const saved = (typeof window !== 'undefined' ? localStorage.getItem('theme') : null) as
    | 'light'
    | 'dark'
    | null;
  return saved === 'light' || saved === 'dark' ? saved : 'system';
}

type AvatarDraft = { file: File | null; reset: boolean };

async function uploadAvatar(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/profile/avatar', { method: 'PATCH', body: fd });
  if (!res.ok) throw new Error('Помилка завантаження фото');
  const data = (await res.json()) as { url: string };
  return data.url;
}

async function deleteAvatar(): Promise<string> {
  const res = await fetch('/api/profile/avatar', { method: 'DELETE' });
  if (!res.ok) throw new Error('Помилка видалення фото');
  const data = (await res.json()) as { url: string };
  return data.url;
}

export default function SettingsMain({ role }: { role: role }) {
  const defaultAvatar = process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE ?? '/avatar.jpg';

  const [mounted, setMounted] = useState(false);
  const [initialTheme, setInitialTheme] = useState<ThemeMode>('system');
  const [draftTheme, setDraftTheme] = useState<ThemeMode>('system');

  const [avatarInitialUrl, setAvatarInitialUrl] = useState<string>(defaultAvatar);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>(defaultAvatar);
  const [avatarDraft, setAvatarDraft] = useState<AvatarDraft>({ file: null, reset: false });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);

    const initTheme = readInitialTheme();
    setInitialTheme(initTheme);
    setDraftTheme(initTheme);
    applyTheme(initTheme, false);

    (async () => {
      try {
        const r = await fetch('/api/profile', { cache: 'no-store' });
        if (r.ok) {
          const data = (await r.json()) as { imageUrl?: string };
          const url = data.imageUrl || defaultAvatar;
          setAvatarInitialUrl(url);
          setAvatarPreviewUrl(url);
        } else {
          setAvatarInitialUrl(defaultAvatar);
          setAvatarPreviewUrl(defaultAvatar);
        }
      } catch {
        setAvatarInitialUrl(defaultAvatar);
        setAvatarPreviewUrl(defaultAvatar);
      }
    })();
  }, [defaultAvatar]);

  const themeDirty = mounted && draftTheme !== initialTheme;
  const avatarDirty = mounted && (avatarDraft.file !== null || avatarDraft.reset);
  const dirty = themeDirty || avatarDirty;

  const handleThemeChange = (m: ThemeMode) => {
    setDraftTheme(m);

    applyTheme(m, false);
  };

  const handleAvatarSelect = (file: File, localObjectUrl: string) => {
    setAvatarPreviewUrl(localObjectUrl);
    setAvatarDraft({ file, reset: false });
  };

  const handleAvatarReset = () => {
    setAvatarPreviewUrl(defaultAvatar);
    setAvatarDraft({ file: null, reset: true });
  };

  const onSave = async () => {
    try {
      setSaving(true);

      if (themeDirty) {
        applyTheme(draftTheme, true);
        setInitialTheme(draftTheme);
      }

      if (avatarDirty) {
        let newUrl = avatarPreviewUrl;
        if (avatarDraft.reset) {
          newUrl = await deleteAvatar();
        } else if (avatarDraft.file) {
          newUrl = await uploadAvatar(avatarDraft.file);
        }

        setAvatarInitialUrl(newUrl);
        setAvatarPreviewUrl(newUrl);
        setAvatarDraft({ file: null, reset: false });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AddUserModalProvider>
      <div className="px-4 pt-16">
        <div className="mb-9 flex items-center justify-between">
          <h1 className="text-4xl">Налаштування</h1>
          <Button
            onClick={onSave}
            disabled={!dirty || saving}
            className={dirty ? 'opacity-100' : 'opacity-50'}
          >
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <ThemeSettings value={draftTheme} onChange={handleThemeChange} />

          <ProfileSettings
            previewUrl={avatarPreviewUrl}
            onSelect={handleAvatarSelect}
            onReset={handleAvatarReset}
            defaultAvatar={defaultAvatar}
          />

          <SearchEnginesSettings />
          {role.role === 'ADMIN' && <UserAndRolesTable />}
        </div>
      </div>
    </AddUserModalProvider>
  );
}
