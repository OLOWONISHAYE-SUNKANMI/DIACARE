import { getAISummary } from '@/utils/AISummarize';
import { AlertTriangle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PredictiveCardProps = {
  cancelable?: boolean;
  visible: boolean;
  values?: string | number;
  setVisible: (v: boolean) => void;
  onTabChange?: (tab: string) => void;
};

const PredictiveCard: React.FC<PredictiveCardProps> = ({
  cancelable,
  visible,
  setVisible,
  values,
  onTabChange
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
      <div className="rounded-xl p-4 bg-destructive text-destructive-foreground space-y-2">
        <div className="flex items-center gap-2 font-bold text-lg w-full justify-between">
          <div className="flex gap-2 items-center">
            <AlertTriangle className="w-5 h-5" />
            <span>{t('predictiveCard.predictiveAlert.title')}</span>
       
        </div>

        {loading && (
          <p className="text-sm">
            {t('predictiveCard.predictiveAlert.loading')}
          </p>
        )}
        {summary && <p className="text-sm">{summary}</p>}
           </div>
          {cancelable && (
          <div className="flex gap-3 justify-center ">
  {/* Dismiss button */} 
  <button
    onClick={() => setVisible(false)}
    className="px-9 py-2 rounded-lg bg-red-50 text-red-600 font-medium 
               hover:bg-red-100 active:bg-red-200 
               transition-colors shadow-sm"
    aria-label={t('predictiveCard.predictiveAlert.dismissAria')}
  >
    Dismiss
  </button>

  {/* More Info button */}
  <button
    onClick={() => onTabChange?.('predictive')}
    className="px-9 py-2 rounded-lg border border-gray-300 
               text-gray-700 font-medium 
               hover:bg-gray-100 active:bg-gray-200 
               transition-colors shadow-sm"
    aria-label={t('predictiveCard.predictiveAlert.moreInfoAria')}
  >
    More Info
  </button>
</div>

          )}
      </div>
    </div>
  );
};

export default PredictiveCard;
