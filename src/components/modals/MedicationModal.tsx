import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedicationModal = ({ isOpen, onClose }: MedicationModalProps) => {
  const { t } = useTranslation();
  console.log('MedicationModal render - isOpen:', isOpen);
  const [medicationType, setMedicationType] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [injectionSite, setInjectionSite] = useState('');
  const [injectionDone, setInjectionDone] = useState(false);
  const { toast } = useToast();

  const medicationOptions = [
    {
      value: 'lantus',
      label: t('medicationModal.medication.options.lantus'),
      unit: t('medicationModal.medication.units.ui'),
    },
    {
      value: 'humalog',
      label: t('medicationModal.medication.options.humalog'),
      unit: t('medicationModal.medication.units.ui'),
    },
    {
      value: 'novorapid',
      label: t('medicationModal.medication.options.novorapid'),
      unit: t('medicationModal.medication.units.ui'),
    },
    {
      value: 'metformine',
      label: t('medicationModal.medication.options.metformine'),
      unit: t('medicationModal.medication.units.mg'),
    },
    {
      value: 'other',
      label: t('medicationModal.medication.options.other'),
      unit: t('medicationModal.medication.units.mg'),
    },
  ];

  const injectionSites = [
    {
      value: 'arm',
      label: t('medicationModal.medication.sites.arm'),
      emoji: '💪',
    },
    {
      value: 'thigh',
      label: t('medicationModal.medication.sites.thigh'),
      emoji: '🦵',
    },
    {
      value: 'abdomen',
      label: t('medicationModal.medication.sites.abdomen'),
      emoji: '🤚',
    },
  ];

  const selectedMedication = medicationOptions.find(
    m => m.value === medicationType
  );
  const isInsulin =
    medicationType === 'lantus' ||
    medicationType === 'humalog' ||
    medicationType === 'novorapid';

  const handleSubmit = () => {
    if (!medicationType || !dose || !time) {
      toast({
        title: t('medicationModal.toast.error'),
        description: t('medicationModal.toast.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }

    if (isInsulin && !injectionSite) {
      toast({
        title: t('medicationModal.toast.error'),
        description: t('medicationModal.toast.selectInjectionSite'),
        variant: 'destructive',
      });
      return;
    }

    const medicationName = selectedMedication?.label || medicationType;
    toast({
      title: t('medicationModal.toast.medicationSaved'),
      description: t('medicationModal.toast.medicationSavedDescription', {
        medicationName,
        dose,
        unit: selectedMedication?.unit,
      }),
    });

    // Reset form
    setMedicationType('');
    setDose('');
    setTime('');
    setInjectionSite('');
    setInjectionDone(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">💊</span>
            <span>{t('medicationModal.medication.logTitle')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t('medicationModal.medication.typeLabel')}</Label>
            <Select value={medicationType} onValueChange={setMedicationType}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t('medicationModal.medication.typePlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {medicationOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dose">
              Dose ({selectedMedication?.unit || 'mg'})
            </Label>
            <Input
              id="dose"
              type="number"
              placeholder={`Ex: ${isInsulin ? '10' : '500'}`}
              value={dose}
              onChange={e => setDose(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">
              {t('medicationModal.medication.timeLabel')}
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>

          {isInsulin && (
            <div className="space-y-3">
              <Label>
                {t('medicationModal.medication.injectionSiteLabel')}
              </Label>

              <RadioGroup
                value={injectionSite}
                onValueChange={setInjectionSite}
              >
                {injectionSites.map(site => (
                  <div key={site.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={site.value} id={site.value} />
                    <Label
                      htmlFor={site.value}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-lg">{site.emoji}</span>
                      <span>{site.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {isInsulin && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="injection-done"
                checked={injectionDone}
                onCheckedChange={checked => setInjectionDone(checked === true)}
              />
              <Label htmlFor="injection-done" className="text-sm font-medium">
                {t('medicationModal.medication.injectionDone')}
              </Label>
            </div>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('medicationModal.buttons.cancel')}
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {t('medicationModal.buttons.confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationModal;
