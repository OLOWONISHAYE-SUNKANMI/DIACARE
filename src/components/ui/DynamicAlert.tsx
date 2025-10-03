import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastAlert {
  id: string;
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

interface DynamicAlertProps {
  alerts: ToastAlert[];
  onDismiss: (id: string) => void;
}

const DynamicAlert: React.FC<DynamicAlertProps> = ({ alerts, onDismiss }) => {
  const [currentAlert, setCurrentAlert] = useState<ToastAlert | null>(null);

  useEffect(() => {
    if (alerts.length > 0 && !currentAlert) {
      setCurrentAlert(alerts[0]);
    }
  }, [alerts, currentAlert]);

  const handleDismiss = () => {
    if (currentAlert) {
      onDismiss(currentAlert.id);
      setCurrentAlert(null);
    }
  };

  if (!currentAlert) return null;

  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };

  const iconMap = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`rounded-lg border p-4 shadow-lg max-w-sm ${variantStyles[currentAlert.variant || 'info']}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-lg">{iconMap[currentAlert.variant || 'info']}</span>
            <div>
              {currentAlert.title && <h4 className="font-semibold mb-1">{currentAlert.title}</h4>}
              <p className="text-sm">{currentAlert.message}</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicAlert;
export type { ToastAlert };