import { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button as ChakraButton,
  useDisclosure,
} from '@chakra-ui/react';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file select
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // Save photo
  const handleSave = () => {
    onPhotoChange(preview);
    onClose();
  };

  // Remove photo
  const handleRemove = () => {
    setPreview(null);
    onPhotoChange(null);
    onClose();
  };

  return (
    <>
      <span onClick={onOpen} className="cursor-pointer">
        {children}
      </span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className="sm:max-w-md p-6">
          <ModalHeader>{t('photoUploadModal.profilePhoto.title')}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <p className="text-gray-600 mb-6">
              {t('photoUploadModal.profilePhoto.description')}
            </p>

            <div className="flex justify-center mb-6">
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
                  ref={fileInputRef}
                  className="hidden"
                />
                <ChakraButton
                  w="100%"
                  leftIcon={<Upload className="w-4 h-4" />}
                  onClick={handleButtonClick}
                >
                  {t('photoUploadModal.profilePhoto.choosePhoto')}
                </ChakraButton>
              </div>

              {preview && (
                <ChakraButton
                  variant="outline"
                  onClick={handleRemove}
                  w="100%"
                  leftIcon={<X className="w-4 h-4" />}
                >
                  {t('photoUploadModal.profilePhoto.removePhoto')}
                </ChakraButton>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="flex gap-2 w-full">
            <ChakraButton variant="outline" onClick={onClose} flex="1">
              {t('photoUploadModal.buttons.cancel')}
            </ChakraButton>
            <ChakraButton colorScheme="blue" onClick={handleSave} flex="1">
              {t('photoUploadModal.buttons.save')}
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PhotoUploadModal;
