import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PatientAccessNotification from '@/components/ui/PatientAccessNotification';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccessRequest {
  id: string;
  professional_code: string;
  patient_code: string;
  allowed_data_sections: string[];
  created_at: string;
  permission_status: string;
  max_consultations: number;
  used_consultations: number;
  expires_at: string | null;
  approved_at: string | null;
}

const PatientAccessScreen = () => {
  const { t } = useTranslation();
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAccessRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user's patient access code
      const { data: patientCode, error: codeError } = await supabase
        .from('patient_access_codes')
        .select('access_code')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (codeError || !patientCode) {
        console.error('No patient code found:', codeError);
        return;
      }

      // Get access requests for this patient
      const { data: requests, error } = await supabase
        .from('patient_access_permissions')
        .select('*')
        .eq('patient_code', patientCode.access_code)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAccessRequests(requests || []);
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessRequests();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            {t('patientAccessScreen.status.pending')}
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-emerald-600">
            {t('patientAccessScreen.status.approved')}
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive">
            {t('patientAccessScreen.status.denied')}
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline">
            {t('patientAccessScreen.status.expired')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t('patientAccessScreen.status.default', { status })}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner
          text={t('patientAccessScreen.loading.accessRequests')}
        />
      </div>
    );
  }

  const pendingRequests = accessRequests.filter(
    req => req.permission_status === 'pending'
  );
  const processedRequests = accessRequests.filter(
    req => req.permission_status !== 'pending'
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('patientAccessScreen.access.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('patientAccessScreen.access.subtitle')}
          </p>
        </div>
        <Button onClick={fetchAccessRequests} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('patientAccessScreen.access.refresh')}
        </Button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {t('patientAccessScreen.requests.pending', {
              count: pendingRequests.length,
            })}
          </h3>
          {pendingRequests.map(request => (
            <PatientAccessNotification
              key={request.id}
              accessRequest={request}
              onResponse={fetchAccessRequests}
            />
          ))}
        </div>
      )}

      {/* Processed Requests History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t('patientAccessScreen.access.history')}
        </h3>

        {processedRequests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              {t('patientAccessScreen.access.emptyHistory')}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {processedRequests.map(request => (
              <Card key={request.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Code: {request.professional_code}
                    </CardTitle>
                    {getStatusBadge(request.permission_status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>
                        {t('patientAccessScreen.access.requestedOn')}
                      </strong>

                      <br />
                      {formatDate(request.created_at)}
                    </div>
                    <div>
                      <strong>
                        {t('patientAccessScreen.access.respondedOn')}
                      </strong>

                      <br />
                      {formatDate(request.approved_at)}
                    </div>
                    <div>
                      <strong>Consultations:</strong>
                      <br />
                      {request.used_consultations} / {request.max_consultations}
                    </div>
                    <div>
                      <strong>Expire le:</strong>
                      <br />
                      {formatDate(request.expires_at)}
                    </div>
                  </div>

                  {request.allowed_data_sections.length > 0 && (
                    <div className="mt-3">
                      <strong className="text-sm">
                        {t('patientAccessScreen.access.authorizedData')}
                      </strong>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {request.allowed_data_sections.map(section => (
                          <Badge
                            key={section}
                            variant="outline"
                            className="text-xs"
                          >
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {pendingRequests.length === 0 && processedRequests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🔐</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t('patientAccessScreen.access.noRequestTitle')}
            </h3>
            <p className="text-muted-foreground">
              {t('patientAccessScreen.access.noRequestDescription')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientAccessScreen;
