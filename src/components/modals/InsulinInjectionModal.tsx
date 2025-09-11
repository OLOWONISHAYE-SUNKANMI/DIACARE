import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Syringe, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface InsulinInjectionModalProps {
  children: React.ReactNode;
  onInsulinAdd: (data: any) => void;
}

const InsulinInjectionModal = ({
  children,
  onInsulinAdd,
}: InsulinInjectionModalProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [insulinType, setInsulinType] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('now');
  const [customTime, setCustomTime] = useState('');
  const [site, setSite] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!insulinType || !dose) {
      toast({
        title: t('injectionInsulinModal.toast.error'),
        description: t('injectionInsulinModal.toast.fillRequired'),
        variant: 'destructive',
      });
      return;
    }

    // Determine timestamp
    let timestamp: string;
    if (time === 'now') {
      timestamp = new Date().toISOString();
    } else {
      const today = new Date();
      const [hours, minutes] = customTime.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      timestamp = today.toISOString();
    }

    const injectionData = {
      insulinType,
      dose: parseFloat(dose),
      timestamp,
      site,
      notes: notes || undefined,
    };

    onInsulinAdd(injectionData);

    toast({
      title: t('injectionInsulinModal.toast.injectionSaved'),
      description: t('injectionInsulinModal.toast.injectionDescription', {
        insulinType,
        dose,
      }),
    });

    // Reset form
    setInsulinType('');
    setDose('');
    setTime('now');
    setCustomTime('');
    setSite('');
    setNotes('');
    setIsOpen(false);
  };

  const insulinTypes = [
    { value: 'lantus', label: t('injectionInsulinModal.insulin.types.lantus') },
    {
      value: 'humalog',
      label: t('injectionInsulinModal.insulin.types.humalog'),
    },
    {
      value: 'novolog',
      label: t('injectionInsulinModal.insulin.types.novolog'),
    },
    {
      value: 'levemir',
      label: t('injectionInsulinModal.insulin.types.levemir'),
    },
    {
      value: 'tresiba',
      label: t('injectionInsulinModal.insulin.types.tresiba'),
    },
    { value: 'other', label: t('injectionInsulinModal.insulin.types.other') },
  ];

  const injectionSites = [
    {
      value: 'abdomen',
      label: t('injectionInsulinModal.insulin.sites.abdomen'),
      emoji: '🔵',
    },
    {
      value: 'thigh',
      label: t('injectionInsulinModal.insulin.sites.thigh'),
      emoji: '🟢',
    },
    {
      value: 'arm',
      label: t('injectionInsulinModal.insulin.sites.arm'),
      emoji: '🟡',
    },
    {
      value: 'buttock',
      label: t('injectionInsulinModal.insulin.sites.buttock'),
      emoji: '🟣',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-blue-600" />
            <span>{t('injectionInsulinModal.insulin.newInjection')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="insulin-type">
              {t('injectionInsulinModal.insulin.typeLabel')}
            </Label>
            <Select value={insulinType} onValueChange={setInsulinType}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    'injectionInsulinModal.insulin.typePlaceholder'
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {insulinTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dose">Dose (UI) *</Label>
            <Input
              id="dose"
              type="number"
              placeholder="Ex: 20"
              value={dose}
              onChange={e => setDose(e.target.value)}
              className="text-lg text-center"
              step="0.5"
              min="0"
            />
          </div>

          <div className="space-y-3">
            <Label>
              {t('injectionInsulinModal.insulin.injectionTimeLabel')}
            </Label>
            <RadioGroup value={time} onValueChange={setTime}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {t('injectionInsulinModal.insulin.timeOptions.now')}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('injectionInsulinModal.insulin.timeOptions.custom')}
                  </span>
                </Label>
              </div>
            </RadioGroup>

            {time === 'custom' && (
              <Input
                type="time"
                value={customTime}
                onChange={e => setCustomTime(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-3">
            <Label>Site d'injection</Label>
            <RadioGroup value={site} onValueChange={setSite}>
              {injectionSites.map(siteOption => (
                <div
                  key={siteOption.value}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={siteOption.value}
                    id={siteOption.value}
                  />
                  <Label
                    htmlFor={siteOption.value}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-lg">{siteOption.emoji}</span>
                    <span>{siteOption.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {t('injectionInsulinModal.form.notes.label')}
            </Label>
            <Textarea
              id="notes"
              placeholder={t('injectionInsulinModal.form.notes.placeholder')}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              {t('injectionInsulinModal.buttons.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {t('injectionInsulinModal.buttons.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsulinInjectionModal;
