import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGlucose } from "@/contexts/GlucoseContext";

interface AddGlucoseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGlucoseModal = ({ isOpen, onClose }: AddGlucoseModalProps) => {
  const [glucose, setGlucose] = useState("");
  const [time, setTime] = useState("now");
  const [customTime, setCustomTime] = useState("");
  const [context, setContext] = useState("fasting");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const { addReading } = useGlucose();

  const handleSubmit = () => {
    if (!glucose) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une valeur de glycémie",
        variant: "destructive",
      });
      return;
    }

    // Determine timestamp
    let timestamp: string;
    if (time === "now") {
      timestamp = new Date().toISOString();
    } else {
      const today = new Date();
      const [hours, minutes] = customTime.split(':');
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      timestamp = today.toISOString();
    }

    // Add the reading to our data store
    addReading({
      value: parseInt(glucose),
      timestamp,
      context,
      notes: notes || undefined
    });

    toast({
      title: "Glycémie enregistrée",
      description: `Glycémie de ${glucose} mg/dL ajoutée au carnet`,
    });

    // Reset form
    setGlucose("");
    setTime("now");
    setCustomTime("");
    setContext("fasting");
    setNotes("");
    onClose();
  };

  const contextOptions = [
    { value: "fasting", label: "À jeun", emoji: "🌅" },
    { value: "before-meal", label: "Avant repas", emoji: "🍽️" },
    { value: "after-meal-1h", label: "Après repas (1h)", emoji: "🍽️" },
    { value: "after-meal-2h", label: "Après repas (2h)", emoji: "🍽️" },
    { value: "bedtime", label: "Avant coucher", emoji: "😴" },
    { value: "night", label: "Nocturne", emoji: "🌙" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">📊</span>
            <span>Nouvelle Mesure Glycémique</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="glucose">Valeur glycémie (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              placeholder="Ex: 120"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              className="text-lg text-center"
            />
          </div>

          <div className="space-y-3">
            <Label>Heure de mesure</Label>
            <RadioGroup value={time} onValueChange={setTime}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Maintenant</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Heure personnalisée</span>
                </Label>
              </div>
            </RadioGroup>
            
            {time === "custom" && (
              <Input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-3">
            <Label>Contexte de mesure</Label>
            <RadioGroup value={context} onValueChange={setContext}>
              {contextOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex items-center space-x-2">
                    <span className="text-lg">{option.emoji}</span>
                    <span>{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ajoutez vos observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGlucoseModal;