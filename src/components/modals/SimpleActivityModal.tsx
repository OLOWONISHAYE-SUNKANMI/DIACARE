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

interface SimpleActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleActivityModal = ({ isOpen, onClose }: SimpleActivityModalProps) => {
  const { t } = useTranslation();
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!activity || !duration) {
      toast({
        title: t('simpleActivityModal.toast.error'),
        description: t('simpleActivityModal.toast.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: t('simpleActivityModal.toast.activitySaved', {
        activity,
        duration,
      }),
    });

    setActivity('');
    setDuration('');
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
            {t('simpleActivityModal.activity.header')}
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
            <Label htmlFor="activity">
              {t('simpleActivityModal.activity.typeLabel')}
            </Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={t(
                    'simpleActivityModal.activity.typePlaceholder'
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marche">
                  {t('simpleActivityModal.activity.options.walking')}
                </SelectItem>
                <SelectItem value="course">
                  {t('simpleActivityModal.activity.options.running')}
                </SelectItem>
                <SelectItem value="velo">
                  {t('simpleActivityModal.activity.options.cycling')}
                </SelectItem>
                <SelectItem value="natation">
                  {t('simpleActivityModal.activity.options.swimming')}
                </SelectItem>
                <SelectItem value="musculation">
                  {t('simpleActivityModal.activity.options.strength')}
                </SelectItem>
                <SelectItem value="autre">
                  {t('simpleActivityModal.activity.options.other')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">
              {t('simpleActivityModal.activity.durationLabel')}
            </Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="Ex: 30"
              className="mt-1"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('simpleActivityModal.buttons.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('simpleActivityModal.buttons.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleActivityModal;
