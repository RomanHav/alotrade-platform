// useSeoSettings.ts
'use client';

import { useEffect, useState } from 'react';

type SeoState = {
  title: string;
  description: string;
  imageUrl: string | null;
};

type SiteSettingsDto = {
  defaultSeoTitle?: string | null;
  defaultSeoDescription?: string | null;
  ogImageUrl?: string | null;
};

async function getSiteSettings(): Promise<SeoState> {
  const r = await fetch('/api/site-settings', { cache: 'no-store' });
  if (!r.ok) return { title: '', description: '', imageUrl: null };
  const j = (await r.json()) as { settings?: SiteSettingsDto | null };
  const s = j.settings ?? null;
  return {
    title: s?.defaultSeoTitle ?? '',
    description: s?.defaultSeoDescription ?? '',
    imageUrl: s?.ogImageUrl ?? null,
  };
}

export function useSeoSettings() {
  const [current, setCurrent] = useState<SeoState>({ title: '', description: '', imageUrl: null });

 
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [touchedTitle, setTouchedTitle] = useState(false);
  const [touchedDescription, setTouchedDescription] = useState(false);

  
  const [file, setFile] = useState<File | null>(null);
  const [removeOg, setRemoveOg] = useState(false); 

  useEffect(() => {
    (async () => {
      try {
        const s = await getSiteSettings();
        setCurrent(s);
        setFile(null);
        setRemoveOg(false);
        setTouchedTitle(false);
        setTouchedDescription(false);
      } catch {}
    })();
  }, []);

  
  const dirtyText =
    (touchedTitle ? draftTitle !== current.title : false) ||
    (touchedDescription ? draftDescription !== current.description : false);
  const dirty = dirtyText || file !== null || removeOg;

 
  const valid = !(removeOg && file === null);

  const setTitle = (v: string) => {
    if (!touchedTitle) setTouchedTitle(true);
    setDraftTitle(v);
  };
  const setDescription = (v: string) => {
    if (!touchedDescription) setTouchedDescription(true);
    setDraftDescription(v);
  };

  
  const selectImage = (f: File) => {
    setFile(f);
    setRemoveOg(false);
  };


  const clearImage = () => {
    setFile(null);
    setRemoveOg(true); 
    setCurrent((s) => ({ ...s, imageUrl: null }));
  };

  const save = async () => {
    if (!dirty || !valid) return;

    const fd = new FormData();
    if (touchedTitle) fd.append('defaultSeoTitle', draftTitle || '');
    if (touchedDescription) fd.append('defaultSeoDescription', draftDescription || '');
    if (file) {
      fd.append('ogImage', file);
    } else if (removeOg) {
      fd.append('removeOg', '1');
    }

    const r = await fetch('/api/site-settings', { method: 'PATCH', body: fd });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error((j as { error?: string }).error ?? 'Не вдалося зберегти налаштування SEO');
    }

    const { settings } = (await r.json()) as { settings: SiteSettingsDto };
    const saved: SeoState = {
      title: settings.defaultSeoTitle ?? '',
      description: settings.defaultSeoDescription ?? '',
      imageUrl: settings.ogImageUrl ?? null,
    };

    setCurrent(saved);
    setFile(null);
    setRemoveOg(false);

  
    resetTextOnly();
  };

  const resetTextOnly = () => {
    setDraftTitle('');
    setDraftDescription('');
    setTouchedTitle(false);
    setTouchedDescription(false);
  };

  return {
    current, 
    draft: {
      title: draftTitle,
      description: draftDescription,
      imageUrl: current.imageUrl,
    },
    setTitle,
    setDescription,
    selectImage,
    clearImage,
    dirty,
    valid,
    save,
    resetTextOnly,
  };
}
