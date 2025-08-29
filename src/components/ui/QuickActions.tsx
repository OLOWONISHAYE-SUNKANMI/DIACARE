import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, FileText, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const QuickActions = () => {
  const { t } = useTranslation();
  const [consultationDate, setConsultationDate] = useState<Date>();
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [patientOpen, setPatientOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleScheduleConsultation = () => {
    toast({
      title: 'Consultation programmée',
      description: 'La consultation a été ajoutée au planning',
    });
    setConsultationOpen(false);
  };

  const handleGenerateReport = () => {
    toast({
      title: 'Rapport généré',
      description: 'Le rapport a été généré avec succès',
    });
    setReportOpen(false);
  };

  const handleAddPatient = () => {
    toast({
      title: 'Patient ajouté',
      description: 'Le nouveau patient a été ajouté à votre liste',
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
            {t(
              'professionalDashboard.overview.quickActions.scheduleAppointment.title'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t(
                'professionalDashboard.overview.quickActions.scheduleAppointment.title'
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient-select">Patient</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.patient.placeholder'
                    )}
                  />
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
                    variant={'outline'}
                    className={cn(
                      'justify-start text-left font-normal',
                      !consultationDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {consultationDate ? (
                      format(consultationDate, 'PPP', { locale: fr })
                    ) : (
                      <span>
                        {t(
                          'professionalDashboard.overview.quickActions.scheduleAppointment.date.placeholder'
                        )}
                      </span>
                    )}
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
              <Label htmlFor="time">
                {t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.time.title'
                )}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.time.placeholder'
                    )}
                  />
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
              <Label htmlFor="type">
                {t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.title'
                )}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.placeholder.title'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">
                    {t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.placeholder.routine'
                    )}
                  </SelectItem>
                  <SelectItem value="urgent">
                    {t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.placeholder.urgent'
                    )}
                  </SelectItem>
                  <SelectItem value="teleconsultation">
                    {t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.placeholder.teleconsultation'
                    )}
                  </SelectItem>
                  <SelectItem value="first">
                    {t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.placeholder.first'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">
                Notes (
                {t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.notes.title'
                )}
                )
              </Label>
              <Textarea
                placeholder={t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.notes.placeholder'
                )}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setConsultationOpen(false)}
            >
              {t(
                'professionalDashboard.overview.quickActions.scheduleAppointment.button1'
              )}
            </Button>
            <Button onClick={handleScheduleConsultation}>
              {t(
                'professionalDashboard.overview.quickActions.scheduleAppointment.button2'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Générer un rapport */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            {t(
              'professionalDashboard.overview.quickActions.reportGenerator.title'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t(
                'professionalDashboard.overview.quickActions.reportGenerator.title'
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="report-type">
                {t(
                  'professionalDashboard.overview.quickActions.reportGenerator.reportType.title'
                )}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.reportGenerator.reportType.placeholder.title'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">
                    placeholder=
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.reportType.placeholder.monthly'
                    )}
                  </SelectItem>
                  <SelectItem value="patient">
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.reportType.placeholder.patient'
                    )}
                  </SelectItem>
                  <SelectItem value="financial">
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.reportType.placeholder.financial'
                    )}
                  </SelectItem>
                  <SelectItem value="activity">
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.reportType.placeholder.activity'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">
                {t(
                  'professionalDashboard.overview.quickActions.reportGenerator.timeframe.title'
                )}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.reportGenerator.timeframe.placeholder.title'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">
                    placeholder=
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.timeframe.placeholder.lastWeek'
                    )}
                  </SelectItem>
                  <SelectItem value="last-month">
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.timeframe.placeholder.lastMonth'
                    )}
                  </SelectItem>
                  <SelectItem value="last-quarter">
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.timeframe.placeholder.lastQuarter'
                    )}
                  </SelectItem>
                  <SelectItem value="custom">
                    {t(
                      'professionalDashboard.overview.quickActions.reportGenerator.timeframe.placeholder.custom'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="format">Format</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.reportGenerator.format.placeholder'
                    )}
                  />
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
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              {t(
                'professionalDashboard.overview.quickActions.reportGenerator.button1'
              )}
            </Button>
            <Button onClick={handleGenerateReport}>
              {t(
                'professionalDashboard.overview.quickActions.reportGenerator.button2'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ajouter un patient */}
      <Dialog open={patientOpen} onOpenChange={setPatientOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            {t('professionalDashboard.overview.quickActions.addPatient.title')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t(
                'professionalDashboard.overview.quickActions.addPatient.subtitle'
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">
                  {t(
                    'professionalDashboard.overview.quickActions.addPatient.name.firstName'
                  )}
                </Label>
                <Input
                  id="first-name"
                  placeholder={t(
                    'professionalDashboard.overview.quickActions.addPatient.name.firstName'
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">
                  {' '}
                  {t(
                    'professionalDashboard.overview.quickActions.addPatient.name.lastName'
                  )}
                </Label>
                <Input
                  id="last-name"
                  placeholder={t(
                    'professionalDashboard.overview.quickActions.addPatient.name.lastName'
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemple.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">
                {t(
                  'professionalDashboard.overview.quickActions.addPatient.number'
                )}
              </Label>
              <Input id="phone" placeholder="+33 6 12 34 56 78" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diabetes-type">
                {t(
                  'professionalDashboard.overview.quickActions.addPatient.diabetesTypes.title'
                )}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.addPatient.diabetesTypes.placeholder.title'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type1">Type 1</SelectItem>
                  <SelectItem value="type2">Type 2</SelectItem>
                  <SelectItem value="gestational">
                    {t(
                      'professionalDashboard.overview.quickActions.addPatient.diabetesTypes.placeholder.gestational'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">
                {t(
                  'professionalDashboard.overview.quickActions.addPatient.medicalNotes.title'
                )}
              </Label>
              <Textarea
                placeholder={t(
                  'professionalDashboard.overview.quickActions.addPatient.medicalNotes.placeholder'
                )}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setPatientOpen(false)}>
              {t(
                'professionalDashboard.overview.quickActions.addPatient.button1'
              )}
            </Button>
            <Button onClick={handleAddPatient}>
              {t(
                'professionalDashboard.overview.quickActions.addPatient.button2'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paramètres du compte */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {t(
              'professionalDashboard.overview.quickActions.accountSetting.title'
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t(
                'professionalDashboard.overview.quickActions.accountSetting.title'
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="availability">
                {t(
                  'professionalDashboard.overview.quickActions.accountSetting.currentStatus.title'
                )}
              </Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.accountSetting.currentStatus.placeholder'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">
                    {t(
                      'professionalDashboard.overview.quickActions.accountSetting.currentStatus.options.available'
                    )}
                  </SelectItem>
                  <SelectItem value="busy">
                    {' '}
                    {t(
                      'professionalDashboard.overview.quickActions.accountSetting.currentStatus.options.busy'
                    )}
                  </SelectItem>
                  <SelectItem value="offline">
                    {t(
                      'professionalDashboard.overview.quickActions.accountSetting.currentStatus.options.offline'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notifications">Notifications</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'professionalDashboard.overview.quickActions.accountSetting.notifications.placeholder'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t(
                      'professionalDashboard.overview.quickActions.accountSetting.notifications.options.all'
                    )}
                  </SelectItem>
                  <SelectItem value="important">
                    {t(
                      'professionalDashboard.overview.quickActions.accountSetting.notifications.options.important'
                    )}
                  </SelectItem>
                  <SelectItem value="none">
                    {t(
                      'professionalDashboard.overview.quickActions.accountSetting.notifications.options.none'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="consultation-rate">
                {t(
                  'professionalDashboard.overview.quickActions.accountSetting.consultationFee'
                )}{' '}
                consultation (XOF)
              </Label>
              <Input id="consultation-rate" type="number" placeholder="5000" />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              {t(
                'professionalDashboard.overview.quickActions.accountSetting.button1'
              )}
            </Button>
            <Button>
              {t(
                'professionalDashboard.overview.quickActions.accountSetting.button2'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
