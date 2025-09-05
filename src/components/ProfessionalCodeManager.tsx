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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Key,
  Copy,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ProfessionalCode {
  code: string;
  generated_at: string;
  specialty: string;
  is_active: boolean;
}

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  diabetes_type: string;
  glucose_readings: Array<{
    value: number;
    measured_at: string;
    meal_context: string;
  }>;
}

const ProfessionalCodeManager: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [professionalCode, setProfessionalCode] =
    useState<ProfessionalCode | null>(null);
  const [patientAccessCode, setPatientAccessCode] = useState('');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);
  const [showPatientData, setShowPatientData] = useState(false);

  // Generate professional code
  const generateProfessionalCode = async () => {
    setIsGenerating(true);
    try {
      const mockCode: ProfessionalCode = {
        code: `DARE-END-${Date.now().toString().slice(-6)}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`,
        generated_at: new Date().toISOString(),
        specialty: t('applicationCard.professional_endocrinologist'),
        is_active: true,
      };

      setProfessionalCode(mockCode);

      toast({
        title: t('professionalCodeManager.code_generated_title'),
        description: t('professionalCodeManager.code_generated_description'),
        type: 'success',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy code to clipboard
  const copyCodeToClipboard = () => {
    if (!professionalCode) return;

    navigator.clipboard.writeText(professionalCode.code);
    toast({
      title: t('professionalCodeManager.code_copied_title'),
      description: t('professionalCodeManager.code_copied_description'),
      type: 'success',
    });
  };

  // Access patient data
  const accessPatientData = async () => {
    if (!patientAccessCode.trim()) {
      toast({
        title: t('professionalCodeManager.missing_code_title'),
        description: t('professionalCodeManager.missing_code_description'),
        type: 'error',
      });
      return;
    }

    setIsAccessing(true);
    try {
      const mockPatientData: PatientData = {
        id: patientAccessCode,
        first_name: 'Marie',
        last_name: 'Dupont',
        diabetes_type: 'Type 2',
        glucose_readings: [
          {
            value: 142,
            measured_at: '2024-01-15T08:30:00Z',
            meal_context: t('professionalCodeManager.meal_fasting'),
          },
          {
            value: 180,
            measured_at: '2024-01-15T12:30:00Z',
            meal_context: t('professionalCodeManager.meal_after_meal'),
          },
          {
            value: 138,
            measured_at: '2024-01-15T18:00:00Z',
            meal_context: t('professionalCodeManager.meal_before_dinner'),
          },
        ],
      };

      setPatientData(mockPatientData);
      setShowPatientData(true);

      toast({
        title: t('professionalCodeManager.access_granted_title'),
        description: t('professionalCodeManager.access_granted_description'),
        type: 'success',
      });
    } catch (error) {
      toast({
        title: t('professionalCodeManager.access_denied_title'),
        description: t('professionalCodeManager.access_denied_description'),
        type: 'error',
      });
    } finally {
      setIsAccessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Professional Code Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            {t('professionalCodeManager.professional_id_code')}
          </CardTitle>
          <CardDescription>
            {t('professionalCodeManager.professional_code_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!professionalCode ? (
            <Button
              onClick={generateProfessionalCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              {t('professionalCodeManager.generate_professional_code')}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-lg font-semibold">
                      {professionalCode.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('professionalCodeManager.generated_on')}{' '}
                      {new Date(
                        professionalCode.generated_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t('professionalCodeManager.badge_active')}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyCodeToClipboard}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-amber-50 p-3 rounded border border-amber-200">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                <strong>
                  {t('professionalCodeManager.professional_code_warning')}
                </strong>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Data Access */}
      {professionalCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              {t('professionalCodeManager.patient_data_access_title')}
            </CardTitle>
            <CardDescription>
              {t('professionalCodeManager.patient_data_access_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="patientCode">
                {t('professionalCodeManager.patient_code_label')}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="patientCode"
                  placeholder={t(
                    'professionalCodeManager.patient_code_placeholder'
                  )}
                  value={patientAccessCode}
                  onChange={e => setPatientAccessCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={accessPatientData} disabled={isAccessing}>
                  {isAccessing ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{t('professionalCodeManager.all_access_tracked')}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Data Modal */}
      <Dialog open={showPatientData} onOpenChange={setShowPatientData}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('professionalCodeManager.secure_patient_data_title')}
            </DialogTitle>
            <DialogDescription>
              {t('professionalCodeManager.secure_patient_data_description')}
            </DialogDescription>
          </DialogHeader>

          {patientData && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800">
                  {t('professionalCodeManager.patient_information')}
                </h3>
                <p>
                  <strong>{t('professionalCodeManager.last_name')} :</strong>{' '}
                  {patientData.last_name}
                </p>
                <p>
                  <strong>{t('professionalCodeManager.first_name')} :</strong>{' '}
                  {patientData.first_name}
                </p>
                <p>
                  <strong>
                    {t('professionalCodeManager.diabetes_type')} :
                  </strong>{' '}
                  {patientData.diabetes_type}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">
                  {t('professionalCodeManager.recent_glucose_readings')}
                </h3>
                <div className="space-y-2">
                  {patientData.glucose_readings.map((reading, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>
                        {new Date(reading.measured_at).toLocaleDateString()} -{' '}
                        {reading.meal_context}
                      </span>
                      <Badge
                        variant={
                          reading.value > 140 ? 'destructive' : 'secondary'
                        }
                      >
                        {reading.value} mg/dL
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded border border-red-200 text-xs text-red-700">
                <strong>
                  {t('professionalCodeManager.confidentiality_notice')}
                </strong>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalCodeManager;
