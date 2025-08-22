import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, FileText, Shield } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>
            {type === 'terms' ? t('legal.termsDescription') : t('legal.privacyDescription')}
          </DialogDescription>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  );
};