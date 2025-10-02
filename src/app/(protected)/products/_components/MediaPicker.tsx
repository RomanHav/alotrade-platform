'use client';

import { useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, Star, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type MediaItem = {
  id: string;
  url: string;
  alt?: string | null;
  publicId?: string;
};

type Props = {
  value: MediaItem[];
  coverId?: string | null;

  imagesChangeAction: (items: MediaItem[]) => void;
  coverChangeAction: (id: string | null) => void;
};

export default function MediaPicker({
  value,
  coverId,
  imagesChangeAction,
  coverChangeAction,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const pick = () => inputRef.current?.click();


  const coverUrl = useMemo(
    () => (coverId ? (value.find((m) => m.id === coverId)?.url ?? null) : null),
    [value, coverId],
  );


  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added: MediaItem[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);

        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const json = await res.json();

        if (json?.ok && json?.media?.id && json?.media?.url) {
          added.push({
            id: json.media.id,
            url: json.media.url,
            alt: json.media.alt ?? null,
            publicId: json.cloudinary?.publicId,
          });
        }
      }
      if (!added.length) return;

      const next = [...value, ...added];
      imagesChangeAction(next);

      if (!coverId && added[0]) coverChangeAction(added[0].id);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async (m: MediaItem) => {
    const qs = new URLSearchParams();
    if (m.publicId) qs.set('public_id', m.publicId);
    qs.set('mediaId', m.id);

    try {
      await fetch(`/api/upload?${qs.toString()}`, { method: 'DELETE' });
    } catch {}

    const next = value.filter((x) => x.id !== m.id);
    imagesChangeAction(next);
    if (coverId === m.id) coverChangeAction(next[0]?.id ?? null);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = value.findIndex((i) => i.id === active.id);
    const newIndex = value.findIndex((i) => i.id === over.id);
    imagesChangeAction(arrayMove(value, oldIndex, newIndex));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">Медіафайли</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <Button size="sm" variant="secondary" onClick={pick} disabled={busy}>
          {busy ? 'Завантаження…' : '+ додати'}
        </Button>
      </div>

      {/* Обложка — рендерим только при валидном URL */}
      <div className="bg-muted aspect-[4/5] overflow-hidden rounded-xl border">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt=""
            width={800}
            height={1000}
            className="h-full w-full object-cover"
            unoptimized
            priority
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      {/* Миниатюры (Sortable) */}
      <div className="mt-3">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={value.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <ul className="grid grid-cols-1 gap-2">
              {value.map((m) => (
                <SortableThumb
                  key={m.id}
                  item={m}
                  isCover={coverId === m.id}
                  onMakeCover={() => coverChangeAction(m.id)}
                  onRemove={() => remove(m)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function SortableThumb({
  item,
  isCover,
  onMakeCover,
  onRemove,
}: {
  item: MediaItem;
  isCover: boolean;
  onMakeCover: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="relative overflow-hidden rounded-lg border bg-white dark:bg-neutral-900"
    >
      <div className="flex items-center gap-2 p-2">
        <button
          {...attributes}
          {...listeners}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
          title="Перетягнути"
          type="button"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="relative h-16 w-16 overflow-hidden rounded-md border">
          {item.url ? (
            <Image
              src={item.url}
              alt={item.alt ?? ''}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
              sizes="64px"
            />
          ) : (
            <div className="bg-muted h-full w-full" />
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="icon"
            variant={isCover ? 'default' : 'secondary'}
            className="h-8 w-8"
            onClick={onMakeCover}
            title="Зробити обкладинкою"
            type="button"
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            onClick={onRemove}
            title="Видалити"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}
