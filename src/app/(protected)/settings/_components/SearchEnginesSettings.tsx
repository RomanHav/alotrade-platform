'use client';

import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  accept?: string;              
  maxSizeMb?: number;          
  onSelect?: (file: File, previewUrl: string) => void; 
};

export default function SearchEnginesSettings({
  className,
  accept = 'image/*',
  maxSizeMb = 10,
  onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const lastObjectUrlRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const openPicker = () => inputRef.current?.click();

  const revokeLast = () => {
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
  };

  useEffect(() => () => revokeLast(), []);

  const validateFile = (f: File) => {
    if (!f.type.startsWith('image/')) return 'Потрібне зображення (JPEG/PNG/WebP тощо)';
    if (f.size > maxSizeMb * 1024 * 1024) return `Файл завеликий (макс ${maxSizeMb} MB)`;
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0];

   
    e.currentTarget.value = '';
    if (!f) return;

    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }

    revokeLast();
    const url = URL.createObjectURL(f);
    lastObjectUrlRef.current = url;

    setPreviewUrl(url);
    setFileName(f.name);
    onSelect?.(f, url);
  };

  const cancelSelection = () => {
    revokeLast();
    setPreviewUrl(null);
    setFileName('');
    setError(null);
  };

 
  const uploadBoxBase =
    'relative flex w-[325px] h-[158px] flex-col items-center gap-4 rounded-md border border-dashed bg-transparent px-16 py-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 dark:focus:ring-neutral-700';
  const uploadBoxHover = 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60';

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">Налаштування у пошукових системах</h2>

      <div className="flex flex-col gap-2.5 bg-white p-2.5 dark:bg-neutral-800">
        <h3 className="text-xl text-[#0055FF] underline">Мета-заголовок</h3>
        <span className="text-sm text-[#B9B9B9]">https://alcotrade.com.ua/</span>
        <p className="text-base text-[#616161]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque enim ante, rutrum
          vel augue sit amet, pellentesque ultrices metus. Morbi quis condimentum purus. Etiam non
          lectus ante. Curabitur tincidunt ipsum nulla, ut consectetur metus cursus sed. Donec
          elementum a ipsum.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Label htmlFor="meta-title" className="text-xl">
          Змінити мета-заголовок
        </Label>
        <Input
          id="meta-title"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)} 
          type="text"
          placeholder="Заголовок сайту у пошукових системах"
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Label htmlFor="meta-description" className="text-xl">
          Змінити мета-опис
        </Label>
        <Textarea
          id="meta-description"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Опис сайту у пошукових системах"
          className="h-20 w-full resize-none"
        />
      </div>

      <div className={cn('flex flex-col gap-4', className)}>
        <Label htmlFor='meta-image' className="text-xl">Змінити мета-зображення</Label>

       
        <input id='meta-image' ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />

       
        {!previewUrl && (
          <button
            type="button"
            onClick={openPicker}
            className={cn(uploadBoxBase, uploadBoxHover, 'cursor-pointer')}
            aria-label="Завантажити мета-зображення"
            title="Завантажити файл"
          >
            <Plus className="inline h-16 w-16 stroke-neutral-300 stroke-1" />
            <span className="text-lg text-neutral-400">Завантажити файл</span>
          </button>
        )}

       
        {previewUrl && (
          <div className="flex items-center gap-6">
          
            <div className={cn(uploadBoxBase, 'overflow-hidden border-solid cursor-default')}>
              <Image
                src={previewUrl}
                alt="Meta image preview"
                fill
                sizes="325px"
                className="object-cover"
                unoptimized
              />
            </div>

      
            <div className="flex min-w-0 flex-col gap-2">
              <span className="truncate text-sm text-neutral-700 dark:text-neutral-200">
                {fileName}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openPicker}
                  className="cursor-pointer text-sm underline text-neutral-800 dark:text-neutral-200"
                >
                  Змінити
                </button>
                <button
                  type="button"
                  onClick={cancelSelection}
                  className="cursor-pointer text-sm underline text-red-600 dark:text-red-400"
                >
                  Скасувати вибір
                </button>
              </div>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Рекомендовано: 1080×1080 px, до {maxSizeMb}MB
              </p>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
