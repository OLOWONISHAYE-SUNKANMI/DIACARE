import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { PerformanceOptimizer } from '@/utils/PerformanceOptimizer';

interface NetworkAwareQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  networkSensitive?: boolean;
  criticalData?: boolean;
}

export function useNetworkAwareQuery<T>({
  queryKey,
  queryFn,
  networkSensitive = true,
  criticalData = false,
  ...options
}: NetworkAwareQueryOptions<T>) {
  const [optimizer] = useState(() => PerformanceOptimizer.getInstance());
  const [networkMetrics, setNetworkMetrics] = useState(() => optimizer.getPerformanceMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkMetrics(optimizer.getPerformanceMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, [optimizer]);

  // Adapte les options de query selon les conditions réseau
  const adaptiveOptions = {
    ...options,
    // Augmente le stale time pour les réseaux lents
    staleTime: networkSensitive 
      ? getAdaptiveStaleTime(networkMetrics.networkCondition.effectiveType, criticalData)
      : options.staleTime,
    
    // Désactive le refetch automatique sur les réseaux très lents
    refetchOnWindowFocus: networkMetrics.networkCondition.effectiveType !== 'slow-2g' 
      ? options.refetchOnWindowFocus !== false 
      : false,
    
    refetchOnReconnect: networkMetrics.networkCondition.effectiveType !== 'slow-2g',
    
    // Augmente le retry delay pour les réseaux lents
    retryDelay: (attemptIndex: number) => {
      const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
      const networkMultiplier = getNetworkDelayMultiplier(networkMetrics.networkCondition.effectiveType);
      return baseDelay * networkMultiplier;
    },

    // Réduit le nombre de retry pour économiser les données
    retry: networkMetrics.networkCondition.saveData ? 1 : (options.retry ?? 3),
  };

  // Wrapper la fonction de query pour utiliser le cache intelligent
  const cachedQueryFn = async () => {
    const cacheKey = queryKey.join('-');
    const ttl = getTTLForData(networkMetrics.networkCondition.effectiveType, criticalData);
    
    return optimizer.cachedRequest(cacheKey, queryFn, { ttl });
  };

  const query = useQuery({
    queryKey,
    queryFn: cachedQueryFn,
    ...adaptiveOptions,
  });

  return {
    ...query,
    networkMetrics,
    isSlowNetwork: isSlowNetwork(networkMetrics.networkCondition.effectiveType),
    shouldReduceQuality: optimizer.shouldReduceQuality(),
  };
}

function getAdaptiveStaleTime(effectiveType: string, criticalData: boolean): number {
  if (criticalData) return 30 * 1000; // 30 secondes pour données critiques
  
  switch (effectiveType) {
    case 'slow-2g':
      return 15 * 60 * 1000; // 15 minutes
    case '2g':
      return 10 * 60 * 1000; // 10 minutes
    case '3g':
      return 5 * 60 * 1000; // 5 minutes
    default:
      return 2 * 60 * 1000; // 2 minutes pour 4G
  }
}

function getTTLForData(effectiveType: string, criticalData: boolean): number {
  if (criticalData) return 1 * 60 * 1000; // 1 minute pour données critiques
  
  switch (effectiveType) {
    case 'slow-2g':
      return 20 * 60 * 1000; // 20 minutes
    case '2g':
      return 15 * 60 * 1000; // 15 minutes
    case '3g':
      return 10 * 60 * 1000; // 10 minutes
    default:
      return 5 * 60 * 1000; // 5 minutes pour 4G
  }
}

function getNetworkDelayMultiplier(effectiveType: string): number {
  switch (effectiveType) {
    case 'slow-2g':
      return 4;
    case '2g':
      return 3;
    case '3g':
      return 2;
    default:
      return 1;
  }
}

function isSlowNetwork(effectiveType: string): boolean {
  return effectiveType === 'slow-2g' || effectiveType === '2g';
}