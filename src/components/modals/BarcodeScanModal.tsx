import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { X, Camera as CameraIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface BarcodeScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodSelected: (food: { name: string; carbs: number }) => void;
}

const BarcodeScanModal = ({
  isOpen,
  onClose,
  onFoodSelected,
}: BarcodeScanModalProps) => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [foodData, setFoodData] = useState<{
    name: string;
    carbs: number;
  } | null>(null);
  const { toast } = useToast();

  const startScan = async () => {
    try {
      setIsScanning(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: t('barcodeScanModal.camera_prompt_header'),
        promptLabelPhoto: t('barcodeScanModal.camera_prompt_photo'),
        promptLabelPicture: t('barcodeScanModal.camera_prompt_gallery'),
      });

      // Simuler l'analyse du code-barres
      const mockBarcode = '1234567890123';
      setScannedCode(mockBarcode);

      // Simuler la récupération des données nutritionnelles
      const mockFoodData = {
        name: t('barcodeScanModal.food_name_apple'),
        carbs: 15,
      };

      setFoodData(mockFoodData);

      toast({
        title: t('barcodeScanModal.barcode_scanned_title'),
        description: t('barcodeScanModal.barcode_scanned_description', {
          productName: mockFoodData.name,
        }),
      });
    } catch (error) {
      console.error(t('barcodeScanModal.scan_error_log'), error);
      toast({
        title: t('barcodeScanModal.barcode_scan_error_title'),
        description: t('barcodeScanModal.barcode_scan_error_description'),
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddFood = () => {
    if (foodData) {
      onFoodSelected(foodData);
      onClose();
      setScannedCode('');
      setFoodData(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent maxW="md" p={0}>
        <ModalHeader
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <span>{t('barcodeScanModal.scanner_modal_title')}</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-y-4">
            <Button
              onClick={startScan}
              disabled={isScanning}
              className="w-full flex items-center gap-2"
            >
              <CameraIcon className="w-4 h-4" />
              {isScanning
                ? t('barcodeScanModal.scanner_button_scanning')
                : t('barcodeScanModal.scanner_button_start')}
            </Button>
            {scannedCode && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <Label>{t('barcodeScanModal.scanner_detected_label')}</Label>
                <p className="font-mono text-sm">{scannedCode}</p>
              </div>
            )}

            {foodData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">
                  {t('barcodeScanModal.food_found_title')}
                </h3>
                <p className="text-sm mb-1">
                  <strong>{t('barcodeScanModal.food_name_label')}</strong>{' '}
                  {foodData.name}
                </p>
                <p className="text-sm mb-3">
                  <strong>{t('barcodeScanModal.food_carbs_label')}</strong>{' '}
                  {foodData.carbs}g
                </p>
                <Button onClick={handleAddFood} className="w-full" size="sm">
                  {t('barcodeScanModal.add_to_journal_button')}
                </Button>
              </div>
            )}
            <div className="pt-4 border-t">
              <Label htmlFor="manualCode">
                {t('barcodeScanModal.manual_code_label')}
              </Label>
              <Input
                id="manualCode"
                placeholder={t('barcodeScanModal.manual_code_placeholder')}
                value={scannedCode}
                onChange={e => setScannedCode(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BarcodeScanModal;
