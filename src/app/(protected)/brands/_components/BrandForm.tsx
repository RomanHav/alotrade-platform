'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
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
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hydrateFromServer, setField } from '@/store/slices/brandFormSlice';
import BrandMediaPicker from './BrandMediaPicker';
import type { BrandFormState } from '@/store/slices/brandFormSlice';
import type { BrandStatus } from '@prisma/client';

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVE']),
  description: z.string().optional(),
  seoTitle: z.string().max(60).nullable().optional(),
  seoDescription: z.string().max(160).nullable().optional(),
  coverId: z.string().nullable().optional(),
});

type ProductLite = { id: string; name: string; status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE' };

export default function BrandForm({
  serverBrand,
  products,
}: {
  serverBrand?: Partial<BrandFormState>;
  products: ProductLite[];
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const data = useAppSelector((s) => s.brandForm);

  useEffect(() => {
    dispatch(hydrateFromServer(serverBrand ?? {}));
  }, [dispatch, serverBrand?.id]);

  const save = async () => {
    const parsed = schema.parse({
      id: data.id,
      name: data.name ?? '',
      status: data.status,
      description: data.description ?? '',
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      coverId: data.coverId ?? null,
    });

    const res = await fetch('/api/brands/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    if (res.ok) router.push('/brands');
  };

  return (
    <div className="px-4 pt-4 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.id ? 'Редагувати бренд' : 'Новий бренд'}</h1>
        <div className="flex gap-2">
          {data.id && (
            <Button variant="outline" onClick={() => router.back()}>
              Відмінити
            </Button>
          )}
          <Button onClick={save}>Зберегти</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Статус</label>
              <Select
                value={data.status}
                onValueChange={(v: BrandFormState['status']) =>
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
          </div>

          <div>
            <label className="mb-1 block text-sm">Заголовок</label>
            <Input
              value={data.name ?? ''}
              onChange={(e) => dispatch(setField({ key: 'name', value: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Опис бренду</label>
            <Textarea
              rows={6}
              value={data.description ?? ''}
              onChange={(e) => dispatch(setField({ key: 'description', value: e.target.value }))}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Продукти</div>
              <Button size="sm" variant="outline" onClick={() => router.push('/products/new')}>
                Додати продукт
              </Button>
            </div>
            <div className="rounded-lg border">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b p-3 last:border-b-0"
                >
                  <div className="truncate">{p.name}</div>
                  <Badge variant="secondary">
                    {p.status === 'ACTIVE'
                      ? 'Активний'
                      : p.status === 'DRAFT'
                        ? 'Чорновик'
                        : 'Архів'}
                  </Badge>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-muted-foreground p-3 text-sm">Немає продуктів</div>
              )}
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

        <Card className="space-y-2 p-4">
          <BrandMediaPicker />
        </Card>
      </div>
    </div>
  );
}
