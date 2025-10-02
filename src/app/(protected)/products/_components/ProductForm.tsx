// app/(protected)/products/_components/ProductForm.tsx
'use client';

import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // 👈 добавили useEffect
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
import MediaPicker, { type MediaItem } from './MediaPicker';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVE']),
  brandId: z.string(),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverId: z.string().nullable().optional(),
  variants: z.array(
    z.object({
      id: z.string().optional(),
      label: z.string().optional(),
      volumeMl: z.coerce.number().int().positive().optional(),
      position: z.number().int(),
    }),
  ),
});

type VariantForm = { id?: string; label?: string; volumeMl?: number; position: number };

type ProductFormData = {
  id?: string;
  name?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE';
  brandId?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  variants: VariantForm[];
  coverId?: string | null;
  images?: MediaItem[];
  /** новый фоллбек из сервера, если есть */
  coverFallbackUrl?: string | null;
};

export default function ProductForm({
  product,
  brands,
}: {
  product?: ProductFormData;
  brands: { id: string; name: string }[];
}) {
  const router = useRouter();

  const [data, setData] = useState<ProductFormData>(
    product ?? {
      status: 'DRAFT',
      variants: [{ position: 0 }, { position: 1 }, { position: 2 }],
      images: [],
      coverId: null,
    },
  );

  useEffect(() => {
    if (!data.images) return;
    const ok = data.images.some((m) => m.id === data.coverId);
    if (!ok) setData((d) => ({ ...d, coverId: d.images![0]?.id ?? null }));
  }, [data.images, data.coverId]);

  const save = async () => {
    const parsed = schema.parse({
      ...data,
      variants: data.variants ?? [],
      coverId: data.coverId ?? null,
    });

    const payload = {
      ...parsed,
      coverId: data.coverId ?? null,
      imageIds: (data.images ?? []).map((m) => m.id),
    };

    const res = await fetch('/api/products/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) router.push('/products');
  };

  const removeVariant = (idx: number) => {
    setData((d) => ({ ...d, variants: d.variants.filter((_, i) => i !== idx) }));
  };

  const addVariant = () => {
    setData((d) => ({ ...d, variants: [...d.variants, { position: d.variants.length }] }));
  };

  return (
    <div className="px-4 pt-4 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {product ? 'Редагувати продукт' : 'Новий продукт'}
        </h1>
        <div className="flex gap-2">
          {product && (
            <Button variant="outline" onClick={() => router.back()}>
              Відмінити
            </Button>
          )}
          <Button onClick={save}>Зберегти</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Левая колонка */}
        <Card className="space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Статус</label>
              <Select
                value={data.status}
                onValueChange={(v: ProductFormData['status']) => setData({ ...data, status: v })}
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
              <Select value={data.brandId} onValueChange={(v) => setData({ ...data, brandId: v })}>
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
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Опис продукту</label>
            <Textarea
              rows={6}
              value={data.description ?? ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Варіанти</div>
              <Button size="sm" variant="outline" onClick={addVariant}>
                Додати варіант
              </Button>
            </div>
            <div className="space-y-3">
              {data.variants.map((v, idx) => (
                <Card key={idx} className="p-3">
                  <div className="grid gap-3 md:grid-cols-5">
                    <Input
                      placeholder="Назва варіанту (0.5л)"
                      value={v.label ?? ''}
                      onChange={(e) => update(idx, { label: e.target.value })}
                      className="md:col-span-2"
                    />
                    <Input
                      type="number"
                      placeholder="Обʼєм, мл"
                      value={v.volumeMl ?? ''}
                      onChange={(e) => update(idx, { volumeMl: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => removeVariant(idx)}>
                      Видалити
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Налаштування в пошукових системах</div>
            <Input
              placeholder="Мета-заголовок"
              value={data.seoTitle ?? ''}
              onChange={(e) => setData({ ...data, seoTitle: e.target.value })}
            />
            <Textarea
              placeholder="Мета-опис"
              value={data.seoDescription ?? ''}
              onChange={(e) => setData({ ...data, seoDescription: e.target.value })}
            />
          </div>
        </Card>

        <Card className="space-y-3 p-4">
          <MediaPicker
            value={data.images ?? []}
            coverId={data.coverId ?? null}
            imagesChangeAction={(items) => setData({ ...data, images: items })}
            coverChangeAction={(id) => setData({ ...data, coverId: id })}
          />
        </Card>
      </div>
    </div>
  );

  function update(idx: number, patch: Partial<VariantForm>) {
    setData((d) => {
      const arr = [...d.variants];
      arr[idx] = { ...arr[idx], ...patch };
      return { ...d, variants: arr };
    });
  }
}
