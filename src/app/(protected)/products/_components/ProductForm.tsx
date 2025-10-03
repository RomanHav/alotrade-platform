// app/(protected)/products/_components/ProductForm.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

import MediaPicker from './MediaPicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  hydrateFromServer,
  setField,
  removeVariant,
  setVariantsFromValues,
  setVariantImage,
  clearVariantImage,
} from '@/store/slices/productFormSlice';
import type { ProductFormState } from '@/store/slices/productFormSlice';
import type { ProductStatus } from '@prisma/client';

/* -------------------- helper: upload one file to /api/upload -------------------- */
async function uploadOne(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await fetch('/api/upload', { method: 'POST', body: fd });
  const j = (await r.json()) as
    | {
        ok: true;
        media: { id: string; url: string; alt?: string | null };
        cloudinary?: { publicId?: string };
      }
    | { ok: false; error?: string };

  if ('ok' in j && j.ok && j.media?.id && j.media?.url) {
    return {
      id: j.media.id as string,
      url: j.media.url as string,
      publicId: j.cloudinary?.publicId as string | undefined,
    };
  }
  throw new Error('Upload failed');
}

/* =========================================================================================
   ProductForm
========================================================================================= */
export default function ProductForm({
  serverProduct,
  brands,
}: {
  serverProduct?: Partial<ProductFormState>;
  brands: { id: string; name: string }[];
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.productForm);

  useEffect(() => {
    dispatch(hydrateFromServer(serverProduct ?? {}));
  }, [dispatch, serverProduct?.id]);

  // редактор открыт, когда вариантов нет; иначе закрыт
  const [editorOpen, setEditorOpen] = useState<boolean>(true);
  useEffect(() => {
    setEditorOpen((data.variants?.length ?? 0) === 0);
  }, [data.variants.length]);

  const save = async () => {
    if (!data.name || !data.brandId) return;

    const payload = {
      id: data.id,
      name: data.name,
      status: data.status as ProductStatus,
      brandId: data.brandId,
      description: data.description ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      coverId: data.coverId ?? null,
      imageIds: data.images.map((m) => m.id),
      variants: data.variants.map((v, i) => ({
        id: v.id,
        label: v.label ?? null,
        volumeMl: v.volumeMl ?? null,
        position: i, // позиция из текущего порядка
        imageId: v.imageId ?? null,
      })),
    };

    const res = await fetch('/api/products/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) router.push('/products');
  };

  return (
    <div className="px-4 pt-4 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {data.id ? 'Редагувати продукт' : 'Новий продукт'}
        </h1>
        <div className="flex gap-2">
          {data.id && (
            <Button variant="outline" onClick={() => router.back()}>
              Відмінити
            </Button>
          )}
          <Button onClick={save}>Зберегти</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Статус</label>
              <Select
                value={data.status}
                onValueChange={(v: ProductFormState['status']) =>
                  dispatch(setField({ key: 'status', value: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Активний</SelectItem>
                  <SelectItem value="DRAFT">Чорновик</SelectItem>
                  <SelectItem value="ARCHIVE">Архів</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Бренд</label>
              <Select
                value={data.brandId}
                onValueChange={(v) => dispatch(setField({ key: 'brandId', value: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть бренд" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Заголовок</label>
            <Input
              value={data.name ?? ''}
              onChange={(e) => dispatch(setField({ key: 'name', value: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Опис продукту</label>
            <Textarea
              rows={6}
              value={data.description ?? ''}
              onChange={(e) => dispatch(setField({ key: 'description', value: e.target.value }))}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Варіанти</div>
              {!editorOpen && data.variants.length > 0 && (
                <Button size="sm" variant="outline" onClick={() => setEditorOpen(true)}>
                  Змінити
                </Button>
              )}
            </div>
            <VariantsSection
              editorOpen={editorOpen}
              openEditor={() => setEditorOpen(true)}
              closeEditor={() => setEditorOpen(false)}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Налаштування в пошукових системах</div>
            <Input
              placeholder="Мета-заголовок"
              value={data.seoTitle ?? ''}
              onChange={(e) => dispatch(setField({ key: 'seoTitle', value: e.target.value }))}
            />
            <Textarea
              placeholder="Мета-опис"
              value={data.seoDescription ?? ''}
              onChange={(e) => dispatch(setField({ key: 'seoDescription', value: e.target.value }))}
            />
          </div>
        </Card>

        <Card className="space-y-3 p-4">
          <MediaPicker />
        </Card>
      </div>
    </div>
  );
}

/* =========================================================================================
   Внутренние компоненты
========================================================================================= */

/** Секция вариантов: «пусто» → редактор → список карточек */
function VariantsSection({
  editorOpen,
  openEditor,
  closeEditor,
}: {
  editorOpen: boolean;
  openEditor: () => void;
  closeEditor: () => void;
}) {
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.productForm);

  if (!editorOpen && data.variants.length === 0) {
    return (
      <div className="rounded-xl border p-3">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">Варіанти не додані</div>
          <Button size="sm" onClick={openEditor}>
            Додати варіант
          </Button>
        </div>
      </div>
    );
  }

  if (editorOpen) {
    return (
      <OptionEditor
        defaultName="Обʼєм"
        defaultValues={data.variants.map((v) => v.label ?? '').filter(Boolean)}
        onCancel={closeEditor}
        onSave={(name, values) => {
          dispatch(setVariantsFromValues({ optionName: name, values }));
          closeEditor();
        }}
      />
    );
  }

  // chips + список карточек
  return (
    <div className="rounded-xl border">
      <div className="flex items-center justify-between p-3">
        <div>
          <div className="text-sm font-medium">Обʼєм</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.variants.map((v, i) => (
              <span
                key={`${v.position}-${v.label ?? ''}-${i}`}
                className="rounded-full border px-2 py-0.5 text-xs"
              >
                {v.label}
              </span>
            ))}
          </div>
        </div>
        <Button variant="ghost" onClick={openEditor}>
          Змінити
        </Button>
      </div>

      <div className="space-y-3 border-t p-3">
        {data.variants.map((v, idx) => (
          <VariantCard
            key={`${v.position}-${v.label ?? ''}-${idx}`}
            idx={idx}
            productName={data.name ?? 'Назва продукту'}
            valueLabel={v.label ?? ''}
            imageUrl={v.imageUrl ?? null}
            onPick={async (file) => {
              const media = await uploadOne(file);
              dispatch(setVariantImage({ index: idx, media }));
            }}
            onRemoveImage={() => dispatch(clearVariantImage(idx))}
            onRemove={() => dispatch(removeVariant(idx))}
          />
        ))}
      </div>
    </div>
  );
}

/** Редактор опции «как в Shopify»: одно имя + токены значений (Enter или , чтобы добавить) */
function OptionEditor({
  defaultName = 'Обʼєм',
  defaultValues = [],
  onCancel,
  onSave,
}: {
  defaultName?: string;
  defaultValues?: string[];
  onCancel: () => void;
  onSave: (optionName: string, values: string[]) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [tokens, setTokens] = useState<string[]>(
    defaultValues.map((v) => v.trim()).filter(Boolean),
  );
  const [input, setInput] = useState('');

  const addToken = (raw: string) => {
    const val = raw.trim();
    if (!val) return;
    if (tokens.includes(val)) return;
    setTokens((t) => [...t, val]);
  };

  const removeToken = (i: number) => {
    setTokens((t) => t.filter((_, idx) => idx !== i));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addToken(input);
      setInput('');
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    const parts = text
      .split(/,|\n|;/g)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) {
      e.preventDefault();
      setTokens((t) => {
        const next = [...t];
        for (const p of parts) if (!next.includes(p)) next.push(p);
        return next;
      });
    }
  };

  const save = () => {
    const filtered = tokens.map((v) => v.trim()).filter(Boolean);
    if (filtered.length === 0) return onCancel();
    onSave(name.trim() || 'Варіант', filtered);
  };

  return (
    <div className="bg-muted/40 rounded-xl border p-3">
      <div className="mb-2 text-sm font-medium">Варіант</div>
      <Input
        className="mb-3"
        placeholder="Назва варіанту"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="mb-2 text-sm font-medium">Значення варіанту</div>
      <div className="rounded-lg border p-2">
        <div className="mb-2 flex flex-wrap gap-2">
          {tokens.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
            >
              {t}
              <button
                type="button"
                onClick={() => removeToken(i)}
                className="text-muted-foreground hover:text-foreground ml-1"
                title="Видалити"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Input
          placeholder="Введіть значення і натисніть Enter або ,"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <div className="text-muted-foreground mt-1 text-xs">
          Підтримується вставка переліку через кому або з нового рядка.
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Відмінити
        </Button>
        <Button onClick={save}>Зберегти</Button>
      </div>
    </div>
  );
}

/** Карточка варианта (зображення + назва продукту + значення) */
function VariantCard({
  idx,
  productName,
  valueLabel,
  imageUrl,
  onPick,
  onRemoveImage,
  onRemove,
}: {
  idx: number;
  productName: string;
  valueLabel: string;
  imageUrl: string | null;
  onPick: (file: File) => Promise<void>;
  onRemoveImage: () => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const pick = () => fileRef.current?.click();

  return (
    <div className="rounded-lg border p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={pick}
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border"
            title="додати"
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">＋</span>
            )}
          </button>
          <div>
            <div className="font-medium">{productName}</div>
            <div className="text-muted-foreground text-sm">{valueLabel}</div>
          </div>
        </div>

        <Button variant="ghost" onClick={onRemove} title="Видалити">
          ×
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          await onPick(f);
          if (fileRef.current) fileRef.current.value = '';
        }}
      />

      {imageUrl && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onRemoveImage}>
            Прибрати фото
          </Button>
        </div>
      )}
    </div>
  );
}
