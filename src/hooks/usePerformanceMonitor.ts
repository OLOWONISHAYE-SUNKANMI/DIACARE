import { useEffect, useState } from 'react';
import { PerformanceOptimizer } from '@/utils/PerformanceOptimizer';

export interface PerformanceMetrics {
  networkCondition: {
    effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
  cacheSize: number;
  batchedRequestsCount: number;
  memoryUsage: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [optimizer] = useState(() => PerformanceOptimizer.getInstance());

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(optimizer.getPerformanceMetrics());
    };

    // Mise à jour initiale
    updateMetrics();

    // Mise à jour périodique
    const interval = setInterval(updateMetrics, 10000); // Toutes les 10 secondes

    // Écoute des changements de réseau
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateMetrics);
    }

    return () => {
      clearInterval(interval);
      if (connection) {
        connection.removeEventListener('change', updateMetrics);
      }
    };
  }, [optimizer]);

  const isSlowNetwork = metrics?.networkCondition.effectiveType === 'slow-2g' || 
                      metrics?.networkCondition.effectiveType === '2g';

  const shouldReduceQuality = metrics?.networkCondition.saveData || isSlowNetwork;

  const getImageQuality = () => {
    if (!metrics) return 'medium';
    return optimizer.getImageQuality();
  };

  const getNetworkStatus = () => {
    if (!metrics) return 'unknown';
    
    const { effectiveType, downlink } = metrics.networkCondition;
    
    if (effectiveType === 'slow-2g' || downlink < 0.15) return 'very-slow';
    if (effectiveType === '2g' || downlink < 0.5) return 'slow';
    if (effectiveType === '3g' || downlink < 2) return 'moderate';
    return 'fast';
  };

  return {
    metrics,
    isSlowNetwork,
    shouldReduceQuality,
    getImageQuality,
    getNetworkStatus,
    optimizer
  };
}