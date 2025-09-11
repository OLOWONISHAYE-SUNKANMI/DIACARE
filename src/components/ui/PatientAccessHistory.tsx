import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AuditSystem } from '@/utils/AuditSystem';
import {
  Calendar,
  Clock,
  Shield,
  Download,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AccessHistoryItem {
  id: string;
  professionalName: string;
  professionalType: string;
  professionalCode: string;
  timestamp: string;
  duration: number;
  actionType: 'consultation' | 'view' | 'download' | 'export';
  dataAccessed: string[];
  ipAddress?: string;
  isSuspicious?: boolean;
}

interface PatientAccessHistoryProps {
  patientId: string;
}

export const PatientAccessHistory: React.FC<PatientAccessHistoryProps> = ({
  patientId,
}) => {
  const { t } = useTranslation();
  const [accessHistory, setAccessHistory] = useState<AccessHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (patientId) {
      loadAccessHistory(patientId);
    }
  }, [patientId]);

  const loadAccessHistory = async (patientId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Charger l'historique des 30 derniers jours
      const timeframe = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      };

      const report = await AuditSystem.generateAccessReport(
        patientId,
        timeframe
      );

      // Pour le moment, utiliser des données simulées réalistes
      const mockHistory: AccessHistoryItem[] = [
        {
          id: '1',
          professionalName: 'Dr. Sarah Martin',
          professionalType: t(
            'patientAccessHistory.professionalType.endocrinologist'
          ),
          professionalCode: 'ENDO-SN-2847',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          duration: 25,
          actionType: 'consultation',
          dataAccessed: [
            t('patientAccessHistory.data.glucose'),
            t('patientAccessHistory.data.medications'),
            t('patientAccessHistory.data.overview'),
          ],
          isSuspicious: false,
        },
        {
          id: '2',
          professionalName: 'Dr. Ahmed Diop',
          professionalType: t(
            'patientAccessHistory.professionalType.generalPractitioner'
          ),
          professionalCode: 'MGEN-SN-1523',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 8,
          actionType: 'view',
          dataAccessed: [
            t('patientAccessHistory.data.glucose'),
            t('patientAccessHistory.data.overview'),
          ],
          isSuspicious: false,
        },
        {
          id: '3',
          professionalName: 'Fatou Sow',
          professionalType: t(
            'patientAccessHistory.professionalType.nutritionist'
          ),
          professionalCode: 'NUTR-SN-8934',
          timestamp: new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString(),
          duration: 15,
          actionType: 'consultation',
          dataAccessed: [
            t('patientAccessHistory.data.meals'),
            t('patientAccessHistory.data.glucose'),
            t('patientAccessHistory.data.activities'),
          ],
          isSuspicious: false,
        },
        {
          id: '4',
          professionalName: 'Dr. Mamadou Fall',
          professionalType: t(
            'patientAccessHistory.professionalType.endocrinologist'
          ),
          professionalCode: 'ENDO-SN-4721',
          timestamp: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          duration: 35,
          actionType: 'view',
          dataAccessed: [
            t('patientAccessHistory.data.glucose'),
            t('patientAccessHistory.data.medications'),
            t('patientAccessHistory.data.meals'),
            t('patientAccessHistory.data.activities'),
            t('patientAccessHistory.data.overview'),
          ],
          isSuspicious: false,
        },
        {
          id: '5',
          professionalName: 'Access Suspect',
          professionalType: t('patientAccessHistory.professionalType.unknown'),
          professionalCode: 'UNKNOWN-XX-0000',
          timestamp: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString(),
          duration: 1,
          actionType: 'view',
          dataAccessed: [],
          isSuspicious: true,
        },
      ];

      setAccessHistory(mockHistory);
    } catch (err: any) {
      setError(err.message || t('patientAccessHistory.errors.loadingHistory'));
      console.error(t('patientAccessHistory.errors.loadingHistory'), err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return t('patientAccessHistory.time.agoMinutes', {
        count: diffInMinutes,
      });
    } else if (diffInHours < 24) {
      return t('patientAccessHistory.time.agoHours', { count: diffInHours });
    } else if (diffInHours < 48) {
      return t('patientAccessHistory.time.yesterday');
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return t('patientAccessHistory.time.agoDays', { count: diffInDays });
      } else {
        return date.toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year:
            date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
      }
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 1) {
      return '< 1 min';
    } else if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'consultation':
        return <MessageCircle className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'download':
      case 'export':
        return <Download className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'consultation':
        return t('patientAccessHistory.actions.consultation');
      case 'view':
        return t('patientAccessHistory.actions.viewData');
      case 'download':
        return t('patientAccessHistory.actions.download');
      case 'export':
        return t('patientAccessHistory.actions.exportData');
      default:
        return t('patientAccessHistory.actions.access');
    }
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      glucose: t('patientAccessHistory.data.glucose'),
      medications: t('patientAccessHistory.data.medications'),
      meals: t('patientAccessHistory.data.meals'),
      activities: t('patientAccessHistory.data.activities'),
      overview: t('patientAccessHistory.data.overview'),
    };
    return labels[section] || section;
  };

  const downloadReport = async () => {
    try {
      toast({
        title: t('patientAccessHistory.report.generatingTitle'),
        description: t('patientAccessHistory.report.generatingDesc'),
      });

      // Simuler la génération du rapport
      setTimeout(() => {
        toast({
          title: t('patientAccessHistory.report.successTitle'),
          description: t('patientAccessHistory.report.successDesc'),
        });
      }, 2000);
    } catch (error) {
      toast({
        title: t('patientAccessHistory.report.errorTitle'),
        description: t('patientAccessHistory.report.errorDesc'),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('patientAccessHistory.history.accessTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            {t('patientAccessHistory.history.loadingError')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => loadAccessHistory(patientId)}
            variant="outline"
          >
            {t('patientAccessHistory.actions.retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {t('history.accessTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('history.accessSubtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accessHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('history.noRecentAccess')}</p>
            </div>
          ) : (
            accessHistory.map(access => (
              <div
                key={access.id}
                className={`border rounded-lg p-4 transition-colors hover:bg-muted/50 ${
                  access.isSuspicious
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{access.professionalName}</h4>
                      {access.isSuspicious && (
                        <Badge variant="destructive" className="text-xs">
                          {t('history.suspect')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t(`professionalType.${access.professionalType}`)} •{' '}
                      {t('history.code')}: {access.professionalCode}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(access.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(access.duration)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={
                        access.actionType === 'consultation'
                          ? 'default'
                          : 'secondary'
                      }
                      className="flex items-center gap-1"
                    >
                      {getActionIcon(access.actionType)}
                      {getActionLabel(access.actionType)}
                    </Badge>
                  </div>
                </div>

                {access.dataAccessed.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-2">
                      <strong>{t('history.sectionsAccessed')}:</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {access.dataAccessed.map((section, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {getSectionLabel(section)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {accessHistory.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={downloadReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('actions.downloadFullReport')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAccessHistory;
