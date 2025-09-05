import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

interface AccessRequest {
  id: string;
  professional_code: string;
  patient_code: string;
  allowed_data_sections: string[];
  created_at: string;
  permission_status: string;
  max_consultations: number;
}

interface PatientAccessNotificationProps {
  accessRequest: AccessRequest;
  onResponse?: () => void;
}

const PatientAccessNotification = ({
  accessRequest,
  onResponse,
}: PatientAccessNotificationProps) => {
  const { t } = useTranslation();
  const [isResponding, setIsResponding] = useState(false);
  const { toast } = useToast();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    function timeAgo(diffInHours: number) {
      if (diffInHours < 1) return t('professionalNotifications.time_justNow');
      if (diffInHours === 1) return t('professionalNotification.time_oneHour');
      if (diffInHours < 24)
        return t('professionalNotification.time_hours', { count: diffInHours });

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1)
        return t('professionalNotification.time_day', { count: diffInDays });
      return t('professionalNotifications.time_days', { count: diffInDays });
    }
  };

  const createAccessSession = async (request: AccessRequest) => {
    try {
      // Create a professional session record for tracking
      const { error } = await supabase.from('professional_sessions').insert({
        professional_code: request.professional_code,
        patient_code: request.patient_code,
        access_granted: true,
        patient_approved_at: new Date().toISOString(),
        data_sections_accessed: request.allowed_data_sections,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating access session:', error);
    }
  };

  const respondToRequest = async (approved: boolean) => {
    setIsResponding(true);

    try {
      // Calculate expiry date (24 hours from now if approved)
      const expiresAt = approved
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null;

      // Update permission in Supabase
      const { error } = await supabase
        .from('patient_access_permissions')
        .update({
          permission_status: approved ? 'approved' : 'denied',
          approved_at: approved ? new Date().toISOString() : null,
          expires_at: expiresAt,
        })
        .eq('id', accessRequest.id);

      if (error) throw error;

      if (approved) {
        // Create access session if approved
        await createAccessSession(accessRequest);

        toast({
          title: t('professionalNotifications.toast_accessGranted_title'),
          description: t(
            'professionalNotifications.toast_accessGranted_description'
          ),
        });
      } else {
        toast({
          title: t('professionalNotifications.toast_accessDenied_title'),
          description: t(
            'professionalNotifications.toast_accessDenied_description'
          ),
        });
      }

      // Call callback to refresh the list
      if (onResponse) {
        onResponse();
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: t('professionalNotifications.toast_error_title'),
        description: t('professionalNotifications.toast_error_description'),
        variant: 'destructive',
      });
    } finally {
      setIsResponding(false);
    }
  };

  const getSectionDisplayName = (section: string) => {
    const sectionNames: Record<string, string> = {
      glucose: t('professionalNotifications.section_glucose'),
      medications: t('professionalNotifications.section_medications'),
      meals: t('professionalNotifications.section_meals'),
      activities: t('professionalNotifications.section_activities'),
      notes: t('professionalNotifications.section_notes'),
      reports: t('professionalNotifications.section_reports'),
    };
    return sectionNames[section] || section;
  };

  return (
    <Card className="border-l-4 border-l-medical-blue">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-medical-blue/10 rounded-full flex items-center justify-center">
            <span className="text-xl">👨‍⚕️</span>
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-lg mb-2 text-foreground">
              🔐 {t('professionalNotifications.title_dataAccessRequest')}
            </h4>

            <Card className="bg-muted/50 mb-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong>
                      <strong>
                        {t('professionalNotifications.label_professionalCode')}
                      </strong>
                    </strong>
                    <br />
                    <code className="text-xs bg-background px-2 py-1 rounded">
                      {accessRequest.professional_code}
                    </code>
                  </div>
                  <div>
                    <strong>
                      <strong>
                        {t('professionalNotifications.label_maxConsultations')}
                      </strong>
                    </strong>
                    <br />
                    <Badge variant="secondary">
                      {accessRequest.max_consultations}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <strong>
                      {t('professionalNotifications.label_requested')}
                    </strong>{' '}
                    {formatTimeAgo(accessRequest.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-4">
              <h5 className="font-bold text-sm mb-2 text-foreground">
                {t('professionalNotification.title_requestedData')}
              </h5>
              <div className="flex flex-wrap gap-2">
                {accessRequest.allowed_data_sections.map(section => (
                  <Badge key={section} variant="outline">
                    {getSectionDisplayName(section)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => respondToRequest(false)}
                disabled={isResponding}
                variant="destructive"
                className="flex-1"
              >
                {t('professionalNotification.button_deny')}
              </Button>
              <Button
                onClick={() => respondToRequest(true)}
                disabled={isResponding}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {t('professionalNotification.button_approve')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientAccessNotification;
