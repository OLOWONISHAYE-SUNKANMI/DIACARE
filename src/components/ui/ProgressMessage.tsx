import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProgressMessageProps {
  data: {
    achievement: string;
    description: string;
  };
}

const ProgressMessage = ({ data }: ProgressMessageProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-warning/10 p-3 rounded-lg mb-2 border border-warning/20">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-4 h-4 text-warning" />
        <span className="font-semibold text-warning">
          {t('progressMessage.celebration.title')}
        </span>
      </div>
      <div className="text-sm text-foreground">
        <strong className="text-warning">
          {t(`progressMessage.celebration.achievements.${data.achievement}`)}
        </strong>
        <br />
        {t(`progressMessage.celebration.descriptions.${data.description}`)}
      </div>
    </div>
  );
};

export default ProgressMessage;
