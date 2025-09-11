import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Calendar as CalendarIcon,
  FileText,
  MessageSquare,
  Clock,
  MoreVertical,
  Eye,
  Phone,
  Edit,
  UserPlus,
  Video,
  Send,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Patient {
  id: string;
  name: string;
  lastConsultation: string;
  nextAppointment?: string;
  notes: string;
  status: string;
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
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
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
      id: '1',
      name: 'Marie Dubois',
      lastConsultation: '2024-01-15',
      nextAppointment: '2024-01-22',
      notes: t('professionalDashboard.patients.recentNotes.people.first'),
      status: t('professionalDashboard.patients.lastBloodGlucose.first'),
      diabetesType: 'Type 2',
      lastGlucose: '7.2 mmol/L',
    },
    {
      id: '2',
      name: 'Pierre Martin',
      lastConsultation: '2024-01-14',
      notes: t('professionalDashboard.patients.recentNotes.people.second'),
      status: t('professionalDashboard.patients.lastBloodGlucose.second'),
      diabetesType: 'Type 1',
      lastGlucose: '6.8 mmol/L',
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      lastConsultation: '2024-01-12',
      nextAppointment: '2024-01-19',
      notes: t('professionalDashboard.patients.recentNotes.people.third'),
      status: t('professionalDashboard.patients.lastBloodGlucose.third'),
      diabetesType: 'Type 2',
      lastGlucose: '8.1 mmol/L',
    },
    {
      id: '4',
      name: 'Jean Bernard',
      lastConsultation: '2024-01-10',
      notes: t('professionalDashboard.patients.recentNotes.people.fourth'),
      status: t('professionalDashboard.patients.lastBloodGlucose.fourth'),
      diabetesType: 'Type 2',
      lastGlucose: '7.5 mmol/L',
    },
  ];

  const consultations: Consultation[] = [
    {
      id: '1',
      patient: 'Marie Dubois',
      date: '2024-01-22',
      time: '09:00',
      type: t('professionalDashboard.patients.planning.type.followUp'),
      status: 'scheduled',
      duration: '30min',
    },
    {
      id: '2',
      patient: 'Sophie Laurent',
      date: '2024-01-19',
      time: '14:30',
      type: t('professionalDashboard.patients.planning.type.urgent'),
      status: 'scheduled',
      duration: '45min',
    },
    {
      id: '3',
      patient: 'Pierre Martin',
      date: '2024-01-18',
      time: '11:00',
      type: t('professionalDashboard.patients.planning.type.teleconsultation'),
      status: 'completed',
      duration: '25min',
    },
    {
      id: '4',
      patient: 'Jean Bernard',
      date: '2024-01-17',
      time: '16:00',
      type: t('professionalDashboard.patients.planning.type.first'),
      status: 'completed',
      duration: '60min',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case t('professionalDashboard.patients.lastBloodGlucose.first'):
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {t('professionalDashboard.patients.lastBloodGlucose.first')}
          </Badge>
        );
      case t('professionalDashboard.patients.lastBloodGlucose.third'):
        return (
          <Badge variant="destructive">
            {t('professionalDashboard.patients.lastBloodGlucose.third')}
          </Badge>
        );
      case t('professionalDashboard.patients.lastBloodGlucose.second'):
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {t('professionalDashboard.patients.lastBloodGlucose.second')}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getConsultationStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {t('professionalDashboard.patients.planning.status.scheduled')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {t('professionalDashboard.patients.planning.status.completed')}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {t('professionalDashboard.patients.planning.status.cancelled')}
          </Badge>
        );
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
          <TabsTrigger value="calendar">
            {t('professionalDashboard.patients.calendar')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {t('professionalDashboard.patients.title')} ({patients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>
                      {t('professionalDashboard.patients.title')}
                    </TableHead>
                    <TableHead>
                      {t('professionalDashboard.patients.tableHeading.first')}
                    </TableHead>
                    <TableHead>
                      {t('professionalDashboard.patients.tableHeading.second')}
                    </TableHead>
                    <TableHead>
                      {t('professionalDashboard.patients.tableHeading.fourth')}
                    </TableHead>
                    <TableHead>
                      {t('professionalDashboard.patients.tableHeading.fifth')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map(patient => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {patient.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {patient.nextAppointment &&
                                `Prochain RDV: ${new Date(patient.nextAppointment).toLocaleDateString('fr-FR')}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{patient.diabetesType}</TableCell>
                      <TableCell>
                        {new Date(patient.lastConsultation).toLocaleDateString(
                          'fr-FR'
                        )}
                      </TableCell>
                      <TableCell>{patient.lastGlucose}</TableCell>
                      <TableCell>{getStatusBadge(patient.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-accent"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="z-[100] min-w-48 bg-background border border-border shadow-md rounded-md p-1"
                            side="bottom"
                            sideOffset={4}
                          >
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 text-sm"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePatientAction(
                                  'view',
                                  patient.id,
                                  patient.name
                                );
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.dropdownOptions.first'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 text-sm"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePatientAction(
                                  'message',
                                  patient.id,
                                  patient.name
                                );
                              }}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.dropdownOptions.second'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 text-sm"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePatientAction(
                                  'teleconsultation',
                                  patient.id,
                                  patient.name
                                );
                              }}
                            >
                              <Video className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.dropdownOptions.third'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 text-sm"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePatientAction(
                                  'call',
                                  patient.id,
                                  patient.name
                                );
                              }}
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.dropdownOptions.fourth'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 text-sm"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePatientAction(
                                  'edit',
                                  patient.id,
                                  patient.name
                                );
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.dropdownOptions.fifth'
                              )}
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
                {t('professionalDashboard.patients.recentNotes.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients
                  .filter(p => p.notes)
                  .map(patient => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{patient.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(
                            patient.lastConsultation
                          ).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.notes}
                      </p>
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
                {t('professionalDashboard.patients.planning.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>
                      {t(
                        'professionalDashboard.patients.planning.tableHeading.time'
                      )}
                    </TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>
                      {t(
                        'professionalDashboard.patients.planning.tableHeading.duration'
                      )}
                    </TableHead>
                    <TableHead>
                      {t(
                        'professionalDashboard.patients.planning.tableHeading.status'
                      )}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map(consultation => (
                    <TableRow key={consultation.id}>
                      <TableCell className="font-medium">
                        {new Date(consultation.date).toLocaleDateString(
                          'fr-FR'
                        )}
                      </TableCell>
                      <TableCell>{consultation.time}</TableCell>
                      <TableCell>{consultation.patient}</TableCell>
                      <TableCell>{consultation.type}</TableCell>
                      <TableCell>{consultation.duration}</TableCell>
                      <TableCell>
                        {getConsultationStatusBadge(consultation.status)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
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
                                {t(
                                  'professionalDashboard.patients.planning.actions.start'
                                )}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.planning.actions.view'
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              {t(
                                'professionalDashboard.patients.planning.actions.edit'
                              )}
                            </DropdownMenuItem>
                            {consultation.status === 'scheduled' && (
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <Clock className="mr-2 h-4 w-4" />
                                {t(
                                  'professionalDashboard.patients.planning.actions.cancel'
                                )}
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
                  {t('professionalDashboard.patients.calendarScreen.title')}
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
                  {t(
                    'professionalDashboard.patients.calendarScreen.consulationOf'
                  )}{' '}
                  {selectedDate?.toLocaleDateString('fr-FR')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultations
                    .filter(
                      c =>
                        new Date(c.date).toDateString() ===
                        selectedDate?.toDateString()
                    )
                    .map(consultation => (
                      <div
                        key={consultation.id}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {consultation.time} - {consultation.patient}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {consultation.type}
                            </p>
                          </div>
                          {getConsultationStatusBadge(consultation.status)}
                        </div>
                      </div>
                    ))}
                  {consultations.filter(
                    c =>
                      new Date(c.date).toDateString() ===
                      selectedDate?.toDateString()
                  ).length === 0 && (
                    <p className="text-muted-foreground">
                      {t(
                        'professionalDashboard.patients.calendarScreen.scheduled'
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal pour saisir le code patient */}
      <Dialog
        open={isPatientCodeModalOpen}
        onOpenChange={setIsPatientCodeModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('patientManagement.patientCodeModal.title')}
            </DialogTitle>
            <DialogDescription>
              {t('patientManagement.patientCodeModal.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {t('patientManagement.patientCodeModal.enterCodeFor', {
                  patientName: selectedAction?.patientName,
                })}
              </Label>
              <Input
                type="text"
                placeholder={t(
                  'patientManagement.patientCodeModal.placeholder'
                )}
                value={patientCode}
                onChange={e => setPatientCode(e.target.value.toUpperCase())}
                onKeyPress={e => {
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
                {t('patientManagement.patientCodeModal.cancel')}
              </Button>
              <Button
                onClick={handlePatientCodeSubmit}
                disabled={!patientCode.trim()}
              >
                {t('patientManagement.patientCodeModal.access')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Dossier Patient */}
      <Dialog open={isPatientFileOpen} onOpenChange={setIsPatientFileOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t('patientManagement.patientFile.title', {
                patientName: activePatient?.name,
              })}
            </DialogTitle>
            <DialogDescription>
              {t('patientManagement.patientFile.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {activePatient && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {t('patientManagement.patientFile.name')}
                    </Label>
                    <p className="text-lg font-semibold">
                      {activePatient.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      {t('patientManagement.patientFile.diabetesType')}
                    </Label>
                    <p>{activePatient.diabetesType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      {t('patientManagement.patientFile.lastGlucose')}
                    </Label>
                    <p>{activePatient.lastGlucose}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      {t('patientManagement.patientFile.status')}
                    </Label>
                    <div>{getStatusBadge(activePatient.status)}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {t('patientManagement.patientFile.medicalNotes')}
                  </Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p>{activePatient.notes}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {t('patientManagement.patientFile.lastConsultation')}
                  </Label>
                  <p>
                    {new Date(
                      activePatient.lastConsultation
                    ).toLocaleDateString('fr-FR')}
                  </p>
                  {activePatient.nextAppointment && (
                    <>
                      <Label className="text-sm font-medium mt-2 block">
                        {t('patientManagement.patientFile.nextAppointment')}
                      </Label>
                      <p>
                        {new Date(
                          activePatient.nextAppointment
                        ).toLocaleDateString('fr-FR')}
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsPatientFileOpen(false)}>
                {t('patientManagement.patientFile.close')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Message */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('patientManagement.messageModal.title', {
                patientName: activePatient?.name,
              })}
            </DialogTitle>
            <DialogDescription>
              {t('patientManagement.messageModal.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message-subject">
                {t('patientManagement.messageModal.subject')}
              </Label>
              <Input
                id="message-subject"
                placeholder={t(
                  'patientManagement.messageModal.subjectPlaceholder'
                )}
              />
            </div>
            <div>
              <Label htmlFor="message-content">
                {t('patientManagement.messageModal.content')}
              </Label>
              <Textarea
                id="message-content"
                placeholder={t(
                  'patientManagement.messageModal.contentPlaceholder'
                )}
                className="min-h-32"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsMessageModalOpen(false)}
              >
                {t('patientManagement.messageModal.cancel')}
              </Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                {t('patientManagement.messageModal.send')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Téléconsultation */}
      <Dialog
        open={isTeleconsultationOpen}
        onOpenChange={setIsTeleconsultationOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t('patientManagement.teleconsultation.title', {
                patientName: activePatient?.name,
              })}
            </DialogTitle>
            <DialogDescription>
              {t('patientManagement.teleconsultation.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">
                  {t('patientManagement.teleconsultation.interfaceTitle')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('patientManagement.teleconsultation.interfaceSubtitle')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  {t('patientManagement.teleconsultation.patientLabel')}
                </Label>
                <p>{activePatient?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  {t('patientManagement.teleconsultation.durationLabel')}
                </Label>
                <p>
                  {t('patientManagement.teleconsultation.durationValue', {
                    minutes: 30,
                  })}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="consultation-notes">
                {t('patientManagement.teleconsultation.notesLabel')}
              </Label>
              <Textarea
                id="consultation-notes"
                placeholder={t(
                  'patientManagement.teleconsultation.notesPlaceholder'
                )}
                className="min-h-24"
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsTeleconsultationOpen(false)}
              >
                {t('patientManagement.teleconsultation.close')}
              </Button>

              <div className="space-x-2">
                <Button variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  {t('patientManagement.teleconsultation.audioOnly')}
                </Button>
                <Button>
                  <Video className="mr-2 h-4 w-4" />
                  {t('patientManagement.teleconsultation.startVideo')}
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
            <DialogTitle>
              {t('patientManagement.call.title', {
                patientName: activePatient?.name,
              })}
            </DialogTitle>
            <DialogDescription>
              {t('patientManagement.call.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-center">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-primary" />
            </div>

            <div>
              <p className="font-medium text-lg">{activePatient?.name}</p>
              <p className="text-muted-foreground">
                {t('patientManagement.call.ready')}
              </p>
            </div>

            <div>
              <Label htmlFor="phone-notes">
                {t('patientManagement.call.notesLabel')}
              </Label>
              <Textarea
                id="phone-notes"
                placeholder={t('patientManagement.call.notesPlaceholder')}
                className="min-h-20"
              />
            </div>

            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCallModalOpen(false)}
              >
                {t('patientManagement.call.cancel')}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Phone className="mr-2 h-4 w-4" />
                {t('patientManagement.call.dial')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Édition du profil */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('patientManagement.editProfile.title', {
                patientName: activePatient?.name,
              })}
            </DialogTitle>
            <DialogDescription>
              {t('patientManagement.editProfile.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {activePatient && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">
                      {t('patientManagement.editProfile.name')}
                    </Label>
                    <Input id="edit-name" defaultValue={activePatient.name} />
                  </div>
                  <div>
                    <Label htmlFor="edit-diabetes-type">
                      {t('patientManagement.editProfile.diabetesType')}
                    </Label>
                    <Input
                      id="edit-diabetes-type"
                      defaultValue={activePatient.diabetesType}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-status">
                    {t('patientManagement.editProfile.status')}
                  </Label>
                  <select
                    id="edit-status"
                    className="w-full p-2 border rounded-md"
                    defaultValue={activePatient.status}
                  >
                    <option value="stable">
                      {t('patientManagement.editProfile.statusOptions.stable')}
                    </option>
                    <option value="attention">
                      {t(
                        'patientManagement.editProfile.statusOptions.attention'
                      )}
                    </option>
                    <option value="amélioration">
                      {t(
                        'patientManagement.editProfile.statusOptions.improving'
                      )}
                    </option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="edit-glucose">
                    {t('patientManagement.editProfile.lastGlucose')}
                  </Label>
                  <Input
                    id="edit-glucose"
                    defaultValue={activePatient.lastGlucose}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-notes">
                    {t('patientManagement.editProfile.notes')}
                  </Label>
                  <Textarea
                    id="edit-notes"
                    defaultValue={activePatient.notes}
                    className="min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-next-appointment">
                    {t('patientManagement.editProfile.nextAppointment')}
                  </Label>
                  <Input
                    id="edit-next-appointment"
                    type="date"
                    defaultValue={activePatient.nextAppointment}
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                {t('patientManagement.editProfile.cancel')}
              </Button>
              <Button>{t('patientManagement.editProfile.save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
