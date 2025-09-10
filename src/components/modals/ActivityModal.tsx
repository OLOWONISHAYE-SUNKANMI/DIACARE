import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActivityModal = ({ isOpen, onClose }: ActivityModalProps) => {
  const { t } = useTranslation();
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState([30]);
  const [intensity, setIntensity] = useState([2]);
  const { toast } = useToast();

  const activityOptions = [
    {
      value: 'walking',
      label: t('activityModal.activity_walking'),
      emoji: '🚶',
      metBase: 3.5,
    },
    {
      value: 'running',
      label: t('activityModal.activity_running'),
      emoji: '🏃',
      metBase: 8,
    },
    {
      value: 'cycling',
      label: t('activityModal.activity_cycling'),
      emoji: '🚴',
      metBase: 6,
    },
    {
      value: 'dancing',
      label: t('activityModal.activity_dancing'),
      emoji: '💃',
      metBase: 5,
    },
    {
      value: 'weightlifting',
      label: t('activityModal.activity_weightlifting'),
      emoji: '🏋️',
      metBase: 4,
    },
    {
      value: 'swimming',
      label: t('activityModal.activity_swimming'),
      emoji: '🏊',
      metBase: 8,
    },
  ];

  const intensityLabels = [
    t('activityModal.intensity_light'),
    t('activityModal.intensity_moderate'),
    t('activityModal.intensity_intense'),
  ];
  const intensityMultipliers = [0.7, 1, 1.5];

  const selectedActivity = activityOptions.find(a => a.value === activityType);

  // Calculate estimated calories burned (using average 70kg person)
  const calculateCalories = () => {
    if (!selectedActivity) return 0;
    const weight = 70; // kg
    const met =
      selectedActivity.metBase * intensityMultipliers[intensity[0] - 1];
    const hours = duration[0] / 60;
    return Math.round(met * weight * hours);
  };

  const estimatedCalories = calculateCalories();

  const handleSubmit = () => {
    if (!activityType) {
      toast({
        title: t('activityModal.activity_type_error_title'),
        description: t('activityModal.activity_type_error_description'),
        variant: 'destructive',
      });
      return;
    }

    const activityName = selectedActivity?.label || activityType;
    toast({
      title: t('activityModal.activity_saved_title'),
      description: t('activityModal.activity_saved_description', {
        activityName,
        duration: duration[0],
        intensity: intensityLabels[intensity[0] - 1],
      }),
    });

    // Reset form
    setActivityType('');
    setDuration([30]);
    setIntensity([2]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">🏃</span>
            <span>{t('activityModal.save_activity')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t('activityModal.activity_type_label')}</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t('activityModal.activity_type_placeholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {activityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <span>{option.emoji}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>
              {t('activityModal.duration_label', { duration: duration[0] })}
            </Label>
            <Slider
              value={duration}
              onValueChange={setDuration}
              max={120}
              min={15}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('activityModal.duration_min')}</span>
              <span>{t('activityModal.duration_max')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label>
              {t('intensity_label', {
                intensity: intensityLabels[intensity[0] - 1],
              })}
            </Label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={3}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('activityModal.intensity_light')}</span>
              <span>{t('activityModal.intensity_moderate')}</span>
              <span>{t('activityModal.intensity_intense')}</span>
            </div>
          </div>

          {activityType && (
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-medium text-sm">
                  {t('activityModal.estimation_title')}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      {t('activityModal.estimation_duration')}
                    </span>
                    <span className="ml-2 font-medium">{duration[0]} min</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {t('activityModal.estimation_intensity')}
                    </span>
                    <span className="ml-2 font-medium">
                      {intensityLabels[intensity[0] - 1]}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">
                      {t('activityModal.estimation_calories')}
                    </span>
                    <span className="ml-2 font-medium text-medical-green">
                      {estimatedCalories} kcal
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t('activityModal.cancel_button')}
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {t('activityModal.save_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModal;
