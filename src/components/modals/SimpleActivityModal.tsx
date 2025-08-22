import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SimpleActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleActivityModal = ({ isOpen, onClose }: SimpleActivityModalProps) => {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity || !duration) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Activité enregistrée",
      description: `${activity} pendant ${duration} minutes`,
    });

    setActivity("");
    setDuration("");
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
            🏃 Activité Physique
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
            <Label htmlFor="activity">Type d'activité</Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner une activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marche">Marche</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="velo">Vélo</SelectItem>
                <SelectItem value="natation">Natation</SelectItem>
                <SelectItem value="musculation">Musculation</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default SimpleActivityModal;