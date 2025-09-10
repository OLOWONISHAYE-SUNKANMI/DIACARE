import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface SimpleMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleMedicationModal = ({
  isOpen,
  onClose,
}: SimpleMedicationModalProps) => {
  const { t } = useTranslation();
  const [medication, setMedication] = useState('');
  const [dose, setDose] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!medication || !dose) {
      toast({
        title: t('simpleMedicationModal.toast.errorTitle'),
        description: t('simpleMedicationModal.toast.errorFillFields'),
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: t('simpleMedicationModal.toast.medicationSavedTitle'),
      description: t('simpleMedicationModal.toast.medicationSavedDesc', {
        medication,
        dose,
      }),
    });

    setMedication('');
    setDose('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal - Simple top positioning */}
      <div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-6 shadow-2xl w-full max-w-md"
        style={{ top: '120px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('simpleMedicationModal.medication.recordHeader')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medication">
              {t('simpleMedicationModal.medication.typeLabel')}
            </Label>
            <Select value={medication} onValueChange={setMedication}>
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={t(
                    'simpleMedicationModal.medication.placeholder'
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fast-insulin">
                  {t('simpleMedicationModal.medication.options.fastInsulin')}
                </SelectItem>
                <SelectItem value="slow-insulin">
                  {t('simpleMedicationModal.medication.options.slowInsulin')}
                </SelectItem>
                <SelectItem value="metformine">
                  {t('simpleMedicationModal.medication.options.metformin')}
                </SelectItem>
                <SelectItem value="autre">
                  {t('simpleMedicationModal.medication.options.other')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Label htmlFor="dose">{t('simpleMedicationModal.dose.label')}</Label>
          <Input
            id="dose"
            type="number"
            value={dose}
            onChange={e => setDose(e.target.value)}
            placeholder={t('simpleMedicationModal.dose.placeholder')}
            className="mt-1"
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('simpleMedicationModal.buttons.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('simpleMedicationModal.buttons.confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleMedicationModal;
