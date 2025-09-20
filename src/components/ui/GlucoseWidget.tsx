import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useGlucose } from '@/contexts/GlucoseContext';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react';

const GlucoseWidget = () => {
  const { t } = useTranslation();
  const { getLatestReading, getTrend, loading } = useGlucose();

  const latestReading = getLatestReading();
  const trend = getTrend();

  const currentGlucose = latestReading?.value ?? 0;
  const lastReading = latestReading
    ? new Date(latestReading.timestamp).toLocaleString()
    : t('bloodSugar.noReading');

  const getGlucoseStatus = (value: number) => {
    if (value < 70)
      return {
        status: 'low',
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        message: t('getGlucoseStatus.status_low'),
        icon: <AlertTriangle className="w-4 h-4" />,
      };
    if (value <= 180)
      return {
        status: 'normal',
        color: 'text-medical-green',
        bgColor: 'bg-medical-green-light',
        message: t('getGlucoseStatus.status_normal'),
        icon: <CheckCircle className="w-4 h-4" />,
      };
    return {
      status: 'high',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      message: t('getGlucoseStatus.status_high'),
      icon: <AlertTriangle className="w-4 h-4" />,
    };
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  return (
    <div className="flex justify-center">
      <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl sm:rounded-3xl mx-3 sm:mx-4 -mt-4 sm:-mt-6 relative overflow-hidden max-w-full w-full">
        {/* Gradient accent */}
        

        <CardContent className="p-6 sm:p-8 text-center">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : latestReading ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-6 h-6 text-[#137657]" />
                <span className="text-gray-900 sm:text-lg font-semibold">
                  {t('bloodSugar.title')}
                </span>
              </div>

              {/* Value + Unit */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-center gap-2 flex-wrap">
                  <span className="text-5xl sm:text-6xl font-bold text-[#137657]">
                    {currentGlucose}
                  </span>
                  <span className="text-base sm:text-lg text-gray-600">
                    mg/dL
                  </span>
                  <div className="ml-2 text-[#248378]">{getTrendIcon()}</div>
                </div>

                {/* Status badge */}
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${glucoseStatus.bgColor} ${glucoseStatus.color}`}
                >
                  {glucoseStatus.icon}
                  <span>{glucoseStatus.message}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 pt-4" />

              {/* Last Reading */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {t('bloodSugar.measurement')} : {lastReading}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">{t('bloodSugar.noReading')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlucoseWidget;
