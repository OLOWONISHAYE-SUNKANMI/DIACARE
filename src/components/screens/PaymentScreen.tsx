import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, Phone, Shield, Clock } from 'lucide-react';

interface PaymentService {
  id: string;
  name: string;
  color: string;
  countries: string[];
  available: boolean;
  icon: string;
}

const paymentServices: PaymentService[] = [
  {
    id: 'orange-money',
    name: 'Orange Money',
    color: 'bg-orange-500',
    countries: ['Sénégal', 'Mali', 'Côte d\'Ivoire', 'Cameroun', 'Burkina Faso'],
    available: true,
    icon: '🟠'
  },
  {
    id: 'airtel-money',
    name: 'Airtel Money',
    color: 'bg-red-500',
    countries: ['15 pays africains', 'Tchad', 'Niger', 'RCA', 'Gabon'],
    available: true,
    icon: '🔴'
  },
  {
    id: 'mtn-money',
    name: 'MTN Mobile Money',
    color: 'bg-yellow-500',
    countries: ['Ghana', 'Côte d\'Ivoire', 'Bénin', 'Cameroun'],
    available: true,
    icon: '🟡'
  },
  {
    id: 'wave',
    name: 'Wave',
    color: 'bg-blue-500',
    countries: ['Sénégal', 'Côte d\'Ivoire', 'Mali'],
    available: true,
    icon: '💙'
  },
  {
    id: 'djamo',
    name: 'Djamo',
    color: 'bg-green-500',
    countries: ['Côte d\'Ivoire', 'Sénégal'],
    available: true,
    icon: '🟢'
  },
  {
    id: 'moov-money',
    name: 'Moov Money',
    color: 'bg-purple-500',
    countries: ['Togo', 'Bénin', 'Côte d\'Ivoire'],
    available: false,
    icon: '💜'
  }
];

interface PaymentScreenProps {
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onPaymentSuccess }) => {
  const [selectedService, setSelectedService] = useState<PaymentService | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleServiceSelect = (service: PaymentService) => {
    if (!service.available) {
      toast({
        title: "Service indisponible",
        description: "Ce service sera bientôt disponible",
        variant: "destructive",
      });
      return;
    }
    setSelectedService(service);
    setPaymentStep('details');
  };

  const handlePaymentConfirm = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Numéro requis",
        description: "Veuillez entrer votre numéro de téléphone",
        variant: "destructive",
      });
      return;
    }

    setPaymentStep('processing');
    setIsLoading(true);

    // Simulation du processus de paiement
    setTimeout(() => {
      setPaymentStep('success');
      setIsLoading(false);
      
      setTimeout(() => {
        onPaymentSuccess();
        toast({
          title: "Paiement confirmé !",
          description: "Bienvenue dans DARE Premium",
        });
      }, 2000);
    }, 3000);
  };

  const formatPhoneNumber = (value: string) => {
    // Format automatique pour les numéros africains
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('221')) {
      return `+221 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    }
    return value;
  };

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-teal/10 to-medical-green/10 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-medical-teal/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-medical-teal animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Confirmation en cours...</h3>
              <p className="text-muted-foreground mb-4">
                Vérifiez votre téléphone pour confirmer le paiement
              </p>
              <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono">
                USSD envoyé: *144*1*1*5000#
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Paiement sécurisé via</div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{selectedService?.icon}</span>
                <span className="font-semibold">{selectedService?.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  if (paymentStep === 'details' && selectedService) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setPaymentStep('select')}
              className="mr-3"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Paiement sécurisé</h1>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedService.icon}</span>
                <div>
                  <CardTitle className="text-lg">{selectedService.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Paiement sécurisé</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+221 77 XXX XX XX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>DARE Premium</span>
                    <span className="font-semibold">5 000 F CFA</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Période</span>
                    <span>1 mois</span>
                  </div>
                  <div className="flex justify-between text-sm text-medical-green">
                    <span>Essai gratuit</span>
                    <span>7 jours</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>5 000 F CFA</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Paiement sécurisé et crypté</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handlePaymentConfirm}
            className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white py-3"
            disabled={isLoading}
          >
            {isLoading ? "Traitement..." : "Confirmer le paiement"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            En confirmant, vous acceptez nos conditions d'utilisation.
            Annulable à tout moment.
          </p>
        </div>
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
          <h1 className="text-xl font-semibold">Mode de paiement</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-medical-teal mb-2">DARE Premium</h2>
          <p className="text-3xl font-bold text-foreground">5 000 <span className="text-lg">F CFA</span></p>
          <p className="text-muted-foreground">par mois</p>
          <Badge className="mt-2 bg-medical-green/10 text-medical-green border-medical-green/20">
            Essai gratuit 7 jours
          </Badge>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground mb-4">Choisissez votre service de paiement</h3>
          
          {paymentServices.map((service) => (
            <Card 
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !service.available ? 'opacity-60' : 'hover:border-medical-teal/30'
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <div className="font-semibold">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.countries.slice(0, 3).join(', ')}
                        {service.countries.length > 3 && '...'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={service.available ? "default" : "secondary"}
                      className={service.available ? "bg-medical-green/10 text-medical-green border-medical-green/20" : ""}
                    >
                      {service.available ? "Disponible" : "Bientôt"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-medical-teal/5 rounded-lg p-4">
            <h4 className="font-semibold text-medical-teal mb-2">Pourquoi choisir DARE ?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Suivi glycémie en temps réel</li>
              <li>✓ Calculateur d'insuline intelligent</li>
              <li>✓ Support famille et soignants</li>
              <li>✓ Rapports médicaux complets</li>
            </ul>
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