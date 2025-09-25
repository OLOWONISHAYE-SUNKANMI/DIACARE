import { getAISummary } from '@/utils/AISummarize';
import { AlertTriangle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
          setSummary(t('predictiveCard.aiSummary.error')); // ✅ Interpolated
          console.error('predictiveCard.aiSummary.error', error);
        })
        .finally(() => setLoading(false));
    }
  }, [visible, values]);

  if (!visible) return null;

  return (
    <div className="relative">
      {value && (
        <div className="rounded-xl p-4 bg-destructive text-destructive-foreground space-y-2">
          <div className="flex items-center gap-2 font-bold text-lg w-full justify-between">
            <div className="flex gap-2 items-center">
              <AlertTriangle className="w-5 h-5" />
              <span>{t('predictiveCard.predictiveAlert.title')}</span>
            </div>
            {cancelable && (
              <button
                onClick={() => setVisible(false)}
                className="p-1 rounded hover:bg-destructive-foreground/10 active:bg-destructive-foreground/20 transition-colors"
                aria-label={t('predictiveCard.predictiveAlert.dismissAria')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading && (
            <p className="text-sm">
              {t('predictiveCard.predictiveAlert.loading')}
            </p>
          )}
          {summary && <p className="text-sm">{summary}</p>}
        </div>
      )}
    </div>
  );
};

export default PredictiveCard;
