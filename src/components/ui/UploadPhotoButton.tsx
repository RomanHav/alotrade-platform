'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  onFileSelected: (file: File) => void;
  className?: string;
  accept?: string;
  children?: React.ReactNode;
};

export default function UploadPhotoButton({
  onFileSelected,
  className,
  accept = 'image/*',
  children = 'Обрати файл',
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden cursor-pointer"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelected(f);
          e.currentTarget.value = '';
        }}
      />
      <button type="button" className='cursor-pointer underline text-base font-thin' onClick={() => inputRef.current?.click()}>
        {children}
      </button>
    </div>
  );
}
