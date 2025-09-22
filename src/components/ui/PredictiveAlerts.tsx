import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Shield,
  Pill,
  Target,
  Brain,
  X,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { predictiveAnalyzer } from '@/utils/SimplifiedPredictiveAnalyzer';
import type { RiskAlert } from '@/utils/SimplifiedPredictiveAnalyzer';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';
import { toast } from 'sonner';

interface PredictiveAlertsProps {
  onTabChange?: (tab: string) => void;
  className?: string;
  glucoseValue: string;
}

const PredictiveAlerts: React.FC<PredictiveAlertsProps> = ({
  className = '',
  glucoseValue,
  onTabChange
}) => {
  console.log('glucoseValue', glucoseValue);
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const urgentRef = useRef(0);
  const prevGlucose = useRef<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const newAlerts = predictiveAnalyzer.analyzeAndGenerateAlerts();
      setAlerts(newAlerts);
      setLoading(false);
    }, 1500);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return isDarkMode
          ? 'bg-danger text-white'
          : 'bg-danger-light text-white';
      case 'high':
        return isDarkMode
          ? 'bg-warning text-white'
          : 'bg-warning-light text-white';
      case 'medium':
        return isDarkMode
          ? 'bg-accent text-accent-foreground'
          : 'bg-yellow-400 text-black';
      case 'low':
        return isDarkMode ? 'bg-info text-white' : 'bg-info-light text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'hypo_risk':
        return <TrendingDown className="w-5 h-5" />;
      case 'hyper_risk':
        return <TrendingUp className="w-5 h-5" />;
      case 'trend_warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medication_reminder':
        return <Pill className="w-5 h-5" />;
      case 'pattern_anomaly':
        return <Target className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    predictiveAnalyzer.markAlertAsRead(alertId);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleDismissAll = () => {
    alerts.forEach(alert => predictiveAnalyzer.markAlertAsRead(alert.id));
    setAlerts([]);
  };

  const getGlucoseStatus = (value: number) => {
    if (value < 70)
      return {
        status: 'low',
        message: t('getGlucoseStatus.status_low', 'Low blood sugar detected!'),
      };
    if (value <= 180)
      return {
        status: 'normal',
        message: t('getGlucoseStatus.status_normal', 'Blood sugar normal.'),
      };
    return {
      status: 'high',
      message: t('getGlucoseStatus.status_high', 'High blood sugar detected!'),
    };
  };

  useEffect(() => {
    const value = parseFloat(glucoseValue);
    if (!isNaN(value) && glucoseValue !== prevGlucose.current) {
      const status = getGlucoseStatus(value);
      if (status.status === 'low') {
        urgentRef.current += 1;
        toast.error(status.message + ` (Urgent count: ${urgentRef.current})`, {
          description: t(
            'predictiveAlerts.lowGlucoseToast',
            'If thresholds exceeded → Predictive Alert triggered'
          ),
        });
      } else if (status.status === 'high') {
        urgentRef.current += 1;
        toast.error(status.message + ` (Urgent count: ${urgentRef.current})`, {
          description: t(
            'predictiveAlerts.highGlucoseToast',
            'If thresholds exceeded → Predictive Alert triggered'
          ),
        });
      } else if (status.status === 'normal') {
        urgentRef.current = 0;
        toast.success(
          status.message + ` (Urgent count: ${urgentRef.current})`,
          {
            description: t(
              'predictiveAlerts.normalGlucoseToast',
              'If thresholds exceeded → Predictive Alert triggered'
            ),
          }
        );
      }
      prevGlucose.current = glucoseValue;
    }
  }, [glucoseValue, t]);

  // --- Begin dynamic stats logic ---
  // We'll keep a running count of high/low/total glucose readings
  const [glucoseStats, setGlucoseStats] = useState({
    total: 0,
    urgent: 0, // high
    monitor: 0, // low
  });

  // Use a separate ref to track last value for stats, so stats always update for new values
  const lastStatsValue = useRef<string | null>(null);
  useEffect(() => {
    const value = parseFloat(glucoseValue);
    if (!isNaN(value) && glucoseValue !== lastStatsValue.current) {
      setGlucoseStats(prev => {
        const newStats = { ...prev };
        newStats.total += 1;
        if (value > 180) {
          newStats.urgent += 1;
        } else if (value < 70) {
          newStats.monitor += 1;
        }
        return newStats;
      });
      lastStatsValue.current = glucoseValue;
    }
  }, [glucoseValue]);
  console.log(glucoseStats);

  const handleViewMore = () => {
 onTabChange?.('predictive');
  }

  // --- End dynamic stats logic ---

  // Optionally, you can render nothing or a placeholder
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className={`bg-card text-foreground ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span className="font-semibold">{t('Alerts.title')}</span>
            </div>
            {/* Hide mark all read button since we don't have alert list here */}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-extrabold">
                {glucoseStats.total}
              </div>
              <div className="text-sm opacity-90">Total</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-danger">
                {glucoseStats.urgent}
              </div>
              <div className="text-sm opacity-90">{t('Alerts.urgent')}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-warning">
                {glucoseStats.monitor}
              </div>
              <div className="text-sm opacity-90">{t('Alerts.monitor')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}

      {/* AI Analysis Summary */}
      <Card className="bg-accent text-foreground">
        <CardContent className="p-4 flex justify-between items-center ">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-accent-foreground" />
            <div>
              <h4 className="font-bold text-foreground">
                {t('analyze.title')}
              </h4>
              <p className="text-sm text-foreground/80">
                {t('analyze.message')}
              </p>
            </div>
          </div>
          <Button
          onClick={handleViewMore}
          variant="default"
          >Enter </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAlerts;
