import React from 'react';
import { Wifi, WifiOff, Signal, AlertTriangle } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Badge } from './badge';

export const NetworkStatusIndicator: React.FC = () => {
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
        return 'Réseau très lent';
      case 'slow':
        return 'Réseau lent';
      case 'moderate':
        return 'Réseau modéré';
      case 'fast':
        return 'Bon réseau';
      default:
        return 'Réseau inconnu';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusColor() as any} className="text-xs">
        {getStatusIcon()}
        <span className="ml-1 hidden sm:inline">{effectiveType.toUpperCase()}</span>
      </Badge>
      
      {saveData && (
        <Badge variant="outline" className="text-xs">
          💾 Économie données
        </Badge>
      )}
      
      {isSlowNetwork && (
        <div className="text-xs text-muted-foreground hidden md:block">
          Mode optimisé activé
        </div>
      )}
    </div>
  );
};