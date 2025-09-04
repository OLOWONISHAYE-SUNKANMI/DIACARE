import { useTranslation } from 'react-i18next';
import { X, FileText, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const LegalModal = ({ isOpen, onClose, type }: LegalModalProps) => {
  const { t } = useTranslation();

  const getContent = () => {
    if (type === 'terms') {
      return {
        icon: <FileText className="w-6 h-6" />,
        title: t('legal.termsTitle'),
        content: t('legal.termsContent')
      };
    } else {
      return {
        icon: <Shield className="w-6 h-6" />,
        title: t('legal.privacyTitle'),
        content: t('legal.privacyContent')
      };
    }
  };

  const { icon, title, content } = getContent();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="4xl" maxH="80vh" py={6} px={4}>
        <ModalHeader>
          <div className="flex items-center gap-2">
            {icon}
            {title}
          </div>
          <div className="text-muted-foreground text-sm">
            {type === 'terms' ? t('legal.termsDescription') : t('legal.privacyDescription')}
          </div>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ScrollArea className="h-[60vh] pr-4">
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </ScrollArea>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              {t('common.close')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};