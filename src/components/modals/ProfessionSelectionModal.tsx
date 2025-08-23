import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

interface ProfessionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const ProfessionSelectionModal = ({ 
  isOpen, 
  onClose, 
  selectedValue, 
  onSelect 
}: ProfessionSelectionModalProps) => {
  const { t } = useTranslation();

  const professionOptions = [
    { value: 'doctor', label: t('professionalAccess.doctor') },
    { value: 'nurse', label: t('professionalAccess.nurse') },
    { value: 'diabetologist', label: t('professionalAccess.diabetologist') },
    { value: 'nutritionist', label: t('professionalAccess.nutritionist') },
    { value: 'pharmacist', label: t('professionalAccess.pharmacist') },
    { value: 'other', label: t('professionalAccess.other') }
  ];

  const handleSelect = (value: string) => {
    onSelect(value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto my-8 w-[90%] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-xl font-semibold text-center pr-8">
            {t('professionalAccess.selectProfession')}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-6 w-6 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <RadioGroup 
            value={selectedValue} 
            onValueChange={handleSelect}
            className="space-y-4"
          >
            {professionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label 
                  htmlFor={option.value} 
                  className="flex-1 cursor-pointer text-base font-medium"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="button" 
              onClick={() => selectedValue && handleSelect(selectedValue)} 
              className="flex-1"
              disabled={!selectedValue}
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};