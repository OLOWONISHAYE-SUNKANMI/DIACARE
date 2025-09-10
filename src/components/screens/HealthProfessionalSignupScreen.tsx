import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DocumentUploader } from '@/components/DocumentUploader';
import { useTranslation } from 'react-i18next';

interface ProfessionType {
  id: string;
  name: string;
  icon: string;
  rate: string;
  description: string;
  specialty: string;
}

const HealthProfessionalSignup = () => {
  const { t } = useTranslation();
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    institution: '',
    city: '',
    country: '',
    specialty: '',
    experience: '',
    biography: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const professionalTypes = [
    {
      id: 'endocrinologist',
      icon: '🩺',
      specialty: 'endocrinologist',
      name: t(
        'healthProfessionalSignupScreen.professionals.endocrinologist.name'
      ),
      rate: t(
        'healthProfessionalSignupScreen.professionals.endocrinologist.rate'
      ),
      description: t(
        'healthProfessionalSignupScreen.professionals.endocrinologist.description'
      ),
    },
    {
      id: 'general_practitioner',
      icon: '👨‍⚕️',
      specialty: 'general_practitioner',
      name: t(
        'healthProfessionalSignupScreen.professionals.general_practitioner.name'
      ),
      rate: t(
        'healthProfessionalSignupScreen.professionals.general_practitioner.rate'
      ),
      description: t(
        'healthProfessionalSignupScreen.professionals.general_practitioner.description'
      ),
    },
    {
      id: 'psychologist',
      icon: '🧠',
      specialty: 'psychologist',
      name: t('healthProfessionalSignupScreen.professionals.psychologist.name'),
      rate: t('healthProfessionalSignupScreen.professionals.psychologist.rate'),
      description: t(
        'healthProfessionalSignupScreen.professionals.psychologist.description'
      ),
    },
    {
      id: 'nurse',
      icon: '👩‍⚕️',
      specialty: 'nurse',
      name: t('healthProfessionalSignupScreen.professionals.nurse.name'),
      rate: t('healthProfessionalSignupScreen.professionals.nurse.rate'),
      description: t(
        'healthProfessionalSignupScreen.professionals.nurse.description'
      ),
    },
    {
      id: 'nutritionist',
      icon: '🥗',
      specialty: 'nutritionist',
      name: t('healthProfessionalSignupScreen.professionals.nutritionist.name'),
      rate: t('healthProfessionalSignupScreen.professionals.nutritionist.rate'),
      description: t(
        'healthProfessionalSignupScreen.professionals.nutritionist.description'
      ),
    },
  ];

  const selectedProfessionData = professionalTypes.find(
    p => p.id === selectedProfession
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !selectedProfession ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.licenseNumber
    ) {
      toast({
        title: t('healthProfessionalSignupScreen.toastMissingFields.title'),
        description: t(
          'healthProfessionalSignupScreen.toastMissingFields.description'
        ),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Soumission de la candidature professionnelle
      const { error } = await supabase
        .from('professional_applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          license_number: formData.licenseNumber,
          institution: formData.institution,
          city: formData.city,
          country: formData.country,
          professional_type: selectedProfessionData?.specialty,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: t(
          'healthProfessionalSignupScreen.toastApplicationSubmitted.title'
        ),
        description: t(
          'healthProfessionalSignupScreen.toastApplicationSubmitted.description'
        ),
      });

      // Reset form
      setSelectedProfession('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        institution: '',
        city: '',
        country: '',
        specialty: '',
        experience: '',
        biography: '',
      });
      setDocuments([]);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: t('healthProfessionalSignupScreen.toastSubmissionError.title'),
        description: t(
          'healthProfessionalSignupScreen.toastSubmissionError.description'
        ),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          {t('healthProfessionalSignupScreen.professionalPortal.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('healthProfessionalSignupScreen.professionalPortal.subtitle')}
        </p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <CheckCircle className="w-5 h-5 text-medical-green" />
          <span className="text-sm">
            {t(
              'healthProfessionalSignupScreen.professionalPortal.benefits.freeRegistration'
            )}
          </span>
          <CheckCircle className="w-5 h-5 text-medical-green" />
          <span className="text-sm">
            {t(
              'healthProfessionalSignupScreen.professionalPortal.benefits.validatedWithin48h'
            )}
          </span>
          <CheckCircle className="w-5 h-5 text-medical-green" />
          <span className="text-sm">
            {t(
              'healthProfessionalSignupScreen.professionalPortal.benefits.securePayment'
            )}
          </span>
        </div>
      </div>

      {/* Sélection du type de professionnel */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('healthProfessionalSignupScreen.registrationSteps.step1.title')}
          </CardTitle>
          <CardDescription>
            {t(
              'healthProfessionalSignupScreen.registrationSteps.step1.description'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionalTypes.map(profession => (
              <button
                key={profession.id}
                onClick={() => {
                  setSelectedProfession(profession.id);
                  setFormData(prev => ({
                    ...prev,
                    specialty: profession.specialty,
                  }));
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  selectedProfession === profession.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{profession.icon}</div>
                <h3 className="font-semibold text-lg mb-1">
                  {profession.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {profession.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {profession.rate}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'inscription */}
      {selectedProfession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{selectedProfessionData?.icon}</span>
              {t(
                'healthProfessionalSignupScreen.registrationSteps.step2.title',
                {
                  name: selectedProfessionData?.name,
                }
              )}
            </CardTitle>
            <CardDescription>
              {t(
                'healthProfessionalSignupScreen.registrationSteps.step2.description'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.firstName'
                  )}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.firstNamePlaceholder'
                  )}
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.lastName'
                  )}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.lastNamePlaceholder'
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.email'
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.emailPlaceholder'
                  )}
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.phone'
                  )}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.phonePlaceholder'
                  )}
                />
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.licenseNumber'
                  )}
                </Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={e =>
                    handleInputChange('licenseNumber', e.target.value)
                  }
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.licenseNumberPlaceholder'
                  )}
                />
              </div>
              <div>
                <Label htmlFor="institution">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.institution'
                  )}
                </Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={e =>
                    handleInputChange('institution', e.target.value)
                  }
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.institutionPlaceholder'
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.city'
                  )}
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  placeholder={t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.cityPlaceholder'
                  )}
                />
              </div>
              <div>
                <Label htmlFor="country">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step2.country'
                  )}
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={value => handleInputChange('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countryPlaceholder'
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="senegal">
                      {t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countries.senegal'
                      )}
                    </SelectItem>
                    <SelectItem value="mali">
                      {t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countries.mali'
                      )}
                    </SelectItem>
                    <SelectItem value="burkina">
                      {t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countries.burkina'
                      )}
                    </SelectItem>
                    <SelectItem value="cote_ivoire">
                      {t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countries.cote_ivoire'
                      )}
                    </SelectItem>
                    <SelectItem value="guinea">
                      {t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countries.guinea'
                      )}
                    </SelectItem>
                    <SelectItem value="mauritania">
                      {t(
                        'healthProfessionalSignupScreen.registrationSteps.step2.countries.mauritania'
                      )}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experience">
                {t(
                  'healthProfessionalSignupScreen.registrationSteps.step2.experience'
                )}
              </Label>
              <Select
                value={formData.experience}
                onValueChange={value => handleInputChange('experience', value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'healthProfessionalSignupScreen.registrationSteps.step2.experiencePlaceholder'
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">
                    {t(
                      'healthProfessionalSignupScreen.registrationSteps.step2.experienceOptions.0-2'
                    )}
                  </SelectItem>
                  <SelectItem value="3-5">
                    {t(
                      'healthProfessionalSignupScreen.registrationSteps.step2.experienceOptions.3-5'
                    )}
                  </SelectItem>
                  <SelectItem value="6-10">
                    {t(
                      'healthProfessionalSignupScreen.registrationSteps.step2.experienceOptions.6-10'
                    )}
                  </SelectItem>
                  <SelectItem value="11-15">
                    {t(
                      'healthProfessionalSignupScreen.registrationSteps.step2.experienceOptions.11-15'
                    )}
                  </SelectItem>
                  <SelectItem value="15+">
                    {t(
                      'healthProfessionalSignupScreen.registrationSteps.step2.experienceOptions.15+'
                    )}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="biography">
                {t(
                  'healthProfessionalSignupScreen.registrationSteps.step2.biography'
                )}
              </Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={e => handleInputChange('biography', e.target.value)}
                placeholder={t(
                  'healthProfessionalSignupScreen.registrationSteps.step2.biographyPlaceholder'
                )}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload de documents */}
      {selectedProfession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t(
                'healthProfessionalSignupScreen.registrationSteps.step3.title'
              )}
            </CardTitle>
            <CardDescription>
              {t(
                'healthProfessionalSignupScreen.registrationSteps.step3.description'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader
              documents={documents}
              setDocuments={setDocuments}
              acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
              maxFiles={5}
            />
            {documents.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {t(
                    'healthProfessionalSignupScreen.registrationSteps.step3.selectedDocuments'
                  )}
                  : {documents.length}
                </p>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{doc.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bouton de soumission */}
      {selectedProfession && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {t(
                    'healthProfessionalSignupScreen.dareProCompensation.title'
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>
                      {t(
                        'healthProfessionalSignupScreen.dareProCompensation.endocrinologist'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>
                      {t(
                        'healthProfessionalSignupScreen.dareProCompensation.generalPractitioner'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>
                      {t(
                        'healthProfessionalSignupScreen.dareProCompensation.psychologist'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>
                      {t(
                        'healthProfessionalSignupScreen.dareProCompensation.nurse'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>
                      {t(
                        'healthProfessionalSignupScreen.dareProCompensation.nutritionist'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-medical-green" />
                    <span>
                      {t(
                        'healthProfessionalSignupScreen.dareProCompensation.automaticPayments'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedProfession}
                size="lg"
                className="w-full md:w-auto"
              >
                {loading
                  ? t(
                      'healthProfessionalSignupScreen.applicationForm.submitButton.loading'
                    )
                  : t(
                      'healthProfessionalSignupScreen.applicationForm.submitButton.default'
                    )}
              </Button>

              <p className="text-xs text-muted-foreground">
                {t('healthProfessionalSignupScreen.applicationForm.disclaimer')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthProfessionalSignup;
