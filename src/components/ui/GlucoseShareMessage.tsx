import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GlucoseShareMessageProps {
  data: {
    value: number;
    context: string;
    time: string;
    comment?: string;
  };
}

const GlucoseShareMessage = ({ data }: GlucoseShareMessageProps) => {
  const { t } = useTranslation();
  const getGlucoseColor = (value: number) => {
    if (value < 70) return 'glucose-low';
    if (value > 180) return 'glucose-high';
    return 'glucose-normal';
  };

  const glucoseColor = getGlucoseColor(data.value);

  return (
    <div className="bg-medical-blue-light p-3 rounded-lg mb-2">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-medical-blue" />
        <span className="font-semibold text-medical-blue">
          {t('glucoseShareMessage.Profile.points.glucoseSharing.title')}
        </span>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold text-${glucoseColor}`}>
          {data.value} mg/dL
        </div>
        <div className="text-sm text-muted-foreground">
          {data.context} • {data.time}
        </div>
      </div>
      {data.comment && (
        <div className="text-sm mt-2 text-foreground">{data.comment}</div>
      )}
    </div>
  );
};

export default GlucoseShareMessage;
