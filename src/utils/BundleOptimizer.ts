/**
 * Bundle Optimizer pour réduire la taille et améliorer les performances
 */

import React from 'react';

// Lazy loading des composants lourds
export const LazyScreenComponents = {
  // Écrans secondaires - chargés à la demande  
  ChartsScreen: React.lazy(() => import('@/components/screens/ChartsScreen')),
  BlogScreen: React.lazy(() => import('@/components/screens/BlogScreen')),
  ConsultationRequest: React.lazy(() => import('@/components/screens/ConsultationRequest')),
  DoctorDashboard: React.lazy(() => import('@/components/screens/DoctorDashboard')),
  AdminDashboard: React.lazy(() => import('@/components/screens/AdminDashboard')),
  
  // Modals complexes
  PhotoUploadModal: React.lazy(() => import('@/components/modals/PhotoUploadModal')),
  TeleconsultationBooking: React.lazy(() => import('@/components/screens/TeleconsultationBooking')),
  
  // Composants lourds
  VideoCallInterface: React.lazy(() => import('@/components/ui/VideoCallInterface')),
  ChatInterface: React.lazy(() => import('@/components/ui/ChatInterface')),
};

// Préchargement intelligent basé sur l'utilisation
export class BundlePreloader {
  private static loadedModules = new Set<string>();
  private static preloadQueue: string[] = [];

  static preloadByUserRole(userRole: string) {
    switch (userRole) {
      case 'patient':
        // Précharge les modules les plus utilisés par les patients
        this.queuePreload(['Charts']);
        break;
      case 'professional':
        this.queuePreload(['Professional', 'Teleconsultation', 'Charts']);
        break;
      case 'admin':
        this.queuePreload(['Admin', 'Professional', 'Charts']);
        break;
    }
  }

  static preloadByNetworkCondition(effectiveType: string) {
    // Ne précharge que sur de bonnes connexions
    if (effectiveType === '4g') {
      this.processPreloadQueue();
    } else if (effectiveType === '3g') {
      // Précharge seulement les modules critiques sur 3G
      this.preloadCriticalOnly();
    }
    // Pas de préchargement sur 2G
  }

  private static queuePreload(modules: string[]) {
    this.preloadQueue.push(...modules.filter(m => !this.loadedModules.has(m)));
  }

  private static async processPreloadQueue() {
    while (this.preloadQueue.length > 0) {
      const module = this.preloadQueue.shift()!;
      try {
        await this.loadModule(module);
        this.loadedModules.add(module);
        // Délai entre les chargements pour ne pas bloquer l'UI
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to preload module ${module}:`, error);
      }
    }
  }

  private static async preloadCriticalOnly() {
    const criticalModules = ['Charts']; // Modules vraiment essentiels
    for (const module of criticalModules) {
      if (!this.loadedModules.has(module)) {
        try {
          await this.loadModule(module);
          this.loadedModules.add(module);
        } catch (error) {
          console.warn(`Failed to preload critical module ${module}:`, error);
        }
      }
    }
  }

  private static async loadModule(moduleName: string) {
    // Précharge seulement les modules qui existent vraiment
    if (moduleName === 'Charts') {
      await LazyScreenComponents.ChartsScreen;
    }
    // Ajouter d'autres modules au fur et à mesure
  }
}

// Tree shaking helpers - pour identifier le code mort
export const TreeShakingOptimizer = {
  // Fonction utilitaire pour marquer le code comme utilisé
  markAsUsed: (feature: string) => {
    console.debug(`Feature ${feature} is actively used`);
  },

  // Analyse d'utilisation des fonctionnalités
  analyzeUsage: () => {
    const usage = {
      charts: document.querySelectorAll('[data-feature="charts"]').length > 0,
      chat: document.querySelectorAll('[data-feature="chat"]').length > 0,
      video: document.querySelectorAll('[data-feature="video"]').length > 0,
      payments: document.querySelectorAll('[data-feature="payments"]').length > 0,
    };

    console.log('Feature usage analysis:', usage);
    return usage;
  }
};

// Service Worker pour le cache intelligent
export const setupServiceWorker = async () => {
  if ('serviceWorker' in navigator && 'caches' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Communication avec le SW pour les stratégies de cache
      if (registration.active) {
        registration.active.postMessage({
          type: 'CACHE_STRATEGY',
          strategy: 'networkFirst', // Pour les données dynamiques
        });
      }
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};