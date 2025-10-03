import { useState, useCallback, useRef, useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';

export interface QueuedToast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

export const useToastQueue = () => {
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const addToQueue = useCallback((toast: Omit<QueuedToast, 'id' | 'timestamp'>) => {
    const newToast: QueuedToast = {
      ...toast,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      priority: toast.priority || 'medium'
    };

    setQueue(prev => {
      const updated = [...prev, newToast];
      // Sort by priority (critical > high > medium > low) then by timestamp
      return updated.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority!] - priorityOrder[a.priority!];
        return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp;
      });
    });
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const processQueue = useCallback(async () => {
    if (processingRef.current || queue.length === 0) return;

    processingRef.current = true;
    setIsProcessing(true);

    const toastToShow = queue[0];
    if (!toastToShow) {
      processingRef.current = false;
      setIsProcessing(false);
      return;
    }

    // Remove from queue
    setQueue(prev => prev.slice(1));

    // Show toast based on variant
    const duration = toastToShow.duration || (toastToShow.priority === 'critical' ? 8000 : 5000);
    
    switch (toastToShow.variant) {
      case 'destructive':
        sonnerToast.error(toastToShow.title, {
          description: toastToShow.description,
          duration,
        });
        break;
      case 'success':
        sonnerToast.success(toastToShow.title, {
          description: toastToShow.description,
          duration,
        });
        break;
      case 'warning':
        sonnerToast.warning(toastToShow.title, {
          description: toastToShow.description,
          duration,
        });
        break;
      case 'info':
        sonnerToast.info(toastToShow.title, {
          description: toastToShow.description,
          duration,
        });
        break;
      default:
        sonnerToast(toastToShow.title, {
          description: toastToShow.description,
          duration,
        });
    }

    // Wait for toast duration + small buffer before processing next
    await new Promise(resolve => setTimeout(resolve, Math.min(duration, 3000) + 500));
    
    processingRef.current = false;
    setIsProcessing(false);
  }, [queue]);

  // Process queue when new items are added
  useEffect(() => {
    if (queue.length > 0 && !processingRef.current) {
      processQueue();
    }
  }, [queue, processQueue]);

  return {
    queue,
    queueLength: queue.length,
    isProcessing,
    addToQueue,
    removeFromQueue,
    clearQueue,
  };
};