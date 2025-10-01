'use client';

import { Button } from '@/components/ui/button';
import UploadPhotoButton from '@/components/ui/UploadPhotoButton';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function ProfileSettings({
  previewUrl,
  onSelect,
  onReset,
  defaultAvatar,
}: {
  previewUrl: string;
  onSelect: (file: File, localObjectUrl: string) => void;
  onReset: () => void;
  defaultAvatar: string;
}) {
  const lastObjectUrlRef = useRef<string | null>(null);

  async function handleSelect(file: File) {
    
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    const localUrl = URL.createObjectURL(file);
    lastObjectUrlRef.current = localUrl;
    onSelect(file, localUrl); 
  }

  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
      }
    };
  }, []);

  const resetToDefault = () => {
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    onReset();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">Профіль</h2>

      <div className="flex items-center gap-4">
        <div className="relative flex h-28 w-28 items-center overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Image
            src={previewUrl || defaultAvatar}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="112px"
            unoptimized
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <span>Завантажити фото</span>

          <UploadPhotoButton onFileSelected={handleSelect}>Змінити</UploadPhotoButton>

          <Button variant="destructive" size="sm" onClick={resetToDefault} className="cursor-pointer">
            Видалити
          </Button>
        </div>
      </div>
    </div>
  );
}
