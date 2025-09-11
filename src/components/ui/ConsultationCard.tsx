import { useTranslation } from 'react-i18next';

interface ConsultationData {
  id: string;
  patient: {
    firstName: string;
    lastName: string;
    age: number;
    diabetesType: number;
    location: string;
  };
  timeAgo: string;
  reason: string;
}

interface ConsultationCardProps {
  consultation: ConsultationData;
  onAccept: (consultation: ConsultationData) => void;
}

const viewPatientData = (patient: ConsultationData['patient']) => {
  console.log('Viewing patient data:', patient);
  // TODO: Implement patient data modal
};

const ConsultationCard = ({
  consultation,
  onAccept,
}: ConsultationCardProps) => {
  const { t } = useTranslation(); // ✅ move it here

  return (
    <div className="border border-border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <h4 className="font-bold text-foreground">
              {consultation.patient.firstName} {consultation.patient.lastName}
            </h4>
            <p className="text-sm text-muted-foreground">
              {consultation.patient.age} {t('ConsultationCard.years')} •{' '}
              {t('ConsultationCard.diabetesType')}{' '}
              {consultation.patient.diabetesType}
            </p>
            <p className="text-xs text-muted-foreground">
              📍 {consultation.patient.location} • ⏰{' '}
              {t('ConsultationCard.requestedAgo', {
                time: consultation.timeAgo,
              })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-primary">500 F CFA</div>
          <div className="text-xs text-muted-foreground mb-3">
            {t('ConsultationCard.consultation')}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => viewPatientData(consultation.patient)}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm hover:bg-secondary/80"
            >
              📊 {t('ConsultationCard.viewData')}
            </button>
            <button
              onClick={() => onAccept(consultation)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-bold text-sm hover:bg-primary/90"
            >
              {t('ConsultationCard.accept')}
            </button>
          </div>
        </div>
      </div>

      {/* Raison consultation */}
      <div className="mt-3 bg-muted p-3 rounded">
        <p className="text-sm">
          <strong>{t('ConsultationCard.reason')}:</strong> {consultation.reason}
        </p>
      </div>
    </div>
  );
};

export default ConsultationCard;
