import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGlucose } from "@/contexts/GlucoseContext";

interface SimpleGlucoseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleGlucoseModal = ({ isOpen, onClose }: SimpleGlucoseModalProps) => {
  const [glucose, setGlucose] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { addReading } = useGlucose();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!glucose || isNaN(Number(glucose))) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur de glycémie valide",
        variant: "destructive",
      });
      return;
    }

    addReading({
      value: Number(glucose),
      timestamp: new Date().toISOString(),
      context: "manual",
      notes: notes || undefined
    });

    toast({
      title: "Mesure ajoutée",
      description: "Votre glycémie a été enregistrée avec succès",
    });

    setGlucose("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            📊 Nouvelle Mesure Glycémique
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
            <Label htmlFor="glucose">Glycémie (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              placeholder="Ex: 120"
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Commentaires..."
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
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleGlucoseModal;