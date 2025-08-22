import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, User, Calendar, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [patientCode, setPatientCode] = useState<string>('');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const testMode = searchParams.get('test_mode'); // Pour détecter le mode test
    
    if (sessionId) {
      verifyPayment(sessionId);
    } else if (testMode === 'true') {
      // Mode test - simuler une réponse réussie
      setPatientCode('TEST123');
      setSubscriptionDetails({
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      setLoading(false);
      toast({
        title: "Paiement confirmé !",
        description: "Votre abonnement DiaCare est maintenant actif (Mode Test).",
      });
    } else {
      setError('Session ID manquant');
      setLoading(false);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data.success) {
        setPatientCode(data.patientCode);
        setSubscriptionDetails(data.subscription);
        
        toast({
          title: "Paiement confirmé !",
          description: "Votre abonnement DiaCare est maintenant actif.",
        });
      } else {
        throw new Error('Échec de la vérification du paiement');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la vérification du paiement');
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le paiement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPatientCode = () => {
    navigator.clipboard.writeText(patientCode);
    toast({
      title: "Code copié !",
      description: "Le code patient a été copié dans le presse-papiers.",
    });
  };

  const goToProfile = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Vérification du paiement en cours...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/10 to-muted/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-destructive/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-xl font-semibold text-destructive">Erreur de paiement</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/auth')} variant="outline">
              Retour à l'authentification
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <CardTitle className="text-2xl text-success">Paiement confirmé !</CardTitle>
          <p className="text-muted-foreground">
            Félicitations ! Votre abonnement DiaCare est maintenant actif.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Code Patient */}
          <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Votre code patient DiaCare
            </h3>
            <div className="bg-background rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold text-primary tracking-wider">
                {patientCode}
              </div>
            </div>
            <Button 
              onClick={copyPatientCode}
              variant="outline" 
              size="sm"
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copier le code
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Utilisez ce code pour accéder à vos fonctionnalités et le partager avec votre famille
            </p>
          </div>

          {/* Détails de l'abonnement */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Statut de l'abonnement</span>
              <Badge className="bg-success/10 text-success border-success/20">
                Actif
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">Email du compte</span>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{user?.email}</span>
              </div>
            </div>

            {subscriptionDetails?.current_period_end && (
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Prochaine facturation</span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(subscriptionDetails.current_period_end).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Avantages */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">🎉 Vos avantages DiaCare</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Accès complet à toutes les fonctionnalités DiaCare
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                10 téléconsultations par mois
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                DiaCare Chat et DiaCare News
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Alertes personnalisées et suivi glycémie
              </li>
            </ul>
          </div>

          {/* Email de confirmation */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Email de confirmation envoyé
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Un email avec votre code patient et toutes les informations importantes 
                  a été envoyé à {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={goToProfile} className="flex-1 gap-2">
              <User className="w-4 h-4" />
              Compléter mon profil
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="flex-1 gap-2"
            >
              Accéder à DiaCare
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;