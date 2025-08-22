import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedicationModal = ({ isOpen, onClose }: MedicationModalProps) => {
  console.log("MedicationModal rendered with isOpen:", isOpen);
  const [medicationType, setMedicationType] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("");
  const [injectionSite, setInjectionSite] = useState("");
  const [injectionDone, setInjectionDone] = useState(false);
  const { toast } = useToast();

  const medicationOptions = [
    { value: "lantus", label: "Lantus (Insuline lente)", unit: "UI" },
    { value: "humalog", label: "Humalog (Insuline rapide)", unit: "UI" },
    { value: "novorapid", label: "NovoRapid (Insuline rapide)", unit: "UI" },
    { value: "metformine", label: "Metformine", unit: "mg" },
    { value: "other", label: "Autre médicament", unit: "mg" },
  ];

  const injectionSites = [
    { value: "arm", label: "Bras", emoji: "💪" },
    { value: "thigh", label: "Cuisse", emoji: "🦵" },
    { value: "abdomen", label: "Ventre", emoji: "🤚" },
  ];

  const selectedMedication = medicationOptions.find(m => m.value === medicationType);
  const isInsulin = medicationType === "lantus" || medicationType === "humalog" || medicationType === "novorapid";

  const handleSubmit = () => {
    if (!medicationType || !dose || !time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (isInsulin && !injectionSite) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner la zone d'injection",
        variant: "destructive",
      });
      return;
    }

    const medicationName = selectedMedication?.label || medicationType;
    toast({
      title: "Médicament enregistré",
      description: `${medicationName} (${dose}${selectedMedication?.unit}) ajouté au carnet`,
    });

    // Reset form
    setMedicationType("");
    setDose("");
    setTime("");
    setInjectionSite("");
    setInjectionDone(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">💊</span>
            <span>Enregistrer Prise Médicament</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Type de médicament</Label>
            <Select value={medicationType} onValueChange={setMedicationType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un médicament" />
              </SelectTrigger>
              <SelectContent>
                {medicationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dose">
              Dose ({selectedMedication?.unit || "mg"})
            </Label>
            <Input
              id="dose"
              type="number"
              placeholder={`Ex: ${isInsulin ? "10" : "500"}`}
              value={dose}
              onChange={(e) => setDose(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Heure d'administration</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {isInsulin && (
            <div className="space-y-3">
              <Label>Zone d'injection</Label>
              <RadioGroup value={injectionSite} onValueChange={setInjectionSite}>
                {injectionSites.map((site) => (
                  <div key={site.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={site.value} id={site.value} />
                    <Label htmlFor={site.value} className="flex items-center space-x-2">
                      <span className="text-lg">{site.emoji}</span>
                      <span>{site.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {isInsulin && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="injection-done"
                checked={injectionDone}
                onCheckedChange={(checked) => setInjectionDone(checked === true)}
              />
              <Label htmlFor="injection-done" className="text-sm font-medium">
                Injection effectuée
              </Label>
            </div>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Confirmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationModal;