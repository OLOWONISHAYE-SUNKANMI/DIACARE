import { useEffect, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    
    if (!element || !window.IntersectionObserver) {
      // Fallback pour navigateurs sans support
      setIsIntersecting(true);
      return;
    }

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        if (triggerOnce && hasTriggered) {
          return;
        }

        if (isElementIntersecting && triggerOnce) {
          hasTriggered = true;
        }

        setIsIntersecting(isElementIntersecting);
        setEntry(entry);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, triggerOnce]);

  return { isIntersecting, entry };
}