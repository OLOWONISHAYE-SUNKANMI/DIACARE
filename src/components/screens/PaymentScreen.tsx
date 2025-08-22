import React, { useState } from 'react';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Phone, Shield, CreditCard, User, Mail } from 'lucide-react';

interface PaymentFormData {
  email: string;
  name: string;
  phone_number: string;
}

interface PaymentScreenProps {
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onPaymentSuccess }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    email: '',
    name: '',
    phone_number: ''
  });
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get plan from localStorage
  const selectedPlan = React.useMemo(() => {
    try {
      const plan = localStorage.getItem('selectedPlan');
      return plan ? JSON.parse(plan) : null;
    } catch {
      return null;
    }
  }, []);

  // Configuration Flutterwave
  const config = {
    public_key: 'FLWPUBK_TEST-SANDBOXDEMOKEY-X', // Remplacer par votre clé publique
    tx_ref: `DIACARE-${Date.now()}`,
    amount: selectedPlan?.price_eur || 5000,
    currency: 'XOF', // Franc CFA
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: formData.email,
      phone_number: formData.phone_number,
      name: formData.name,
    },
    customizations: {
      title: selectedPlan?.name || 'DiaCare Premium',
      description: selectedPlan?.description || 'Abonnement mensuel DiaCare Premium',
      logo: 'https://assets.aceternity.com/demos/lila.jpg',
    },
  };

  const fwConfig = {
    ...config,
    text: `Payer ${((selectedPlan?.price_eur || 5000) / 100).toFixed(0)}€`,
    callback: (response: any) => {
      console.log(response);
        if (response.status === 'successful') {
          setPaymentStep('success');
          setTimeout(() => {
            closePaymentModal();
            // Clear stored plan
            localStorage.removeItem('selectedPlan');
            onPaymentSuccess();
            toast({
              title: "Paiement confirmé !",
              description: `Bienvenue dans ${selectedPlan?.name || 'DiaCare Premium'}`,
            });
          }, 2000);
        } else {
          toast({
            title: "Paiement échoué",
            description: "Une erreur s'est produite lors du paiement",
            variant: "destructive",
          });
        }
      closePaymentModal();
    },
    onClose: () => {
      console.log('Payment modal closed');
    },
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.email && formData.name && formData.phone_number;


  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-green/10 to-medical-teal/10 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-medical-green/20 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-medical-green" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-medical-green mb-2">Paiement confirmé !</h3>
              <p className="text-muted-foreground">
                Bienvenue dans DARE Premium. Votre abonnement est maintenant actif.
              </p>
            </div>
            <div className="bg-medical-green/5 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-medical-green">DARE Premium activé</div>
              <div className="text-sm text-muted-foreground">
                Accès complet à toutes les fonctionnalités
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Paiement sécurisé</h1>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-medical-teal/20 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-medical-teal" />
          </div>
          <h2 className="text-2xl font-bold text-medical-teal mb-2">{selectedPlan?.name || 'DiaCare Premium'}</h2>
          <p className="text-3xl font-bold text-foreground">{((selectedPlan?.price_eur || 5000) / 100).toFixed(0)} <span className="text-lg">€</span></p>
          <p className="text-muted-foreground">par mois</p>
          <Badge className="mt-2 bg-medical-green/10 text-medical-green border-medical-green/20">
            Paiement sécurisé
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informations de paiement</CardTitle>
            <p className="text-sm text-muted-foreground">
              Paiement sécurisé via Flutterwave
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Adresse email *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Numéro de téléphone *</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+221 77 XXX XX XX"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{selectedPlan?.name || 'DiaCare Premium'}</span>
                <span className="font-semibold">{((selectedPlan?.price_eur || 5000) / 100).toFixed(0)}€</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Période</span>
                <span>1 mois</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{((selectedPlan?.price_eur || 5000) / 100).toFixed(0)}€</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Paiement sécurisé par Flutterwave</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FlutterWaveButton
            {...fwConfig}
            className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              isFormValid 
                ? 'bg-medical-teal hover:bg-medical-teal/90 text-white' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            disabled={!isFormValid}
          />

          <div className="bg-medical-teal/5 rounded-lg p-4">
            <h4 className="font-semibold text-medical-teal mb-2">Méthodes de paiement acceptées</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📱 Orange Money</p>
              <p>📱 MTN Money</p>
              <p>📱 Wave</p>
              <p>📱 Djamo</p>
              <p>📱 M-Pesa</p>
              <p>📱 Airtel Money</p>
              <p>💳 Visa & Mastercard</p>
              <p>🏦 Virements bancaires et USSD</p>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Paiement sécurisé • Annulable à tout moment</p>
            <p>Support technique inclus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;