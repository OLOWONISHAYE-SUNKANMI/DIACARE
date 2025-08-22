import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Syringe, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InsulinInjectionModalProps {
  children: React.ReactNode;
  onInsulinAdd: (data: any) => void;
}

const InsulinInjectionModal = ({ children, onInsulinAdd }: InsulinInjectionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [insulinType, setInsulinType] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("now");
  const [customTime, setCustomTime] = useState("");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!insulinType || !dose) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
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

    const injectionData = {
      insulinType,
      dose: parseFloat(dose),
      timestamp,
      site,
      notes: notes || undefined
    };

    onInsulinAdd(injectionData);

    toast({
      title: "Injection enregistrée",
      description: `${insulinType} ${dose}UI injecté`,
    });

    // Reset form
    setInsulinType("");
    setDose("");
    setTime("now");
    setCustomTime("");
    setSite("");
    setNotes("");
    setIsOpen(false);
  };

  const insulinTypes = [
    { value: "lantus", label: "Lantus (insuline lente)" },
    { value: "humalog", label: "Humalog (rapide)" },
    { value: "novolog", label: "NovoLog (rapide)" },
    { value: "levemir", label: "Levemir (lente)" },
    { value: "tresiba", label: "Tresiba (ultra-lente)" },
    { value: "other", label: "Autre" }
  ];

  const injectionSites = [
    { value: "abdomen", label: "Abdomen", emoji: "🔵" },
    { value: "thigh", label: "Cuisse", emoji: "🟢" },
    { value: "arm", label: "Bras", emoji: "🟡" },
    { value: "buttock", label: "Fesse", emoji: "🟣" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-blue-600" />
            <span>Nouvelle Injection d'Insuline</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="insulin-type">Type d'insuline *</Label>
            <Select value={insulinType} onValueChange={setInsulinType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type d'insuline" />
              </SelectTrigger>
              <SelectContent>
                {insulinTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dose">Dose (UI) *</Label>
            <Input
              id="dose"
              type="number"
              placeholder="Ex: 20"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="text-lg text-center"
              step="0.5"
              min="0"
            />
          </div>

          <div className="space-y-3">
            <Label>Heure d'injection</Label>
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
            <Label>Site d'injection</Label>
            <RadioGroup value={site} onValueChange={setSite}>
              {injectionSites.map((siteOption) => (
                <div key={siteOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={siteOption.value} id={siteOption.value} />
                  <Label htmlFor={siteOption.value} className="flex items-center space-x-2">
                    <span className="text-lg">{siteOption.emoji}</span>
                    <span>{siteOption.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Observations, rotation des sites, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsulinInjectionModal;