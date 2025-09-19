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
      <Card className="bg-card shadow-xl border-0 rounded-2xl sm:rounded-3xl mx-3 sm:mx-4 -mt-4 sm:-mt-6 relative overflow-hidden max-w-full w-full">
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-medical-green to-medical-teal"></div>

        <CardContent className="p-4 sm:p-6 text-center">
          {loading ? (
            <p className="text-muted-foreground">{t('loading')}</p>
          ) : latestReading ? (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-medical-green" />
                <span className="text-base sm:text-lg font-semibold text-card-foreground">
                  {t('bloodSugar.title')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline justify-center gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-medical-green">
                    {currentGlucose}
                  </span>
                  <span className="text-sm sm:text-lg text-muted-foreground">
                    mg/dL
                  </span>
                  <div className="text-medical-green ml-1 sm:ml-2">
                    {getTrendIcon()}
                  </div>
                </div>

                {/* Status badge */}
                <div
                  className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${glucoseStatus.bgColor} ${glucoseStatus.color}`}
                >
                  {glucoseStatus.icon}
                  <span>{glucoseStatus.message}</span>
                </div>
              </div>

              {/* Last reading */}
              <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-muted/30">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-center">
                  {t('bloodSugar.measurement')} : {lastReading}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">{t('bloodSugar.noReading')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlucoseWidget;
