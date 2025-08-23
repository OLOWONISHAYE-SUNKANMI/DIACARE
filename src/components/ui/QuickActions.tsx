import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, FileText, Settings } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const [consultationDate, setConsultationDate] = useState<Date>();
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [patientOpen, setPatientOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleScheduleConsultation = () => {
    toast({
      title: "Consultation programmée",
      description: "La consultation a été ajoutée au planning",
    });
    setConsultationOpen(false);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Rapport généré",
      description: "Le rapport a été généré avec succès",
    });
    setReportOpen(false);
  };

  const handleAddPatient = () => {
    toast({
      title: "Patient ajouté",
      description: "Le nouveau patient a été ajouté à votre liste",
    });
    setPatientOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Programmer une consultation */}
      <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Programmer une consultation
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Programmer une consultation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-select">Patient</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marie">Marie Dubois</SelectItem>
                  <SelectItem value="pierre">Pierre Martin</SelectItem>
                  <SelectItem value="sophie">Sophie Laurent</SelectItem>
                  <SelectItem value="jean">Jean Bernard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !consultationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {consultationDate ? format(consultationDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={consultationDate}
                    onSelect={setConsultationDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Heure</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'heure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type de consultation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Suivi routine</SelectItem>
                  <SelectItem value="urgent">Consultation urgente</SelectItem>
                  <SelectItem value="teleconsultation">Téléconsultation</SelectItem>
                  <SelectItem value="first">Première consultation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea placeholder="Notes sur la consultation..." />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setConsultationOpen(false)}>Annuler</Button>
            <Button onClick={handleScheduleConsultation}>Programmer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Générer un rapport */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Générer un rapport
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Générer un rapport</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-type">Type de rapport</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Rapport mensuel</SelectItem>
                  <SelectItem value="patient">Rapport patient</SelectItem>
                  <SelectItem value="financial">Rapport financier</SelectItem>
                  <SelectItem value="activity">Rapport d'activité</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Période</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Semaine dernière</SelectItem>
                  <SelectItem value="last-month">Mois dernier</SelectItem>
                  <SelectItem value="last-quarter">Trimestre dernier</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="format">Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setReportOpen(false)}>Annuler</Button>
            <Button onClick={handleGenerateReport}>Générer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ajouter un patient */}
      <Dialog open={patientOpen} onOpenChange={setPatientOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Ajouter un patient
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input id="first-name" placeholder="Prénom" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input id="last-name" placeholder="Nom" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemple.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" placeholder="+33 6 12 34 56 78" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diabetes-type">Type de diabète</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">Type 1</SelectItem>
                  <SelectItem value="type2">Type 2</SelectItem>
                  <SelectItem value="gestational">Gestationnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes médicales</Label>
              <Textarea placeholder="Historique médical, allergies, etc." />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPatientOpen(false)}>Annuler</Button>
            <Button onClick={handleAddPatient}>Ajouter</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paramètres du compte */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres du compte
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Paramètres du compte</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="availability">Disponibilité</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Statut actuel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="busy">Occupé</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notifications">Notifications</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Préférences notifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notifications</SelectItem>
                  <SelectItem value="important">Importantes uniquement</SelectItem>
                  <SelectItem value="none">Aucune notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="consultation-rate">Tarif consultation (XOF)</Label>
              <Input id="consultation-rate" type="number" placeholder="5000" />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Annuler</Button>
            <Button>Sauvegarder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};