import React from 'react';
import { X } from 'lucide-react';

interface DynamicAlertProps {
  isVisible: boolean;
  onDismiss: () => void;
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const DynamicAlert: React.FC<DynamicAlertProps> = ({
  isVisible,
  onDismiss,
  title,
  message,
  variant = 'info'
}) => {
  if (!isVisible) return null;

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
    <div className={`rounded-lg border p-4 shadow-md transition-all duration-300 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <span className="text-lg">{iconMap[variant]}</span>
          <div>
            {title && <h4 className="font-semibold mb-1">{title}</h4>}
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default DynamicAlert;