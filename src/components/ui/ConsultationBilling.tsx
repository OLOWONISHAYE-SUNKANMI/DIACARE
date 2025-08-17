import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ConsultationBilling, ConsultationSession } from '@/utils/ConsultationBilling';

interface ConsultationBillingProps {
  professionalCode: string;
}

export const ConsultationBillingComponent: React.FC<ConsultationBillingProps> = ({ professionalCode }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [currentSession, setCurrentSession] = useState<ConsultationSession | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [consultationHistory, setConsultationHistory] = useState<ConsultationSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (professionalCode) {
      loadConsultationHistory();
    }
  }, [professionalCode]);

  const loadConsultationHistory = async () => {
    try {
      const history = await ConsultationBilling.getConsultationHistory(professionalCode);
      setConsultationHistory(history);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
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
        title: "💳 Paiement requis",
        description: "500 FCFA - Traitement du paiement en cours...",
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
        title: "✅ Consultation démarrée",
        description: `Paiement de 500 FCFA confirmé - Session ${session.id}`,
      });
      
      await loadConsultationHistory();
    } catch (error) {
      toast({
        title: "❌ Erreur de paiement",
        description: "Impossible de traiter le paiement de 500 FCFA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConsultation = async () => {
    if (!currentSession) return;
    
    setIsLoading(true);
    try {
      await ConsultationBilling.endConsultation(currentSession.id, consultationNotes);
      
      setCurrentSession(null);
      setConsultationNotes('');
      toast({
        title: "✅ Consultation terminée",
        description: "Paiement traité automatiquement",
      });
      
      await loadConsultationHistory();
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de terminer la consultation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500">✅ Payé</Badge>;
      case 'pending':
        return <Badge variant="secondary">⏳ En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">❌ Échec</Badge>;
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
              🏥 Consultation en cours - {currentSession.patient_code}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Session:</strong> {currentSession.id}</div>
              <div><strong>Démarré:</strong> {new Date(currentSession.consultation_started_at).toLocaleString('fr-FR')}</div>
              <div><strong>Montant:</strong> 500 FCFA</div>
              <div><strong>Statut paiement:</strong> {getStatusBadge(currentSession.fee_status)}</div>
            </div>
            
            <Textarea
              placeholder="Notes de consultation..."
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              className="min-h-20"
            />
            
            <Button 
              onClick={endConsultation} 
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "⏳ Traitement..." : "🔚 Terminer consultation"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Nouvelle consultation */
        <Card>
          <CardHeader>
            <CardTitle>💳 Nouvelle consultation - 500 FCFA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>💰 Tarif:</strong> 500 FCFA par consultation<br/>
                <strong>💳 Paiement:</strong> Automatique avant consultation<br/>
                <strong>📊 Commission DARE:</strong> 10% (50 FCFA)
              </p>
            </div>
            
            <Input
              placeholder="Code patient (ex: PAT001)"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            />
            
            <Button 
              onClick={startConsultation} 
              disabled={isLoading || !selectedPatient}
              className="w-full"
            >
              {isLoading ? "⏳ Traitement paiement..." : "💳 Démarrer consultation (500 FCFA)"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Historique des consultations */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Historique des consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {consultationHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucune consultation pour le moment</p>
            ) : (
              consultationHistory.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Patient:</strong> {session.patient_code}</div>
                    <div><strong>Date:</strong> {new Date(session.consultation_started_at).toLocaleDateString('fr-FR')}</div>
                    <div><strong>Montant:</strong> {session.fee_amount / 100} FCFA</div>
                    <div><strong>Statut:</strong> {getStatusBadge(session.fee_status)}</div>
                  </div>
                  {session.consultation_notes && (
                    <div className="mt-2 text-sm">
                      <strong>Notes:</strong> {session.consultation_notes}
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