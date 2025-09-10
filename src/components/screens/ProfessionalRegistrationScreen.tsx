import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentUploader } from '@/components/DocumentUploader';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Mail,
  User,
  Building,
  Globe,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  professionalType: string;
  licenseNumber: string;
  institution: string;
  country: string;
  city: string;
}

export const ProfessionalRegistrationScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    professionalType: '',
    licenseNumber: '',
    institution: '',
    country: '',
    city: '',
  });

  const PROFESSIONAL_TYPES = [
    { value: 'endocrinologist', label: t('profession.endocrinologist') },
    {
      value: 'general_practitioner',
      label: t('profession.general_practitioner'),
    },
    { value: 'diabetologist', label: t('profession.diabetologist') },
    { value: 'nutritionist', label: t('profession.nutritionist') },
    { value: 'nurse', label: t('profession.nurse') },
    { value: 'pharmacist', label: t('profession.pharmacist') },
    { value: 'psychologist', label: t('profession.psychologist') },
    { value: 'podiatrist', label: t('profession.podiatrist') },
  ];

  const COUNTRIES = [
    { value: 'CI', label: "Côte d'Ivoire" },
    { value: 'SN', label: 'Sénégal' },
    { value: 'BF', label: 'Burkina Faso' },
    { value: 'ML', label: 'Mali' },
    { value: 'NE', label: 'Niger' },
    { value: 'GH', label: 'Ghana' },
    { value: 'TG', label: 'Togo' },
    { value: 'BJ', label: 'Bénin' },
    { value: 'GN', label: 'Guinée' },
    { value: 'CM', label: 'Cameroun' },
  ];

  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string>('');

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadDocuments = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('professional-documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('professional-documents')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const sendNotificationEmail = async (
    type: string,
    applicationData: any,
    additionalData?: any
  ) => {
    try {
      await supabase.functions.invoke('send-professional-emails', {
        body: {
          type,
          to:
            type === 'admin_notification'
              ? 'admin@dare-platform.com'
              : applicationData.email,
          applicationData,
          ...additionalData,
        },
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'professionalType',
      'licenseNumber',
      'country',
      'city',
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast({
          title: t('professionalRegistrationScreen.toast.required_field_title'),
          description: t(
            'professionalRegistrationScreen.toast.required_field_description',
            { field }
          ),
          variant: 'destructive',
        });
        return false;
      }
    }

    if (documents.length === 0) {
      toast({
        title: t(
          'professionalRegistrationScreen.toast.required_documents_title'
        ),
        description: t(
          'professionalRegistrationScreen.toast.required_documents_description'
        ),
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1. Upload documents to Supabase Storage
      const documentUrls = await uploadDocuments(documents);

      // 2. Insert application into Supabase
      const { data, error } = await supabase
        .from('professional_applications')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            professional_type: formData.professionalType,
            license_number: formData.licenseNumber,
            institution: formData.institution || null,
            country: formData.country,
            city: formData.city,
            documents: documentUrls,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setApplicationId(data.id);

      // 3. Send confirmation email to professional
      const applicationData = {
        id: data.id,
        name: `${formData.firstName} ${formData.lastName}`,
        professionalType: formData.professionalType,
        country: formData.country,
        email: formData.email,
        institution: formData.institution,
      };

      await sendNotificationEmail('confirmation', applicationData);

      // 4. Send notification to admin
      await sendNotificationEmail('admin_notification', applicationData);

      // 5. Move to success step
      setStep(2);

      toast({
        title: t(
          'professionalRegistrationScreen.toast.application_submitted_title'
        ),
        description: t(
          'professionalRegistrationScreen.toast.application_submitted_description'
        ),
      });
    } catch (error: any) {
      console.error(t('professionalRegistrationScreen.toast.error'), error);
      toast({
        title: t(
          'professionalRegistrationScreen.toast.application_submitted_title'
        ),
        description: t(
          'professionalRegistrationScreen.toast.application_submitted_description'
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="p-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {t(
                  'professionalRegistrationScreen.application.submitted_success'
                )}
              </h1>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-emerald-800 font-medium">
                  {t('professionalRegistrationScreen.application.reference')}{' '}
                  <span className="font-mono text-lg">
                    {applicationId.substring(0, 8).toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="text-left space-y-3 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">
                  {t(
                    'professionalRegistrationScreen.application.nextSteps.title'
                  )}
                </h3>
                <ol className="text-blue-800 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>
                      <strong>
                        {t(
                          'professionalRegistrationScreen.application.nextSteps.review.title'
                        )}
                      </strong>{' '}
                      -{' '}
                      {t(
                        'professionalRegistrationScreen.application.nextSteps.review.description'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>
                      <strong>
                        {t(
                          'professionalRegistrationScreen.application.nextSteps.documents.title'
                        )}
                      </strong>{' '}
                      -{' '}
                      {t(
                        'professionalRegistrationScreen.application.nextSteps.documents.description'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>
                      <strong>
                        {t(
                          'professionalRegistrationScreen.application.nextSteps.emailNotification.title'
                        )}
                      </strong>{' '}
                      -{' '}
                      {t(
                        'professionalRegistrationScreen.application.nextSteps.emailNotification.description'
                      )}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>
                      <strong>
                        {t(
                          'professionalRegistrationScreen.application.nextSteps.accountActivation.title'
                        )}
                      </strong>{' '}
                      -{' '}
                      {t(
                        'professionalRegistrationScreen.application.nextSteps.accountActivation.description'
                      )}
                    </span>
                  </li>
                </ol>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  {t(
                    'professionalRegistrationScreen.registration.confirmationEmail',
                    {
                      email: formData.email,
                    }
                  )}
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')} variant="outline">
                {t('professionalRegistrationScreen.buttons.backToHome')}
              </Button>

              <Button
                onClick={() => navigate('/auth')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {t('professionalRegistrationScreen.buttons.login')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('professionalRegistrationScreen.apply.title')} 🏥
          </h1>
          <p className="text-lg text-gray-600">
            {t('professionalRegistrationScreen.apply.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('professionalRegistrationScreen.personalInfo.title')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t(
                      'professionalRegistrationScreen.personalInfo.firstNameLabel'
                    )}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={t(
                      'professionalRegistrationScreen.personalInfo.firstNamePlaceholder'
                    )}
                    value={formData.firstName}
                    onChange={e => updateFormData('firstName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    {t(
                      'professionalRegistrationScreen.personalInfo.lastNameLabel'
                    )}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={t(
                      'professionalRegistrationScreen.personalInfo.lastNamePlaceholder'
                    )}
                    value={formData.lastName}
                    onChange={e => updateFormData('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t(
                      'professionalRegistrationScreen.professionalInfo.emailLabel'
                    )}
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@hopital.com"
                    value={formData.email}
                    onChange={e => updateFormData('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {t(
                      'professionalRegistrationScreen.professionalInfo.phoneLabel'
                    )}
                  </Label>

                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+225 XX XX XX XX"
                    value={formData.phone}
                    onChange={e => updateFormData('phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Building className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('professionalRegistrationScreen.professionalInfo.header')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professionalType">
                    {t(
                      'professionalRegistrationScreen.professionalInfo.typeLabel'
                    )}
                  </Label>
                  <Select
                    value={formData.professionalType}
                    onValueChange={value =>
                      updateFormData('professionalType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          'professionalRegistrationScreen.professionalInfo.typePlaceholder'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFESSIONAL_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {t(
                            `professionalRegistrationScreen.professionalTypes.${type.value}`
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">
                    {t(
                      'professionalRegistrationScreen.professionalInfo.licenseLabel'
                    )}
                  </Label>
                  <Input
                    id="licenseNumber"
                    type="text"
                    placeholder={t(
                      'professionalRegistrationScreen.professionalInfo.licensePlaceholder'
                    )}
                    value={formData.licenseNumber}
                    onChange={e =>
                      updateFormData('licenseNumber', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">
                  {t(
                    'professionalRegistrationScreen.professionalInfo.institutionLabel'
                  )}
                </Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder={t(
                    'professionalRegistrationScreen.professionalInfo.institutionPlaceholder'
                  )}
                  value={formData.institution}
                  onChange={e => updateFormData('institution', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('professionalRegistrationScreen.location.header')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">
                    {t('professionalRegistrationScreen.location.countryLabel')}
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={value => updateFormData('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          'professionalRegistrationScreen.location.countryPlaceholder'
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(country => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    {t('professionalRegistrationScreen.location.cityLabel')}
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder={t(
                      'professionalRegistrationScreen.location.cityPlaceholder'
                    )}
                    value={formData.city}
                    onChange={e => updateFormData('city', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {t('professionalRegistrationScreen.documents.title')}
              </h2>
            </div>

            <DocumentUploader
              documents={documents}
              setDocuments={setDocuments}
              maxFiles={5}
            />
          </Card>

          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-yellow-800">
                  {t('professionalRegistrationScreen.terms.title')}
                </h3>
                <p className="text-sm text-yellow-700">
                  {t('professionalRegistrationScreen.terms.agreement')}
                </p>
                <p className="text-sm text-yellow-700">
                  {t('professionalRegistrationScreen.terms.privacy')}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[300px] bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-8 text-lg font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('professionalRegistrationScreen.application.submitting')}
                </>
              ) : (
                t('professionalRegistrationScreen.application.submit')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
