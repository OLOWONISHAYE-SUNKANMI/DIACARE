import React from 'react';
import { Wifi, WifiOff, Signal, AlertTriangle } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Badge } from './badge';
import { useTranslation } from 'react-i18next';

export const NetworkStatusIndicator: React.FC = () => {
  const { t } = useTranslation();
  const { metrics, isSlowNetwork, getNetworkStatus } = usePerformanceMonitor();

  if (!metrics) return null;

  const networkStatus = getNetworkStatus();
  const { effectiveType, saveData } = metrics.networkCondition;

  const getStatusIcon = () => {
    switch (networkStatus) {
      case 'very-slow':
        return <WifiOff className="w-3 h-3" />;
      case 'slow':
        return <AlertTriangle className="w-3 h-3" />;
      case 'moderate':
        return <Signal className="w-3 h-3" />;
      case 'fast':
        return <Wifi className="w-3 h-3" />;
      default:
        return <Signal className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    switch (networkStatus) {
      case 'very-slow':
        return 'destructive';
      case 'slow':
        return 'warning';
      case 'moderate':
        return 'secondary';
      case 'fast':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusText = () => {
    switch (networkStatus) {
      case 'very-slow':
        return t('networkStatusIndicator.networkStatus.verySlow');
      case 'slow':
        return t('networkStatusIndicator.networkStatus.slow');
      case 'moderate':
        return t('networkStatusIndicator.networkStatus.moderate');
      case 'fast':
        return t('networkStatusIndicator.networkStatus.fast');
      default:
        return t('networkStatusIndicator.networkStatus.unknown');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor() as any} className="text-xs">
        {getStatusIcon()}
        <span className="ml-1 hidden sm:inline">
          {effectiveType.toUpperCase()}
        </span>
      </Badge>

      {saveData && (
        <Badge variant="outline" className="text-xs">
          {t('networkStatusIndicator.badges.saveData')}
        </Badge>
      )}

      {isSlowNetwork && (
        <div className="text-xs text-muted-foreground hidden md:block">
          {t('networkStatusIndicator.badges.optimizedMode')}
        </div>
      )}
    </div>
  );
};
