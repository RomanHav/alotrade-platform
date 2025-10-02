'use client';

import { useEffect } from 'react';
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
import MediaPicker from './MediaPicker';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  hydrateFromServer,
  setField,
  addVariant,
  removeVariant,
  updateVariant,
} from '@/store/slices/productFormSlice';
import type { ProductFormState } from '@/store/slices/productFormSlice';
import type { ProductStatus } from '@prisma/client';

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
      variants: data.variants.map((v) => ({
        id: v.id,
        label: v.label ?? null,
        volumeMl: v.volumeMl ?? null,
        position: v.position,
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
              <Button size="sm" variant="outline" onClick={() => dispatch(addVariant())}>
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
                      onChange={(e) =>
                        dispatch(updateVariant({ index: idx, patch: { label: e.target.value } }))
                      }
                      className="md:col-span-2"
                    />
                    <Input
                      type="number"
                      placeholder="Обʼєм, мл"
                      value={v.volumeMl ?? ''}
                      onChange={(e) =>
                        dispatch(
                          updateVariant({
                            index: idx,
                            patch: { volumeMl: Number(e.target.value || 0) },
                          }),
                        )
                      }
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => dispatch(removeVariant(idx))}>
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
