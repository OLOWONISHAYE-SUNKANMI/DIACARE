import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface WeightModalProps {
  children: React.ReactNode;
  currentWeight?: number;
  onWeightChange: (weight: number) => void;
}

const WeightModal = ({
  children,
  currentWeight,
  onWeightChange,
}: WeightModalProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState(currentWeight?.toString() || '');
  const { toast } = useToast();

  const handleSave = () => {
    const weightValue = parseFloat(weight);

    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 300) {
      toast({
        title: t('weightModal.weightModal.invalidWeight.title'),
        description: t('weightModal.weightModal.invalidWeight.description'),
        variant: 'destructive',
      });
      return;
    }

    onWeightChange(weightValue);
    setIsOpen(false);
    toast({
      title: t('weightModal.weightModal.success.title'),
      description: t('weightModal.weightModal.success.description', {
        weight: weightValue,
      }),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-medical-teal" />
            {t('weightModal.weightModal.title')}
          </DialogTitle>
          <DialogDescription>
            {t('weightModal.weightModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">
              {t('weightModal.weightModal.inputLabel')}
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder={t('weightModal.weightModal.placeholder')}
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="1"
              max="300"
              step="0.1"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('weightModal.weightModal.tip')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              {t('weightModal.weightModal.cancel')}
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {t('weightModal.weightModal.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeightModal;
