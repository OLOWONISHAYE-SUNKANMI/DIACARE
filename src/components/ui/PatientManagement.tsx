import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Calendar as CalendarIcon, FileText, MessageSquare, Clock, MoreVertical, Eye, Phone, Edit, UserPlus, Video } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  lastConsultation: string;
  nextAppointment?: string;
  notes: string;
  status: 'stable' | 'attention' | 'amélioration';
  diabetesType: string;
  lastGlucose: string;
}

interface Consultation {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: string;
}

export const PatientManagement = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isPatientCodeModalOpen, setIsPatientCodeModalOpen] = useState(false);
  const [patientCode, setPatientCode] = useState('');
  const [selectedAction, setSelectedAction] = useState<{
    type: 'view' | 'message' | 'teleconsultation' | 'call' | 'edit';
    patientId: string;
    patientName: string;
  } | null>(null);

  const handlePatientAction = (
    action: 'view' | 'message' | 'teleconsultation' | 'call' | 'edit',
    patientId: string,
    patientName: string
  ) => {
    setSelectedAction({ type: action, patientId, patientName });
    setIsPatientCodeModalOpen(true);
  };

  const handlePatientCodeSubmit = () => {
    if (!patientCode.trim() || !selectedAction) {
      console.log('Code patient vide ou action non sélectionnée');
      return;
    }

    console.log(`Tentative d'ouverture: ${selectedAction.type} pour ${selectedAction.patientName} avec le code: ${patientCode}`);

    const { type, patientId } = selectedAction;

    // Options pour les fenêtres pop-up
    const popupOptions = 'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no';

    try {
      let popupWindow;
      
      switch (type) {
        case 'view':
          console.log('Ouverture du dossier patient...');
          popupWindow = window.open(`data:text/html,<html><head><title>Dossier Patient - ${selectedAction.patientName}</title></head><body style="font-family:Arial,sans-serif;padding:20px;"><h1>Dossier Patient</h1><h2>${selectedAction.patientName}</h2><p>Code Patient: ${patientCode}</p><p>ID: ${patientId}</p><p>Cette fenêtre simule l'accès au dossier patient complet.</p></body></html>`, 'patientFile', popupOptions);
          break;
        case 'message':
          console.log('Ouverture de la messagerie...');
          popupWindow = window.open(`data:text/html,<html><head><title>Messagerie - ${selectedAction.patientName}</title></head><body style="font-family:Arial,sans-serif;padding:20px;"><h1>Messagerie</h1><h2>Conversation avec ${selectedAction.patientName}</h2><p>Code Patient: ${patientCode}</p><div style="border:1px solid #ccc;padding:10px;margin:10px 0;border-radius:5px;">Interface de messagerie sécurisée</div></body></html>`, 'patientMessage', 'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no');
          break;
        case 'teleconsultation':
          console.log('Ouverture de la téléconsultation...');
          popupWindow = window.open(`data:text/html,<html><head><title>Téléconsultation - ${selectedAction.patientName}</title></head><body style="font-family:Arial,sans-serif;padding:20px;background:#f0f0f0;"><h1>Téléconsultation</h1><h2>Session avec ${selectedAction.patientName}</h2><p>Code Patient: ${patientCode}</p><div style="background:#000;color:#fff;padding:20px;text-align:center;margin:20px 0;border-radius:10px;">🎥 Interface vidéo de téléconsultation</div></body></html>`, 'teleconsultation', 'width=1400,height=900,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no');
          break;
        case 'call':
          console.log('Ouverture de l\'interface d\'appel...');
          popupWindow = window.open(`data:text/html,<html><head><title>Appel - ${selectedAction.patientName}</title></head><body style="font-family:Arial,sans-serif;padding:20px;text-align:center;background:#e8f5e8;"><h1>Interface d'Appel</h1><h2>${selectedAction.patientName}</h2><p>Code: ${patientCode}</p><div style="background:#4CAF50;color:white;padding:15px;margin:20px;border-radius:50px;cursor:pointer;">📞 Composer le numéro</div></body></html>`, 'callInterface', 'width=400,height=300,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no,status=no');
          break;
        case 'edit':
          console.log('Ouverture du mode édition...');
          popupWindow = window.open(`data:text/html,<html><head><title>Édition - ${selectedAction.patientName}</title></head><body style="font-family:Arial,sans-serif;padding:20px;"><h1>Édition du Profil</h1><h2>${selectedAction.patientName}</h2><p>Code Patient: ${patientCode}</p><form style="margin:20px 0;"><label>Nom: <input type="text" value="${selectedAction.patientName}" style="margin:5px;padding:5px;"></label><br><br><label>Notes: <textarea style="margin:5px;padding:5px;width:300px;height:100px;"></textarea></label></form></body></html>`, 'editProfile', popupOptions);
          break;
      }

      if (popupWindow) {
        console.log('Fenêtre pop-up ouverte avec succès');
        popupWindow.focus();
      } else {
        console.error('Échec d\'ouverture de la fenêtre pop-up - vérifiez les paramètres de blocage des pop-ups');
        alert('La fenêtre pop-up a été bloquée. Veuillez autoriser les pop-ups pour ce site.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la fenêtre pop-up:', error);
    }

    setIsPatientCodeModalOpen(false);
    setPatientCode('');
    setSelectedAction(null);
  };

  // Données de démo
  const patients: Patient[] = [
    {
      id: "1",
      name: "Marie Dubois",
      lastConsultation: "2024-01-15",
      nextAppointment: "2024-01-22",
      notes: "Glucose bien contrôlé. Continuer le traitement actuel. Prochaine consultation dans 1 semaine.",
      status: "stable",
      diabetesType: "Type 2",
      lastGlucose: "7.2 mmol/L"
    },
    {
      id: "2",
      name: "Pierre Martin", 
      lastConsultation: "2024-01-14",
      notes: "Amélioration notable de l'HbA1c. Réduction de la dose d'insuline recommandée.",
      status: "amélioration",
      diabetesType: "Type 1",
      lastGlucose: "6.8 mmol/L"
    },
    {
      id: "3",
      name: "Sophie Laurent",
      lastConsultation: "2024-01-12",
      nextAppointment: "2024-01-19",
      notes: "Pics glycémiques fréquents. Revoir l'alimentation et ajuster le traitement.",
      status: "attention",
      diabetesType: "Type 2",
      lastGlucose: "8.1 mmol/L"
    },
    {
      id: "4",
      name: "Jean Bernard",
      lastConsultation: "2024-01-10",
      notes: "Nouveau patient. Éducation thérapeutique débutée.",
      status: "stable",
      diabetesType: "Type 2",
      lastGlucose: "7.5 mmol/L"
    }
  ];

  const consultations: Consultation[] = [
    {
      id: "1",
      patient: "Marie Dubois",
      date: "2024-01-22",
      time: "09:00",
      type: "Suivi routine",
      status: "scheduled",
      duration: "30min"
    },
    {
      id: "2",
      patient: "Sophie Laurent", 
      date: "2024-01-19",
      time: "14:30",
      type: "Consultation urgente",
      status: "scheduled",
      duration: "45min"
    },
    {
      id: "3",
      patient: "Pierre Martin",
      date: "2024-01-18",
      time: "11:00",
      type: "Téléconsultation",
      status: "completed",
      duration: "25min"
    },
    {
      id: "4",
      patient: "Jean Bernard",
      date: "2024-01-17",
      time: "16:00", 
      type: "Première consultation",
      status: "completed",
      duration: "60min"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'stable':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Stable</Badge>;
      case 'attention':
        return <Badge variant="destructive">Attention</Badge>;
      case 'amélioration':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Amélioration</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConsultationStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Programmée</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Liste des patients ({patients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type diabète</TableHead>
                    <TableHead>Dernière consultation</TableHead>
                    <TableHead>Dernière glycémie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.nextAppointment && `Prochain RDV: ${new Date(patient.nextAppointment).toLocaleDateString('fr-FR')}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.diabetesType}</TableCell>
                      <TableCell>{new Date(patient.lastConsultation).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{patient.lastGlucose}</TableCell>
                      <TableCell>{getStatusBadge(patient.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="z-50 bg-background border shadow-lg"
                          >
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handlePatientAction('view', patient.id, patient.name)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir le dossier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handlePatientAction('message', patient.id, patient.name)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Envoyer un message
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handlePatientAction('teleconsultation', patient.id, patient.name)}
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Téléconsultation
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handlePatientAction('call', patient.id, patient.name)}
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Appeler
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handlePatientAction('edit', patient.id, patient.name)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier le profil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes des patients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Notes récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.filter(p => p.notes).map((patient) => (
                  <div key={patient.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{patient.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(patient.lastConsultation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{patient.notes}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Planning des consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell className="font-medium">
                        {new Date(consultation.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{consultation.time}</TableCell>
                      <TableCell>{consultation.patient}</TableCell>
                      <TableCell>{consultation.type}</TableCell>
                      <TableCell>{consultation.duration}</TableCell>
                      <TableCell>{getConsultationStatusBadge(consultation.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="z-50 bg-background border shadow-lg"
                          >
                            {consultation.status === 'scheduled' && (
                              <DropdownMenuItem className="cursor-pointer">
                                <Video className="mr-2 h-4 w-4" />
                                Commencer la consultation
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            {consultation.status === 'scheduled' && (
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <Clock className="mr-2 h-4 w-4" />
                                Annuler
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Calendrier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Consultations du {selectedDate?.toLocaleDateString('fr-FR')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultations
                    .filter(c => new Date(c.date).toDateString() === selectedDate?.toDateString())
                    .map((consultation) => (
                      <div key={consultation.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{consultation.time} - {consultation.patient}</p>
                            <p className="text-sm text-muted-foreground">{consultation.type}</p>
                          </div>
                          {getConsultationStatusBadge(consultation.status)}
                        </div>
                      </div>
                    ))}
                  {consultations.filter(c => new Date(c.date).toDateString() === selectedDate?.toDateString()).length === 0 && (
                    <p className="text-muted-foreground">Aucune consultation prévue ce jour</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal pour saisir le code patient */}
      <Dialog open={isPatientCodeModalOpen} onOpenChange={setIsPatientCodeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Code patient requis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Veuillez saisir le code patient pour accéder aux informations de{' '}
                <span className="font-semibold">{selectedAction?.patientName}</span>
              </Label>
              <Input
                type="text"
                placeholder="Code patient (ex: ABC123)"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePatientCodeSubmit();
                  }
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPatientCodeModalOpen(false);
                  setPatientCode('');
                  setSelectedAction(null);
                }}
              >
                Annuler
              </Button>
              <Button 
                onClick={handlePatientCodeSubmit}
                disabled={!patientCode.trim()}
              >
                Accéder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};