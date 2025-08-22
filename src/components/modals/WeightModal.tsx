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

interface WeightModalProps {
  children: React.ReactNode;
  currentWeight?: number;
  onWeightChange: (weight: number) => void;
}

const WeightModal = ({ children, currentWeight, onWeightChange }: WeightModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState(currentWeight?.toString() || '');
  const { toast } = useToast();

  const handleSave = () => {
    const weightValue = parseFloat(weight);
    
    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 300) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un poids valide (entre 1 et 300 kg)",
        variant: "destructive",
      });
      return;
    }

    onWeightChange(weightValue);
    setIsOpen(false);
    toast({
      title: "Poids mis à jour",
      description: `Votre poids a été enregistré : ${weightValue} kg`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-medical-teal" />
            Poids corporel
          </DialogTitle>
          <DialogDescription>
            Enregistrez votre poids actuel pour un suivi optimal
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Ex: 75.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="1"
              max="300"
              step="0.1"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Conseil :</strong> Pesez-vous toujours à la même heure, 
              de préférence le matin à jeun pour des mesures cohérentes.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeightModal;