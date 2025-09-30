'use client';

import { useState } from 'react';
import { z } from 'zod';
import { BrandStatus } from '@prisma/client';
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

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVE']),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverId: z.string().optional(),
});

type BrandFormData = z.infer<typeof schema>;
type ProductLite = { id: string; name: string; status: 'ACTIVE' | 'DRAFT' | 'ARCHIVE' };

export default function BrandForm({
  brand,
  products,
}: {
  brand?: Partial<BrandFormData>;
  products: ProductLite[];
}) {
  const [data, setData] = useState<BrandFormData>({
    id: brand?.id,
    name: brand?.name ?? '',
    status: (brand?.status as BrandFormData['status']) ?? 'DRAFT',
    description: brand?.description ?? '',
    seoTitle: brand?.seoTitle ?? '',
    seoDescription: brand?.seoDescription ?? '',
    coverId: brand?.coverId,
  });

  const save = async () => {
    const payload = schema.parse(data);
    const res = await fetch('/api/brands/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) window.location.href = '/brands';
  };

  return (
    <div className="px-4 pt-4 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.id ? 'Редагувати бренд' : 'Новий бренд'}</h1>
        <div className="flex gap-2">
          {data.id && (
            <Button variant="outline" onClick={() => history.back()}>
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
                onValueChange={(v: BrandStatus) => setData({ ...data, status: v })}
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
            <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>

          <div>
            <label className="mb-1 block text-sm">Опис бренду</label>
            <Textarea
              rows={6}
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Продукти</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => (window.location.href = '/products/new')}
              >
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
              value={data.seoTitle}
              onChange={(e) => setData({ ...data, seoTitle: e.target.value })}
            />
            <Textarea
              placeholder="Мета-опис"
              value={data.seoDescription}
              onChange={(e) => setData({ ...data, seoDescription: e.target.value })}
            />
          </div>
        </Card>

        <Card className="space-y-3 p-4">
          <div className="text-sm font-medium">Медіафайли</div>
          <div className="bg-muted aspect-[4/5] rounded-xl border" />
          <Badge variant="secondary" className="mt-2">
            + додати
          </Badge>
        </Card>
      </div>
    </div>
  );
}
