import React, { useState, useRef, useCallback } from 'react';
import { PerformanceOptimizer } from '@/utils/PerformanceOptimizer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high' | 'auto';
  priority?: boolean;
  fallbackSrc?: string;
  webpSupport?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhYWEiPkNoYXJnZW1lbnQuLi48L3RleHQ+PC9zdmc+',
  quality = 'auto',
  priority = false,
  fallbackSrc,
  webpSupport = true,
  className,
  ...props
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef<HTMLImageElement>(null);
  const optimizer = PerformanceOptimizer.getInstance();

  // Intersection Observer pour lazy loading
  const { isIntersecting } = useIntersectionObserver(imgRef, {
    rootMargin: '50px',
    triggerOnce: true,
  });

  // Détermine la qualité d'image optimale
  const getOptimizedSrc = useCallback((originalSrc: string): string => {
    const actualQuality = quality === 'auto' ? optimizer.getImageQuality() : quality;
    
    // Simulation d'URLs optimisées (à adapter selon votre CDN)
    const qualityParams = {
      low: 'q_30,f_auto,w_400',
      medium: 'q_60,f_auto,w_800', 
      high: 'q_80,f_auto,w_1200'
    };

    // Si l'image supporte WebP et le navigateur aussi
    if (webpSupport && supportsWebP()) {
      return originalSrc.includes('?') 
        ? `${originalSrc}&${qualityParams[actualQuality]},f_webp`
        : `${originalSrc}?${qualityParams[actualQuality]},f_webp`;
    }

    return originalSrc.includes('?')
      ? `${originalSrc}&${qualityParams[actualQuality]}`
      : `${originalSrc}?${qualityParams[actualQuality]}`;
  }, [quality, optimizer, webpSupport]);

  // Charge l'image quand elle devient visible
  const loadImage = useCallback(async () => {
    if (imageState !== 'loading') return;

    const optimizedSrc = getOptimizedSrc(src);
    const img = new Image();

    img.onload = () => {
      setCurrentSrc(optimizedSrc);
      setImageState('loaded');
    };

    img.onerror = () => {
      if (fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setImageState('loaded');
      } else {
        setImageState('error');
      }
    };

    // Ajoute un délai pour les réseaux lents
    const delay = optimizer.getRequestDelay();
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    img.src = optimizedSrc;
  }, [src, imageState, getOptimizedSrc, fallbackSrc, optimizer]);

  // Lance le chargement quand l'image devient visible (ou immédiatement si priorité)
  React.useEffect(() => {
    if (priority || isIntersecting) {
      loadImage();
    }
  }, [priority, isIntersecting, loadImage]);

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-70'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
      
      {imageState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {imageState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">Image non disponible</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Détecte le support WebP
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}