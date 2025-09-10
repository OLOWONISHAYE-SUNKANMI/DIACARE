import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ConsultationBilling,
  ConsultationSession,
} from '@/utils/ConsultationBilling';
import { useTranslation } from 'react-i18next';

interface ConsultationBillingProps {
  professionalCode: string;
}

export const ConsultationBillingComponent: React.FC<
  ConsultationBillingProps
> = ({ professionalCode }) => {
  const { t } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [currentSession, setCurrentSession] =
    useState<ConsultationSession | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [consultationHistory, setConsultationHistory] = useState<
    ConsultationSession[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (professionalCode) {
      loadConsultationHistory();
    }
  }, [professionalCode]);

  const loadConsultationHistory = async () => {
    try {
      const history =
        await ConsultationBilling.getConsultationHistory(professionalCode);
      setConsultationHistory(history);
    } catch (error) {
      console.error(t('consultationBilling.History.loadError'), error);
    }
  };

  const startConsultation = async () => {
    if (!selectedPatient || !professionalCode) return;

    setIsLoading(true);
    try {
      // 1. Créer payment intent Stripe AVANT de démarrer la consultation
      const paymentData = await ConsultationBilling.createPaymentIntent(
        professionalCode,
        selectedPatient
      );

      // 2. Afficher info paiement
      toast({
        title: t('consultationBilling.Payment.requiredTitle'),
        description: t('consultationBilling.Payment.processingDescription', {
          amount: '500 FCFA',
        }),
      });

      // Attendre 2 secondes pour simuler le paiement (en production, utiliser Stripe Elements)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Créer la session de consultation
      const session = await ConsultationBilling.startConsultation(
        professionalCode,
        selectedPatient
      );

      // 4. Confirmer le paiement
      await ConsultationBilling.confirmPayment(
        paymentData.payment_intent_id,
        session.id
      );

      setCurrentSession(session);
      setSelectedPatient('');
      toast({
        title: t('consultationBilling.Consultation.startedTitle'),
        description: t('consultationBilling.Consultation.paymentConfirmed', {
          amount: '500 FCFA',
          sessionId: session.id,
        }),
      });

      await loadConsultationHistory();
    } catch (error) {
      toast({
        title: t('consultationBilling.Payment.errorTitle'),
        description: t('consultationBilling.Payment.errorDescription', {
          amount: '500 FCFA',
        }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConsultation = async () => {
    if (!currentSession) return;

    setIsLoading(true);
    try {
      await ConsultationBilling.endConsultation(
        currentSession.id,
        consultationNotes
      );

      setCurrentSession(null);
      setConsultationNotes('');
      toast({
        title: t('consultationBilling.Consultation.completedTitle'),
        description: t('consultationBilling.Consultation.completedDescription'),
      });

      await loadConsultationHistory();
    } catch (error) {
      toast({
        title: t('consultationBilling.Consultation.errorTitle'),
        description: t('consultationBilling.Consultation.errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-500">
            ✅ {t('consultationBilling.PaymentStatus.paid')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            ⏳ {t('consultationBilling.PaymentStatus.pending')}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            ❌ {t('consultationBilling.PaymentStatus.failed')}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Consultation en cours */}
      {currentSession ? (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">
              🏥 {t('Consultation.inProgress')} - {currentSession.patient_code}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>
                  {t('consultationBilling.Consultation.session')}:
                </strong>{' '}
                {currentSession.id}
              </div>
              <div>
                <strong>
                  {t('consultationBilling.Consultation.started')}:
                </strong>{' '}
                {new Date(
                  currentSession.consultation_started_at
                ).toLocaleString('fr-FR')}
              </div>
              <div>
                <strong>{t('consultationBilling.Consultation.amount')}:</strong>{' '}
                500 FCFA
              </div>
              <div>
                <strong>
                  {t('consultationBilling.Consultation.paymentStatus')}:
                </strong>{' '}
                {getStatusBadge(currentSession.fee_status)}
              </div>
            </div>

            <Textarea
              placeholder={t(
                'consultationBilling.Consultation.notesPlaceholder'
              )}
              value={consultationNotes}
              onChange={e => setConsultationNotes(e.target.value)}
              className="min-h-20"
            />

            <Button
              onClick={endConsultation}
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {isLoading
                ? t('consultationBilling.Consultation.processing')
                : t('consultationBilling.Consultation.endButton')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Nouvelle consultation */
        <Card>
          <CardHeader>
            <CardTitle>
              💳{' '}
              {t('consultationBilling.Consultation.newTitle', {
                amount: '500 FCFA',
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💰 {t('consultationBilling.Consultation.fee')}:</strong>{' '}
                {t('consultationBilling.Consultation.feePerSession', {
                  amount: '500 FCFA',
                })}
                <br />
                <strong>
                  💳 {t('consultationBilling.Consultation.payment')}:
                </strong>{' '}
                {t('consultationBilling.Consultation.paymentMethod')}
                <br />
                <strong>
                  📊 {t('consultationBilling.Consultation.dareCommission')}:
                </strong>{' '}
                {t('consultationBilling.Consultation.commissionRate')}
              </p>
            </div>

            <Input
              placeholder={t(
                'consultationBilling.Consultation.patientCodePlaceholder'
              )}
              value={selectedPatient}
              onChange={e => setSelectedPatient(e.target.value)}
            />

            <Button
              onClick={startConsultation}
              disabled={isLoading || !selectedPatient}
              className="w-full"
            >
              {isLoading
                ? t('consultationBilling.Consultation.processingPayment')
                : t('consultationBilling.Consultation.startButton', {
                    amount: '500 FCFA',
                  })}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Historique des consultations */}
      <Card>
        <CardHeader>
          <CardTitle>
            📋 {t('consultationBilling.Consultation.historyTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {consultationHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t('consultationBilling.Consultation.noHistory')}
              </p>
            ) : (
              consultationHistory.map(session => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>
                        {t('consultationBilling.Consultation.patient')}:
                      </strong>{' '}
                      {session.patient_code}
                    </div>
                    <div>
                      <strong>
                        {t('consultationBilling.Consultation.date')}:
                      </strong>{' '}
                      {new Date(
                        session.consultation_started_at
                      ).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <strong>
                        {t('consultationBilling.Consultation.amount')}:
                      </strong>{' '}
                      {session.fee_amount / 100} FCFA
                    </div>
                    <div>
                      <strong>
                        {t('consultationBilling.Consultation.status')}:
                      </strong>{' '}
                      {getStatusBadge(session.fee_status)}
                    </div>
                  </div>
                  {session.consultation_notes && (
                    <div className="mt-2 text-sm">
                      <strong>
                        {t('consultationBilling.Consultation.notes')}:
                      </strong>{' '}
                      {session.consultation_notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultationBillingComponent;
