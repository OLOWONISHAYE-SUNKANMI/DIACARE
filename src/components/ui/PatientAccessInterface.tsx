import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  User, 
  Clock, 
  Activity, 
  Pill,
  Apple,
  TrendingUp,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  QrCode
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import VideoCallInterface from './VideoCallInterface';

interface PatientData {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
  glucose_readings: Array<{
    id: string;
    glucose_value: number;
    measured_at: string;
    notes?: string;
  }>;
  insulin_injections: Array<{
    id: string;
    insulin_type: string;
    dose_units: number;
    injection_time: string;
    notes?: string;
  }>;
  meal_entries: Array<{
    id: string;
    meal_name: string;
    total_carbs: number;
    meal_time: string;
    notes?: string;
  }>;
  activity_entries: Array<{
    id: string;
    activity_name: string;
    duration_minutes: number;
    activity_time: string;
    notes?: string;
  }>;
}

interface PatientAccessInterfaceProps {
  professionalCode?: string;
  onDataAccessed?: (patientData: PatientData) => void;
}

const PatientAccessInterface: React.FC<PatientAccessInterfaceProps> = ({ 
  professionalCode,
  onDataAccessed 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [patientCode, setPatientCode] = useState('');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  useEffect(() => {
    if (user) {
      generatePatientAccessCode();
    }
  }, [user]);

  const generatePatientAccessCode = async () => {
    if (!user) return;

    try {
      const { data: existingCode } = await supabase
        .from('patient_access_codes')
        .select('access_code')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (existingCode) {
        setPatientCode(existingCode.access_code);
      } else {
        // Generate new code
        const { data: newCode, error } = await supabase.rpc('generate_patient_access_code');
        
        if (error) throw error;

        const { error: insertError } = await supabase
          .from('patient_access_codes')
          .insert({
            user_id: user.id,
            access_code: newCode,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            is_active: true
          });

        if (insertError) throw insertError;

        setPatientCode(newCode);
      }
    } catch (error) {
      console.error('Error generating patient access code:', error);
      toast({
        title: t('errors.codeGenerationError'),
        description: t('errors.tryAgainLater'),
        variant: 'destructive'
      });
    }
  };

  const accessPatientData = async (inputCode: string) => {
    if (!professionalCode) {
      toast({
        title: t('errors.noProfessionalCode'),
        description: t('errors.professionalCodeRequired'),
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Validate patient code and get user data
      const { data: patientCodeData, error: codeError } = await supabase
        .from('patient_access_codes')
        .select(`
          user_id,
          profiles:user_id (
            first_name,
            last_name,
            phone,
            created_at
          )
        `)
        .eq('access_code', inputCode)
        .eq('is_active', true)
        .single();

      if (codeError || !patientCodeData) {
        throw new Error(t('errors.invalidPatientCode'));
      }

      // Get patient's medical data (mock data for demo)
      const glucoseRes = { data: [] };
      const [insulinRes, mealsRes, activityRes] = await Promise.all([
        
        supabase
          .from('insulin_injections')
          .select('*')
          .eq('user_id', patientCodeData.user_id)
          .order('injection_time', { ascending: false })
          .limit(10),
        
        supabase
          .from('meal_entries')
          .select('*')
          .eq('user_id', patientCodeData.user_id)
          .order('meal_time', { ascending: false })
          .limit(10),
        
        supabase
          .from('activity_entries')
          .select('*')
          .eq('user_id', patientCodeData.user_id)
          .order('activity_time', { ascending: false })
          .limit(10)
      ]);

      const compiledPatientData: PatientData = {
        id: patientCodeData.user_id,
        first_name: 'Patient',
        last_name: 'Demo',
        phone: '+221 XX XX XX XX',
        created_at: new Date().toISOString(),
        glucose_readings: glucoseRes.data || [],
        insulin_injections: insulinRes.data || [],
        meal_entries: mealsRes.data || [],
        activity_entries: activityRes.data || []
      };

      setPatientData(compiledPatientData);
      setAccessGranted(true);
      onDataAccessed?.(compiledPatientData);

      // Create professional session record
      const { data: sessionData, error: sessionError } = await supabase
        .from('professional_sessions')
        .insert({
          professional_code: professionalCode,
          patient_code: inputCode,
          patient_name: `${compiledPatientData.first_name} ${compiledPatientData.last_name}`,
          access_granted: true,
          consultation_started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (!sessionError) {
        setCurrentSession(sessionData);
      }

      toast({
        title: t('success.accessGranted'),
        description: t('success.patientDataLoaded'),
      });

    } catch (error: any) {
      console.error('Error accessing patient data:', error);
      toast({
        title: t('errors.accessError'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('success.copiedToClipboard'),
        description: t('success.codeCopied'),
      });
    });
  };

  const startVideoCall = () => {
    setShowVideoCall(true);
  };

  const endVideoCall = async () => {
    setShowVideoCall(false);
    
    if (currentSession) {
      // Update session with consultation end time
      await supabase
        .from('professional_sessions')
        .update({
          consultation_ended_at: new Date().toISOString()
        })
        .eq('id', currentSession.id);

      // Add to professional earnings
      const { data: rates } = await supabase
        .from('professional_rates')
        .select('rate_per_consultation')
        .limit(1)
        .single();

      if (rates) {
        await supabase.rpc('calculate_professional_earnings', {
          _teleconsultation_id: currentSession.id,
          _platform_fee_percentage: 10.0
        });
      }
    }
  };

  if (showVideoCall) {
    return (
      <VideoCallInterface
        isHost={true}
        patientName={patientData ? `${patientData.first_name} ${patientData.last_name}` : 'Patient'}
        onEndCall={endVideoCall}
        onCallStarted={() => {
          toast({
            title: t('videoCall.consultationStarted'),
            description: t('videoCall.revenueWillBeAdded'),
          });
        }}
      />
    );
  }

  // Patient view - show access code
  if (!professionalCode && user) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              {t('patientAccess.yourAccessCode')}
            </CardTitle>
            <CardDescription>
              {t('patientAccess.shareWithProfessional')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patientCode ? (
              <>
                <div className="text-center p-6 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCode(!showCode)}
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <QrCode className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="text-3xl font-bold font-mono tracking-wider text-primary mb-2">
                    {showCode ? patientCode : '••••••'}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(patientCode)}
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {t('buttons.copyCode')}
                  </Button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t('patientAccess.codeInstructions')}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {t('patientAccess.expiresIn24h')}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">{t('patientAccess.generatingCode')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Professional view
  if (!accessGranted) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('professionalAccess.accessPatientData')}
            </CardTitle>
            <CardDescription>
              {t('professionalAccess.enterPatientCode')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('placeholders.patientCode')}
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-wider"
                maxLength={6}
              />
            </div>
            
            <Button
              onClick={() => accessPatientData(patientCode)}
              disabled={loading || patientCode.length !== 6}
              className="w-full"
            >
              {loading ? t('buttons.accessing') : t('buttons.accessData')}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('professionalAccess.secureAccess')}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Patient data view
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Patient header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>
                  {patientData?.first_name} {patientData?.last_name}
                </CardTitle>
                <CardDescription>
                  {t('labels.patientSince')}: {new Date(patientData?.created_at || '').toLocaleDateString('fr-FR')}
                </CardDescription>
              </div>
            </div>

            <Button 
              onClick={startVideoCall}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <VideoCallInterface className="w-4 h-4 mr-2" />
              {t('buttons.startVideoCall')}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Glucose readings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              {t('sections.glucoseReadings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientData?.glucose_readings.length ? (
              <div className="space-y-3">
                {patientData.glucose_readings.slice(0, 5).map((reading) => (
                  <div key={reading.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="font-semibold">{reading.glucose_value} mg/dL</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reading.measured_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge 
                      variant={reading.glucose_value > 180 ? "destructive" : 
                              reading.glucose_value < 70 ? "destructive" : "default"}
                    >
                      {reading.glucose_value > 180 ? t('levels.high') : 
                       reading.glucose_value < 70 ? t('levels.low') : t('levels.normal')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('noData.glucose')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Insulin injections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              {t('sections.insulinInjections')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientData?.insulin_injections.length ? (
              <div className="space-y-3">
                {patientData.insulin_injections.slice(0, 5).map((injection) => (
                  <div key={injection.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="font-semibold">{injection.insulin_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {injection.dose_units} unités - {new Date(injection.injection_time).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('noData.insulin')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Meals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-green-500" />
              {t('sections.meals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientData?.meal_entries.length ? (
              <div className="space-y-3">
                {patientData.meal_entries.slice(0, 5).map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="font-semibold">{meal.meal_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {meal.total_carbs}g glucides - {new Date(meal.meal_time).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('noData.meals')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              {t('sections.activities')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patientData?.activity_entries.length ? (
              <div className="space-y-3">
                {patientData.activity_entries.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <div>
                      <p className="font-semibold">{activity.activity_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.duration_minutes} min - {new Date(activity.activity_time).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                {t('noData.activities')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientAccessInterface;