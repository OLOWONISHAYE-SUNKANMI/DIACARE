import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SimpleMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleMealModal = ({ isOpen, onClose }: SimpleMealModalProps) => {
  const [foodName, setFoodName] = useState("");
  const [carbs, setCarbs] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom d'aliment",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Repas ajouté",
      description: `${foodName} a été ajouté à votre journal`,
    });

    setFoodName("");
    setCarbs("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - positioned in top third of screen */}
      <div className="relative min-h-screen flex items-start justify-center pt-4">
        <div className="relative bg-white rounded-xl p-6 shadow-2xl w-full max-w-md mx-4 mt-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            🍽️ Journal des Repas
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
            <Label htmlFor="foodName">Nom de l'aliment</Label>
            <Input
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Ex: Pomme, Riz, Salade..."
              className="mt-1"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="carbs">Glucides (g) - optionnel</Label>
            <Input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="Ex: 25"
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
              Ajouter
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default SimpleMealModal;