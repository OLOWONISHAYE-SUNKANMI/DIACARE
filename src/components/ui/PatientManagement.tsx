import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Calendar as CalendarIcon, FileText, MessageSquare, Clock, MoreVertical, Eye, Phone, Edit, UserPlus, Video, Send } from "lucide-react";

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
  
  // Modal states
  const [isPatientFileOpen, setIsPatientFileOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isTeleconsultationOpen, setIsTeleconsultationOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

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
      return;
    }

    const patient = patients.find(p => p.id === selectedAction.patientId);
    if (!patient) return;

    setActivePatient(patient);

    // Ouvrir le modal approprié selon le type d'action
    switch (selectedAction.type) {
      case 'view':
        setIsPatientFileOpen(true);
        break;
      case 'message':
        setIsMessageModalOpen(true);
        break;
      case 'teleconsultation':
        setIsTeleconsultationOpen(true);
        break;
      case 'call':
        setIsCallModalOpen(true);
        break;
      case 'edit':
        setIsEditModalOpen(true);
        break;
    }

    // Fermer le modal de code patient
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
            <DialogDescription>
              Veuillez saisir le code patient pour accéder aux informations sécurisées
            </DialogDescription>
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

      {/* Modal Dossier Patient */}
      <Dialog open={isPatientFileOpen} onOpenChange={setIsPatientFileOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dossier Patient - {activePatient?.name}</DialogTitle>
            <DialogDescription>
              Consultation complète du dossier médical
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {activePatient && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nom du patient</Label>
                    <p className="text-lg font-semibold">{activePatient.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type de diabète</Label>
                    <p>{activePatient.diabetesType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Dernière glycémie</Label>
                    <p>{activePatient.lastGlucose}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Statut</Label>
                    <div>{getStatusBadge(activePatient.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Notes médicales</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p>{activePatient.notes}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dernière consultation</Label>
                  <p>{new Date(activePatient.lastConsultation).toLocaleDateString('fr-FR')}</p>
                  {activePatient.nextAppointment && (
                    <>
                      <Label className="text-sm font-medium mt-2 block">Prochain rendez-vous</Label>
                      <p>{new Date(activePatient.nextAppointment).toLocaleDateString('fr-FR')}</p>
                    </>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsPatientFileOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Message */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Envoyer un message à {activePatient?.name}</DialogTitle>
            <DialogDescription>
              Messagerie sécurisée patient-professionnel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message-subject">Sujet</Label>
              <Input id="message-subject" placeholder="Objet du message" />
            </div>
            <div>
              <Label htmlFor="message-content">Message</Label>
              <Textarea 
                id="message-content"
                placeholder="Tapez votre message ici..."
                className="min-h-32"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
                Annuler
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Téléconsultation */}
      <Dialog open={isTeleconsultationOpen} onOpenChange={setIsTeleconsultationOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Téléconsultation avec {activePatient?.name}</DialogTitle>
            <DialogDescription>
              Interface de consultation vidéo sécurisée
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Interface vidéo</p>
                <p className="text-sm text-muted-foreground">La consultation vidéo apparaîtrait ici</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Patient</Label>
                <p>{activePatient?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Durée prévue</Label>
                <p>30 minutes</p>
              </div>
            </div>
            <div>
              <Label htmlFor="consultation-notes">Notes de consultation</Label>
              <Textarea 
                id="consultation-notes"
                placeholder="Notez les points importants de la consultation..."
                className="min-h-24"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsTeleconsultationOpen(false)}>
                Fermer
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Audio uniquement
                </Button>
                <Button>
                  <Video className="mr-2 h-4 w-4" />
                  Démarrer la vidéo
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Appel */}
      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appeler {activePatient?.name}</DialogTitle>
            <DialogDescription>
              Interface d'appel téléphonique
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-lg">{activePatient?.name}</p>
              <p className="text-muted-foreground">Prêt à composer le numéro</p>
            </div>
            <div>
              <Label htmlFor="phone-notes">Notes d'appel</Label>
              <Textarea 
                id="phone-notes"
                placeholder="Notez l'objet de l'appel..."
                className="min-h-20"
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={() => setIsCallModalOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Phone className="mr-2 h-4 w-4" />
                Composer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Édition du profil */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le profil - {activePatient?.name}</DialogTitle>
            <DialogDescription>
              Édition des informations du patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {activePatient && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Nom du patient</Label>
                    <Input id="edit-name" defaultValue={activePatient.name} />
                  </div>
                  <div>
                    <Label htmlFor="edit-diabetes-type">Type de diabète</Label>
                    <Input id="edit-diabetes-type" defaultValue={activePatient.diabetesType} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-status">Statut</Label>
                  <select 
                    id="edit-status" 
                    className="w-full p-2 border rounded-md"
                    defaultValue={activePatient.status}
                  >
                    <option value="stable">Stable</option>
                    <option value="attention">Attention</option>
                    <option value="amélioration">Amélioration</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-glucose">Dernière glycémie</Label>
                  <Input id="edit-glucose" defaultValue={activePatient.lastGlucose} />
                </div>
                <div>
                  <Label htmlFor="edit-notes">Notes médicales</Label>
                  <Textarea 
                    id="edit-notes"
                    defaultValue={activePatient.notes}
                    className="min-h-32"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-next-appointment">Prochain rendez-vous</Label>
                  <Input 
                    id="edit-next-appointment"
                    type="date"
                    defaultValue={activePatient.nextAppointment}
                  />
                </div>
              </>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button>
                Enregistrer les modifications
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};