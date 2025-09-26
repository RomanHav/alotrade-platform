import { Button } from '@/components/ui/button';
import UploadButtonPhoto from '@/components/ui/UploadPhotoButton';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function ProfileSettings() {
  const avatar = '/avatar.jpg';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(avatar);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      console.log('Вибраний файл:', file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">Профіль</h2>
      <div className="flex items-center gap-4">
        <Image
          src={`${preview}`}
          alt="Avatar"
          width={96}
          height={96}
          className="rounded-lg border border-neutral-200"
        />
        <div className="flex flex-col gap-2.5">
          <span>Завантажити фото</span>
          <UploadButtonPhoto
            handleButtonClick={handleButtonClick}
            handleFileChange={handleFileChange}
            fileInputRef={fileInputRef}
          />
          <Button variant="destructive" size="sm" className='cursor-pointer'>
            Видалити
          </Button>
        </div>
      </div>
    </div>
  );
}
