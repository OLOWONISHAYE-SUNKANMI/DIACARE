import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface SimpleMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleMealModal = ({ isOpen, onClose }: SimpleMealModalProps) => {
  const { t } = useTranslation();
  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodName) {
      toast({
        title: t('simpleGlucoseModal.toast.mealAddedTitle'),
        description: t('simpleGlucoseModal.toast.foodNameRequired'),
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: t('simpleGlucoseModal.toast.mealAddedTitle'),
      description: t('simpleGlucoseModal.toast.mealAdded', { foodName }),
    });

    setFoodName('');
    setCarbs('');
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
            {t('simpleMealModal.mealJournal.header')}
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
            <Label htmlFor="foodName">{t('simpleMealModal.food.label')}</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={e => setFoodName(e.target.value)}
              placeholder={t('simpleMealModal.food.placeholder')}
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="carbs">
              {t('simpleMealModal.nutrition.carbsLabel')}
            </Label>
            <Input
              id="carbs"
              type="number"
              value={carbs}
              onChange={e => setCarbs(e.target.value)}
              placeholder={t('simpleMealModal.nutrition.carbsPlaceholder')}
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
              {t('simpleMealModal.nutrition.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('simpleMealModal.nutrition.add')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleMealModal;
