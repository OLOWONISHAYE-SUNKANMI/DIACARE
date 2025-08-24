/**
 * Performance Optimizer pour réseaux lents africains
 * Focus: 2G/3G, faible batterie, données limitées
 */

export interface NetworkCondition {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private networkCondition: NetworkCondition;
  private batchedRequests: Map<string, Promise<any>> = new Map();
  private requestCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  private constructor() {
    this.networkCondition = this.detectNetworkCondition();
    this.setupNetworkListener();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  private detectNetworkCondition(): NetworkCondition {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false
      };
    }

    // Fallback pour tests ou navigateurs non supportés
    return {
      effectiveType: '3g',
      downlink: 1.5,
      rtt: 300,
      saveData: false
    };
  }

  private setupNetworkListener() {
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.networkCondition = this.detectNetworkCondition();
        console.log('Network condition changed:', this.networkCondition);
      });
    }
  }

  // Adaptive Quality basée sur le réseau
  getImageQuality(): 'low' | 'medium' | 'high' {
    if (this.networkCondition.saveData || this.networkCondition.effectiveType === 'slow-2g') {
      return 'low';
    }
    if (this.networkCondition.effectiveType === '2g') {
      return 'low';
    }
    if (this.networkCondition.effectiveType === '3g') {
      return 'medium';
    }
    return 'high';
  }

  // Batch des requêtes similaires pour économiser la bande passante
  async batchRequest<T>(key: string, requestFn: () => Promise<T>, batchWindow = 100): Promise<T> {
    if (this.batchedRequests.has(key)) {
      return this.batchedRequests.get(key)!;
    }

    const promise = new Promise<T>((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.batchedRequests.delete(key);
        }
      }, batchWindow);
    });

    this.batchedRequests.set(key, promise);
    return promise;
  }

  // Cache intelligent avec TTL adaptatif
  async cachedRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean } = {}
  ): Promise<T> {
    const { ttl = this.getAdaptiveTTL(), forceRefresh = false } = options;

    if (!forceRefresh && this.requestCache.has(key)) {
      const cached = this.requestCache.get(key)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
    }

    try {
      const data = await requestFn();
      this.requestCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });
      return data;
    } catch (error) {
      // En cas d'erreur, retourne le cache si disponible
      if (this.requestCache.has(key)) {
        const cached = this.requestCache.get(key)!;
        console.warn('Network request failed, using cached data:', key);
        return cached.data;
      }
      throw error;
    }
  }

  private getAdaptiveTTL(): number {
    // TTL plus long pour les réseaux lents
    if (this.networkCondition.effectiveType === 'slow-2g' || this.networkCondition.effectiveType === '2g') {
      return 10 * 60 * 1000; // 10 minutes
    }
    if (this.networkCondition.effectiveType === '3g') {
      return 5 * 60 * 1000; // 5 minutes
    }
    return 2 * 60 * 1000; // 2 minutes pour 4G
  }

  // Précharge intelligente basée sur les priorités
  async prefetchCriticalResources() {
    const promises: Promise<any>[] = [];

    // Précharge les données critiques uniquement sur de bonnes connexions
    if (this.networkCondition.effectiveType !== 'slow-2g' && this.networkCondition.effectiveType !== '2g') {
      // Ici on peut ajouter des prefetch spécifiques
      console.log('Prefetching critical resources for', this.networkCondition.effectiveType);
    }

    return Promise.all(promises);
  }

  // Nettoyage du cache pour économiser la mémoire
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.requestCache.delete(key);
      }
    }
  }

  // Métriques de performance
  getPerformanceMetrics() {
    return {
      networkCondition: this.networkCondition,
      cacheSize: this.requestCache.size,
      batchedRequestsCount: this.batchedRequests.size,
      memoryUsage: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null
    };
  }

  // Recommandations d'économie de données
  shouldReduceQuality(): boolean {
    return this.networkCondition.saveData || 
           this.networkCondition.effectiveType === 'slow-2g' || 
           this.networkCondition.effectiveType === '2g';
  }

  // Délai adaptatif pour les requêtes
  getRequestDelay(): number {
    if (this.networkCondition.effectiveType === 'slow-2g') return 1000;
    if (this.networkCondition.effectiveType === '2g') return 500;
    if (this.networkCondition.effectiveType === '3g') return 200;
    return 0; // Pas de délai pour 4G
  }
}