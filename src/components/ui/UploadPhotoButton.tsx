'use client';
import { Plus } from 'lucide-react';

type UploadButtonPhotoProps = {
  handleButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function UploadButtonPhoto({
  handleButtonClick,
  handleFileChange,
  fileInputRef,
}: UploadButtonPhotoProps) {
  return (
    <div>
      <button
        onClick={handleButtonClick}
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-neutral-200 bg-white cursor-pointer"
      >
        <Plus className="h-6 w-6 stroke-neutral-800" />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
