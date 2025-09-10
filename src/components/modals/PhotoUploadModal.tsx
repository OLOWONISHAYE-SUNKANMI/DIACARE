import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

interface PhotoUploadModalProps {
  children: React.ReactNode;
  onPhotoChange: (photo: string | null) => void;
  currentPhoto?: string;
}

const PhotoUploadModal = ({
  children,
  onPhotoChange,
  currentPhoto,
}: PhotoUploadModalProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onPhotoChange(preview);
    setIsOpen(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoChange(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('photoUploadModal.profilePhoto.title')}</DialogTitle>
          <DialogDescription>
            {t('photoUploadModal.profilePhoto.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <Avatar className="w-32 h-32">
              {preview ? (
                <AvatarImage src={preview} alt="Preview" />
              ) : (
                <AvatarFallback className="text-2xl">
                  <Camera className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button asChild className="w-full">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {t('photoUploadModal.profilePhoto.choosePhoto')}
                  </span>
                </Button>
              </label>
            </div>

            {preview && (
              <Button
                variant="outline"
                onClick={handleRemove}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                {t('photoUploadModal.profilePhoto.removePhoto')}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              {t('photoUploadModal.buttons.cancel')}
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {t('photoUploadModal.buttons.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadModal;
