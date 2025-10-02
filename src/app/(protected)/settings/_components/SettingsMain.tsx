'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import ThemeSettings from './settings-sections/ThemeSettings';
import ProfileSettings from './settings-sections/ProfileSettings';
import SearchEnginesSettings from './settings-sections/SearchEnginesSettings';
import UserAndRolesTable from './UsersTable/UsersAndRolesTable';
import { AddUserModalProvider } from './UsersTable/context';

import { useThemeSettings } from './hooks/useThemeSettings';
import { useAvatarSettings } from './hooks/useAvatarSettings';
import { useSeoSettings } from './hooks/useSeoSettings';

type RoleProp = { role: string };
type SettingsProp = {
  defaultSeoTitle?: string | null;
  defaultSeoDescription?: string | null;
  titleSuffix?: string | null;
};

export default function SettingsMain({ role, seoSettings }: { role: RoleProp; seoSettings: SettingsProp }) {
  const defaultAvatar = process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE ?? '/avatar.jpg';

  const theme = useThemeSettings();
  const avatar = useAvatarSettings(defaultAvatar);
  const seo = useSeoSettings();

  const [saving, setSaving] = useState(false);
  const dirty = theme.dirty || avatar.dirty || seo.dirty;
  const formValid = seo.valid;

  const onSave = async () => {
    setSaving(true);
    try {
      await theme.save();
      await avatar.save();
      await seo.save();
      seo.resetTextOnly();
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
            disabled={!dirty || saving || !formValid}
            className={`${dirty && formValid ? 'opacity-100' : 'opacity-50'} cursor-pointer`}
          >
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <ThemeSettings value={theme.draft} onChange={theme.setDraft} />

          <ProfileSettings
            previewUrl={avatar.previewUrl}
            onSelect={avatar.onSelect}
            onReset={avatar.onReset}
            defaultAvatar={defaultAvatar}
          />

          <SearchEnginesSettings
            seoSettings={seoSettings}
            className=""
            valueTitle={seo.draft.title}
            onChangeTitle={seo.setTitle}
            valueDescription={seo.draft.description}
            onChangeDescription={seo.setDescription}
            initialImageUrl={seo.current.imageUrl}
            onSelect={(file) => seo.selectImage(file)}
            onClear={() => seo.clearImage()}
          />

          {role.role === 'ADMIN' && <UserAndRolesTable />}
        </div>
      </div>
    </AddUserModalProvider>
  );
}
