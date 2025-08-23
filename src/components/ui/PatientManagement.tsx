import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar as CalendarIcon, FileText, MessageSquare, Clock } from "lucide-react";

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
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
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
                        <div className="flex space-x-2">
                          {consultation.status === 'scheduled' && (
                            <Button size="sm" variant="outline">
                              Commencer
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </div>
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
    </div>
  );
};