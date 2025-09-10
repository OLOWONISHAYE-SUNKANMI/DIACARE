import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  X,
  Camera as CameraIcon,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface PhotoAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodAnalyzed: (food: {
    name: string;
    carbs: number;
    analysis: string;
  }) => void;
}

const PhotoAnalysisModal = ({
  isOpen,
  onClose,
  onFoodAnalyzed,
}: PhotoAnalysisModalProps) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    carbs: number;
    analysis: string;
  } | null>(null);
  const { toast } = useToast();

  const takePicture = async (source: CameraSource) => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: source,
        promptLabelHeader: t('photoAnalysisModal.camera.mealPhotoHeader'),
        promptLabelPhoto: t('photoAnalysisModal.camera.takePhoto'),
        promptLabelPicture: t('photoAnalysisModal.camera.chooseFromGallery'),
      });

      if (image.dataUrl) {
        setSelectedImage(image.dataUrl);
        toast({
          title: t('photoAnalysisModal.toast.photoCaptured'),
          description: t('photoAnalysisModal.toast.photoCapturedDescription'),
        });
      }
    } catch (error) {
      console.error(t('photoAnalysisModal.console.photoCaptureError'), error);

      toast({
        title: t('photoAnalysisModal.toast.error'),
        description: t('photoAnalysisModal.toast.photoCaptureFailed'),
        variant: 'destructive',
      });
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Appel à l'edge function pour analyser l'image avec OpenAI GPT-4 Vision
      const { data, error } = await supabase.functions.invoke(
        'analyze-food-image',
        {
          body: {
            image: selectedImage,
            prompt: t('photoAnalysisModal.ai.analyzeFoodPrompt'),
          },
        }
      );

      if (error) throw error;

      // Pour la démo, utilisons des données simulées
      const mockResult = {
        name: t('photoAnalysisModal.ai.mockResult.name'),
        carbs: 45,
        analysis: t('photoAnalysisModal.ai.mockResult.analysis'),
      };

      setAnalysisResult(mockResult);
      toast({
        title: t('photoAnalysisModal.toast.analysisComplete'),
        description: t('photoAnalysisModal.toast.analysisCompleteDescription'),
      });
    } catch (error) {
      console.error(t('photoAnalysisModal.console.analysisError'), error);
      toast({
        title: t('photoAnalysisModal.toast.error'),
        description: t('photoAnalysisModal.toast.analysisFailed'),
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddFood = () => {
    if (analysisResult) {
      onFoodAnalyzed(analysisResult);
      onClose();
      setSelectedImage(null);
      setAnalysisResult(null);
    }
  };

  const resetModal = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
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
          <span>{t('photoAnalysisModal.modal.header')}</span>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-y-4">
            {!selectedImage ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  {t('photoAnalysisModal.modal.instructions')}
                </p>
                <Button
                  onClick={() => takePicture(CameraSource.Camera)}
                  className="w-full flex items-center gap-2"
                >
                  <CameraIcon className="w-4 h-4" />
                  {t('photoAnalysisModal.modal.takePhoto')}
                </Button>
                <Button
                  onClick={() => takePicture(CameraSource.Photos)}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  {t('photoAnalysisModal.modal.chooseFromGallery')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Repas à analyser"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetModal}
                    className="absolute top-2 right-2"
                  >
                    {t('photoAnalysisModal.modal.change')}
                  </Button>
                </div>
                {!analysisResult && (
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('photoAnalysisModal.modal.analyzing')}
                      </>
                    ) : (
                      <>{t('photoAnalysisModal.modal.analyzeAI')}</>
                    )}
                  </Button>
                )}
                {analysisResult && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-3">
                      {t('photoAnalysisModal.modal.analysisResult')}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>
                          {t('photoAnalysisModal.modal.dishIdentified')}
                        </strong>{' '}
                        {analysisResult.name}
                      </p>
                      <p>
                        <strong>
                          {t('photoAnalysisModal.modal.estimatedCarbs')}
                        </strong>{' '}
                        {analysisResult.carbs}g
                      </p>
                      <p>
                        <strong>
                          {t('photoAnalysisModal.modal.analysis')}
                        </strong>{' '}
                        {analysisResult.analysis}
                      </p>
                    </div>
                    <Button
                      onClick={handleAddFood}
                      className="w-full mt-4"
                      size="sm"
                    >
                      {t('photoAnalysisModal.modal.addToJournal')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PhotoAnalysisModal;
