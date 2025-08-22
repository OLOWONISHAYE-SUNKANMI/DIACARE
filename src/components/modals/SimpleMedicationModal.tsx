import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SimpleMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleMedicationModal = ({ isOpen, onClose }: SimpleMedicationModalProps) => {
  const [medication, setMedication] = useState("");
  const [dose, setDose] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medication || !dose) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Médicament enregistré",
      description: `${medication} - ${dose} unités pris avec succès`,
    });

    setMedication("");
    setDose("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal - Simple top positioning */}
      <div 
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl p-6 shadow-2xl w-full max-w-md"
        style={{ top: '120px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            💊 Enregistrer Prise Médicament
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
            <Label htmlFor="medication">Type de médicament</Label>
            <Select value={medication} onValueChange={setMedication}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un médicament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="insuline-rapide">Insuline rapide</SelectItem>
                <SelectItem value="insuline-lente">Insuline lente</SelectItem>
                <SelectItem value="metformine">Metformine</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dose">Dose (unités)</Label>
            <Input
              id="dose"
              type="number"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Ex: 5"
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
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Confirmer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleMedicationModal;