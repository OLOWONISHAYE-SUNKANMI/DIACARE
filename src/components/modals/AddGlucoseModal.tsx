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
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useTranslation } from 'react-i18next';

interface AddGlucoseModalProps {
  children: React.ReactNode;
  onGlucoseAdd: (data: any) => void;
}

const AddGlucoseModal = ({ children, onGlucoseAdd }: AddGlucoseModalProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [glucose, setGlucose] = useState('');
  const [time, setTime] = useState('now');
  const [customTime, setCustomTime] = useState('');
  const [context, setContext] = useState('fasting');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { addReading } = useGlucose();

  const handleSubmit = () => {
    if (!glucose) {
      toast({
        title: t('addGlucoseModal.blood_sugar_error_title'),
        description: t('addGlucoseModal.blood_sugar_error_description'),
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

    // Add the reading to our data store
    addReading({
      value: parseInt(glucose),
      timestamp,
      context,
      notes: notes || undefined,
    });

    // Call the callback with the data
    onGlucoseAdd({
      value: parseInt(glucose),
      timestamp,
      context,
      notes,
    });

    // Reset form
    setGlucose('');
    setTime('now');
    setCustomTime('');
    setContext('fasting');
    setNotes('');
    setIsOpen(false);
  };

  const contextOptions = [
    {
      value: 'fasting',
      label: t('addGlucoseModal.context_fasting'),
      emoji: '🌅',
    },
    {
      value: 'before-meal',
      label: t('addGlucoseModal.context_before_meal'),
      emoji: '🍽️',
    },
    {
      value: 'after-meal-1h',
      label: t('addGlucoseModal.context_after_meal_1h'),
      emoji: '🍽️',
    },
    {
      value: 'after-meal-2h',
      label: t('addGlucoseModal.context_after_meal_2h'),
      emoji: '🍽️',
    },
    {
      value: 'bedtime',
      label: t('addGlucoseModal.context_bedtime'),
      emoji: '😴',
    },
    { value: 'night', label: t('addGlucoseModal.context_night'), emoji: '🌙' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <span>{t('addGlucoseModal.new_blood_sugar_measure')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="glucose">
              {t('addGlucoseModal.glucose_label')}
            </Label>
            <Input
              id="glucose"
              type="number"
              placeholder={t('addGlucoseModal.glucose_placeholder')}
              value={glucose}
              onChange={e => setGlucose(e.target.value)}
              className="text-lg text-center"
            />
          </div>

          <div className="space-y-3">
            <Label>{t('addGlucoseModal.measurement_time_label')}</Label>
            <RadioGroup value={time} onValueChange={setTime}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t('addGlucoseModal.time_now')}</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t('addGlucoseModal.time_custom')}</span>
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
            <Label>{t('addGlucoseModal.measurement_context_label')}</Label>

            <RadioGroup value={context} onValueChange={setContext}>
              {contextOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span>{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t('addGlucoseModal.notes_label')}</Label>
            <Textarea
              id="notes"
              placeholder={t('addGlucoseModal.notes_placeholder')}
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
              {t('addGlucoseModal.cancel_button')}
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {t('addGlucoseModal.save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGlucoseModal;
