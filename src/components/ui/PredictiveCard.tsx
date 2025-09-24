import { getAISummary } from '@/utils/AISummarize';
import { AlertTriangle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type PredictiveCardProps = {
  cancelable?: boolean;
  visible: boolean;
  values?: string | number;
  setVisible: (v: boolean) => void;
};

const PredictiveCard: React.FC<PredictiveCardProps> = ({
  cancelable,
  visible,
  setVisible,
  values,
}) => {
  const [summary, setSummary] = useState('');
  const [value, setValue] = useState<string | number>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (values !== undefined) {
      setValue(values);
    }
  }, [values]);

  useEffect(() => {
    if (visible && values) {
      setSummary('');
      setLoading(true);
      getAISummary(values)
        .then(result => setSummary(result))
        .catch(error => {
          setSummary('Error getting summary.');
          console.error('Error getting summary:', error);
        })
        .finally(() => setLoading(false));
    }
  }, [visible, values]);

  if (!visible) return null;

  return (
    <div className="relative">
      <div className="rounded-xl p-4 bg-destructive text-destructive-foreground space-y-2">
        <div className="flex items-center gap-2 font-bold text-lg w-full justify-between">
          <div className="flex gap-2 items-center ">
            <AlertTriangle className="w-5 h-5" />
            <span>Predictive Alert!</span>
          </div>
          {cancelable && (
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded hover:bg-destructive-foreground/10 active:bg-destructive-foreground/20 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {loading && <p className="text-sm">Loading...</p>}
        {summary && <p className="text-sm">{summary}</p>}
      </div>
    </div>
  );
};

export default PredictiveCard;
