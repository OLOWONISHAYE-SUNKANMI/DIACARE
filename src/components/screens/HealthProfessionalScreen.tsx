import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Stethoscope,
  Video,
  Calendar,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProfessionalCodeManager from '@/components/ProfessionalCodeManager';
import { useTranslation } from 'react-i18next';

const HealthProfessionalScreen = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [charterAccepted, setCharterAccepted] = useState<boolean | null>(null);
  const [showCharter, setShowCharter] = useState(false);
  const { toast } = useToast();

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier que les deux checkboxes sont cochées
    const termsChecked = (document.getElementById('terms') as HTMLInputElement)
      ?.checked;
    const charterChecked = (
      document.getElementById('charter') as HTMLInputElement
    )?.checked;

    if (!termsChecked || !charterChecked) {
      toast({
        title: t('healthProfessionalScreen.acceptanceRequiredTitle'),
        description: t(
          'healthProfessionalScreen.acceptanceRequiredDescription'
        ),
        variant: 'destructive',
      });
      return;
    }

    setShowCharter(true);
  };

  const handleCharterAcceptance = (accepted: boolean) => {
    setCharterAccepted(accepted);
    setShowCharter(false);

    if (accepted) {
      toast({
        title: t('healthProfessionalScreen.registration.submittedTitle'),
        description: t(
          'healthProfessionalScreen.registration.submittedDescription'
        ),
      });
      setRegistrationStep(2);
    } else {
      toast({
        title: t('healthProfessionalScreen.registration.accessDeniedTitle'),
        description: t(
          'healthProfessionalScreen.registration.accessDeniedDescription'
        ),
        variant: 'destructive',
      });
    }
  };

  const handleConsultationStart = () => {
    toast({
      title: t('healthProfessionalScreen.teleconsultation.startedTitle'),
      description: t(
        'healthProfessionalScreen.teleconsultation.startedDescription'
      ),
    });
  };

  // Mock data
  const consultations = [
    {
      id: 1,
      patient: 'Marie D.',
      time: '14:30',
      type: t('healthProfessionalScreen.consultationTypes.diabetesFollowUp'),
      status: t('healthProfessionalScreen.consultationStatuses.pending'),
      avatar: '/api/placeholder/32/32',
    },
    {
      id: 2,
      patient: 'Jean M.',
      time: '15:00',
      type: t('healthProfessionalScreen.consultationTypes.urgentConsultation'),
      status: t('healthProfessionalScreen.consultationStatuses.inProgress'),
      avatar: '/api/placeholder/32/32',
    },
    {
      id: 3,
      patient: 'Sophie L.',
      time: '15:30',
      type: t('healthProfessionalScreen.consultationTypes.bloodSugarCheck'),
      status: t('healthProfessionalScreen.consultationStatuses.scheduled'),
      avatar: '/api/placeholder/32/32',
    },
  ];

  const earnings = {
    today: 6000,
    week: 42000,
    month: 168000,
    pending: 12000,
  };

  if (registrationStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {t('healthProfessionalScreen.professionalPortal.title')}
              </CardTitle>
              <CardDescription>
                {t('healthProfessionalScreen.professionalPortal.description')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">
                      {t('healthProfessionalScreen.formLabels.firstName')}
                    </Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">
                      {t('healthProfessionalScreen.formLabels.lastName')}
                    </Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialty">
                    {t('healthProfessionalScreen.formLabels.specialty')}
                  </Label>
                  <select
                    id="specialty"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">
                      {t(
                        'healthProfessionalScreen.formLabels.specialtyPlaceholder'
                      )}
                    </option>
                    <option value="endocrinologist">
                      {t(
                        'healthProfessionalScreen.formLabels.specialties.endocrinologist'
                      )}
                    </option>
                    <option value="generalPractitioner">
                      {t(
                        'healthProfessionalScreen.formLabels.specialties.generalPractitioner'
                      )}
                    </option>
                    <option value="diabetologist">
                      {t(
                        'healthProfessionalScreen.formLabels.specialties.diabetologist'
                      )}
                    </option>
                    <option value="nutritionist">
                      {t(
                        'healthProfessionalScreen.formLabels.specialties.nutritionist'
                      )}
                    </option>
                    <option value="diabetesNurse">
                      {t(
                        'healthProfessionalScreen.formLabels.specialties.diabetesNurse'
                      )}
                    </option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="license">
                    {t('healthProfessionalScreen.formLabels.license')}
                  </Label>
                  <Input
                    id="license"
                    placeholder={t(
                      'healthProfessionalScreen.formLabels.licensePlaceholder'
                    )}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="hospital">
                    {t('healthProfessionalScreen.formLabels.hospital')}
                  </Label>
                  <Input
                    id="hospital"
                    placeholder={t(
                      'healthProfessionalScreen.formLabels.hospitalPlaceholder'
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    {t('healthProfessionalScreen.formLabels.email')}
                  </Label>
                  <Input id="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="phone">
                    {t('healthProfessionalScreen.formLabels.phone')}
                  </Label>
                  <Input id="phone" type="tel" required />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <Label htmlFor="terms" className="text-sm">
                      {t('healthProfessionalScreen.formLabels.terms')}
                    </Label>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="charter" className="mt-1" />
                    <Label htmlFor="charter" className="text-sm">
                      {t('healthProfessionalScreen.formLabels.charter')}
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {t('healthProfessionalScreen.formLabels.submitApplication')}
                  <FileText className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold mb-2">
                  {t('healthProfessionalScreen.professionalBenefits.title')}
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    {t(
                      'healthProfessionalScreen.professionalBenefits.list.one'
                    )}
                  </li>
                  <li>
                    {t(
                      'healthProfessionalScreen.professionalBenefits.list.two'
                    )}
                  </li>
                  <li>
                    {t(
                      'healthProfessionalScreen.professionalBenefits.list.three'
                    )}
                  </li>
                  <li>
                    {t(
                      'healthProfessionalScreen.professionalBenefits.list.four'
                    )}
                  </li>
                  <li>
                    {t(
                      'healthProfessionalScreen.professionalBenefits.list.five'
                    )}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Dr. Martin Dubois</h1>
                <p className="text-sm text-muted-foreground">
                  {t(
                    'healthProfessionalScreen.professionalInfo.endocrinologist'
                  )}{' '}
                  - RPPS: 12345678901
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {t('healthProfessionalScreen.professionalInfo.verified')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">
              {t('healthProfessionalScreen.tabs.dashboard')}
            </TabsTrigger>
            <TabsTrigger value="consultations">
              {t('tabs.consultations')}
            </TabsTrigger>
            <TabsTrigger value="earnings">
              {t('healthProfessionalScreen.tabs.earnings')}
            </TabsTrigger>
            <TabsTrigger value="patients">
              {t('healthProfessionalScreen.tabs.patients')}
            </TabsTrigger>
            <TabsTrigger value="codes">
              {t('healthProfessionalScreen.tabs.access_codes')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-muted-foreground">
                        {t('healthProfessionalScreen..labels.patients_tracked')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Video className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-muted-foreground">
                        {t(
                          'healthProfessionalScreen.labels.today_consultations'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">6000 FCFA</p>
                      <p className="text-muted-foreground">
                        {t('healthProfessionalScreen.labels.today_earnings')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">4.9</p>
                      <p className="text-muted-foreground">
                        {t('healthProfessionalScreen.labels.average_rating')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prochaines consultations */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {t('healthProfessionalScreen.labels.upcoming_consultations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map(consultation => (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={consultation.avatar} />
                          <AvatarFallback>
                            {consultation.patient.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{consultation.patient}</p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{consultation.time}</p>
                        <Badge
                          variant={
                            consultation.status === 'En cours'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {t(
                            `consultation.status.${consultation.status.replace(/\s+/g, '_').toLowerCase()}`
                          )}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={handleConsultationStart}>
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t(
                    'healthProfessionalScreen.dashboard.consultations_management.title'
                  )}
                </CardTitle>
                <CardDescription>
                  {t(
                    'healthProfessionalScreen.dashboard.consultations_management.description'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {t(
                        'healthProfessionalScreen.dashboard.consultations_management.available_slots'
                      )}
                    </h3>
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      {t(
                        'healthProfessionalScreen.dashboard.dashboard.consultations_management.manage_slots'
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="font-medium">
                          {t(
                            'healthProfessionalScreen.dashboard.free_slots.title'
                          )}
                        </p>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">
                          {t(
                            'healthProfessionalScreen.dashboard.free_slots.subtitle'
                          )}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <Video className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium">
                          {t(
                            'healthProfessionalScreen.dashboard.scheduled_consultations.title'
                          )}
                        </p>
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-sm text-muted-foreground">
                          {t(
                            'healthProfessionalScreen.dashboard.scheduled_consultations.subtitle'
                          )}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <p className="font-medium">
                          {t(
                            'healthProfessionalScreen.dashboard.dashboard.completed_consultations.title'
                          )}
                        </p>
                        <p className="text-2xl font-bold">127</p>
                        <p className="text-sm text-muted-foreground">
                          {t(
                            'healthProfessionalScreen.dashboard.dashboard.completed_consultations.subtitle'
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('dashboard.earnings.detailed_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>
                      {t('healthProfessionalScreen.dashboard.earnings.today')}
                    </span>
                    <span className="font-semibold">{earnings.today} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>
                      {t('healthProfessionalScreen.dashboard.earnings.week')}
                    </span>
                    <span className="font-semibold">{earnings.week} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>
                      {t('healthProfessionalScreen.dashboard.earnings.month')}
                    </span>
                    <span className="font-semibold">{earnings.month} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-orange-600">
                    <span>
                      {t('healthProfessionalScreen.dashboard.earnings.pending')}
                    </span>
                    <span className="font-semibold">
                      {earnings.pending} FCFA
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.auto_payments.title')}</CardTitle>
                  <CardDescription>
                    {t('dashboard.auto_payments.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">
                            {t(
                              'healthProfessionalScreen.dashboard.auto_payments.last_transfer'
                            )}
                          </p>
                          <p className="text-sm text-green-600">
                            15{' '}
                            {t(
                              'healthProfessionalScreen.dashboard.auto_payments.january'
                            )}{' '}
                            2024
                          </p>
                        </div>
                        <p className="text-lg font-bold text-green-800">
                          47,250 FCFA
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-orange-800">
                            {t(
                              'healthProfessionalScreen.dashboard.auto_payments.next_transfer'
                            )}
                          </p>
                          <p className="text-sm text-orange-600">
                            31{' '}
                            {t(
                              'healthProfessionalScreen.dashboard.auto_payments.january'
                            )}{' '}
                            2024
                          </p>
                        </div>
                        <p className="text-lg font-bold text-orange-800">
                          {earnings.pending} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('healthProfessionalScreen.patients.title')}
                </CardTitle>
                <CardDescription>
                  {t('healthProfessionalScreen.patients.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map((consultation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={consultation.avatar} />
                          <AvatarFallback>
                            {consultation.patient.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{consultation.patient}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('healthProfessionalScreen.patients.type')} Type 2
                            -{' '}
                            {t('healthProfessionalScreen.patients.lastGlucose')}
                            : 142 mg/dL
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          {t('healthProfessionalScreen.patients.record')}
                        </Button>
                        <Button size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          {t('healthProfessionalScreen.patients.contact')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes" className="mt-6">
            <ProfessionalCodeManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modale Charte Déontologique */}
      <Dialog open={showCharter} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {t('healthProfessionalScreen.dialog.codeOfConduct.title')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('healthProfessionalScreen.dialog.codeOfConduct.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="whitespace-pre-line">
                {t('healthProfessionalScreen.codeOfConductFull')}
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              {t('healthProfessionalScreen.charterFooter.note')}
            </p>
            <div className="flex space-x-4 w-full">
              <Button
                variant="outline"
                onClick={() => handleCharterAcceptance(false)}
                className="flex-1"
              >
                {t('healthProfessionalScreen.charterFooter.buttons.decline')}
              </Button>
              <Button
                onClick={() => handleCharterAcceptance(true)}
                className="flex-1"
              >
                {t('healthProfessionalScreen.charterFooter.buttons.accept')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthProfessionalScreen;
