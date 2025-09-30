'use client';

import { Button } from '@/components/ui/button';
import UploadPhotoButton from '@/components/ui/UploadPhotoButton';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function ProfileSettings() {
  const defaultAvatar = process.env.NEXT_PUBLIC_DEFAULT_USER_IMAGE ?? '/avatar.jpg';

  const [preview, setPreview] = useState<string>(defaultAvatar);
  const lastObjectUrlRef = useRef<string | null>(null);

  async function handleSelect(file: File) {
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    const localUrl = URL.createObjectURL(file);
    lastObjectUrlRef.current = localUrl;
    setPreview(localUrl);
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
    setPreview(defaultAvatar);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">Профіль</h2>

      <div className="flex items-center gap-4">
        <div className="relative flex h-28 w-28 items-center overflow-hidden rounded-lg border border-neutral-200">
          <Image
            src={preview}
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

          <Button
            variant="destructive"
            size="sm"
            onClick={resetToDefault}
            className="cursor-pointer"
          >
            Видалити
          </Button>
        </div>
      </div>
    </div>
  );
}
