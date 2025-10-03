import React from 'react';
import { useToastQueue } from '@/hooks/useToastQueue';
import { Bell, Clock } from 'lucide-react';

const ToastQueueIndicator: React.FC = () => {
  const { queueLength, isProcessing } = useToastQueue();

  if (queueLength === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[99] flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-2 rounded-full shadow-lg backdrop-blur-sm">
      {isProcessing ? (
        <Clock className="w-4 h-4 animate-spin" />
      ) : (
        <Bell className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {queueLength} alert{queueLength > 1 ? 's' : ''} en attente
      </span>
    </div>
  );
};

export default ToastQueueIndicator;