import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CountrySelector } from '@/components/ui/CountrySelector';
import { CurrencyConverter, CountryCurrency } from '@/utils/CurrencyConverter';
import {
  ArrowLeft,
  Check,
  Phone,
  Shield,
  CreditCard,
  User,
  Mail,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaymentFormData {
  email: string;
  name: string;
  phone_number: string;
}

interface PaymentScreenProps {
  onBack: () => void;
  onPaymentSuccess: () => void;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  onBack,
  onPaymentSuccess,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<PaymentFormData>({
    email: '',
    name: '',
    phone_number: '',
  });
  const [paymentStep, setPaymentStep] = useState<
    'form' | 'processing' | 'success'
  >('form');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [currency, setCurrency] = useState<CountryCurrency>(
    CurrencyConverter.getCurrencyInfo('DEFAULT')
  );
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

  // Calculate prices in local currency
  const convertedPrices = React.useMemo(() => {
    if (!selectedPlan) return null;
    return CurrencyConverter.convertPrice(
      selectedPlan.price_eur / 100,
      selectedCountry || 'DEFAULT'
    );
  }, [selectedPlan, selectedCountry]);

  const handleCountrySelect = (
    countryCode: string,
    currencyInfo: CountryCurrency
  ) => {
    setSelectedCountry(countryCode);
    setCurrency(currencyInfo);
  };

  // Configuration AfribaPay
  const afribaPaymentData = React.useMemo(
    () => ({
      amount: convertedPrices?.amount || selectedPlan?.price_eur || 800, // 8€ par défaut
      currency: currency.currency,
      reference: `KLUKOO-${Date.now()}`,
      description:
        selectedPlan?.description ||
        t('paymentScreen.subscription.defaultDescription'),
      customer: {
        email: formData.email,
        phone: formData.phone_number,
        name: formData.name,
      },
      callback_url: window.location.origin + '/payment-success',
      return_url: window.location.origin + '/payment-success',
    }),
    [convertedPrices, selectedPlan, currency, formData]
  );

  const handleAfribaPayment = async () => {
    if (!isFormValid || !selectedCountry) {
      toast({
        title: t('paymentScreen.toasts.missingInfo.title'),
        description: t('paymentScreen.toasts.missingInfo.description'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Mode test - simulation de paiement AfribaPay
      console.log(t('paymentScreen.payment.simulationLog'), afribaPaymentData);

      // Simuler un délai de traitement de 2 secondes
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler une réponse réussie
      const simulatedSuccess = Math.random() > 0.1; // 90% de succès en test

      if (simulatedSuccess) {
        setPaymentStep('success');
        setTimeout(() => {
          localStorage.removeItem('selectedPlan');
          // Rediriger vers payment-success avec le paramètre test_mode
          window.location.href = '/payment-success?test_mode=true';
        }, 1000);
      } else {
        throw new Error(t('paymentScreen.payment.simulationError'));
      }
    } catch (error) {
      console.error(t('paymentScreen.payment.simulationError'), error);
      toast({
        title: t('paymentScreen.payment.toastErrorTitle'),
        description: t('paymentScreen.payment.toastErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
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
              <h3 className="text-xl font-semibold text-medical-green mb-2">
                {t('payment.paymentSuccess.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('payment.paymentSuccess.welcome')}
              </p>
            </div>
            <div className="bg-medical-green/5 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-medical-green">
                {t('payment.paymentSuccess.activated')}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('payment.paymentSuccess.access')}
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
          <h1 className="text-xl font-semibold">
            {t('paymentScreen.paymentScreen.payment.secure')}
          </h1>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-medical-teal/20 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-medical-teal" />
          </div>
          <h2 className="text-2xl font-bold text-medical-teal mb-2">
            {selectedPlan?.name || 'Klukoo Premium'}
          </h2>
          <p className="text-3xl font-bold text-foreground">
            {convertedPrices
              ? convertedPrices.formatted
              : `${((selectedPlan?.price_eur || 800) / 100).toFixed(0)}€`}
          </p>
          <p className="text-muted-foreground">
            {t('paymentScreen.paymentScreen.payment.perMonth')}
          </p>
          <Badge className="mt-2 bg-medical-green/10 text-medical-green border-medical-green/20">
            {t('paymentScreen.paymentScreen.payment.secure')}
          </Badge>
        </div>

        {/* Country and Currency Selection */}
        <CountrySelector
          onCountrySelect={handleCountrySelect}
          selectedCountry={selectedCountry}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {t('paymentScreen.payment.infoTitle')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('paymentScreen.payment.secureInfo')}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">
                {t('paymentScreen.payment.fullNameLabel')}
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t('paymentScreen.payment.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">
                {t('paymentScreen.form.emailLabel')}
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">
                {t('paymentScreen.form.phoneLabel')}
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+221 77 XXX XX XX"
                  value={formData.phone_number}
                  onChange={e =>
                    handleInputChange('phone_number', e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{selectedPlan?.name || 'Klukoo Premium'}</span>
                <span className="font-semibold">
                  {convertedPrices
                    ? convertedPrices.formatted
                    : `${((selectedPlan?.price_eur || 800) / 100).toFixed(0)}€`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('paymentScreen.subscription.period')}</span>
                <span>{t('paymentScreen.subscription.oneMonth')}</span>
              </div>
              {currency.country !== 'Autre' && (
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Devise locale</span>
                  <span>
                    {currency.country} ({currency.currency})
                  </span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                  {convertedPrices
                    ? convertedPrices.formatted
                    : `${((selectedPlan?.price_eur || 800) / 100).toFixed(0)}€`}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">
                {t('paymentScreen.payment.secureByAfribaPay')}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={handleAfribaPayment}
            disabled={!isFormValid || !selectedCountry || isLoading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              isFormValid
                ? 'bg-medical-teal hover:bg-medical-teal/90 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isLoading
              ? t('paymentScreen.payment.processing')
              : convertedPrices
                ? t('paymentScreen.payment.pay', {
                    amount: convertedPrices.formatted,
                  })
                : t('paymentScreen.payment.pay', {
                    amount: `${((selectedPlan?.price_eur || 800) / 100).toFixed(0)}€`,
                  })}
          </Button>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-700 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              {t('paymentScreen.paymentMethod,title')}
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t('paymentScreen.paymentMethod,orangeMoney')}</p>
              <p>{t('paymentScreen.paymentMethod,mtnMoney')}</p>
              <p>{t('paymentScreen.paymentMethod,wave')}</p>
              <p>{t('paymentScreen.paymentMethod,djamo')}</p>
              <p>{t('paymentScreen.paymentMethod,mpesa')}</p>
              <p>{t('paymentScreen.paymentMethod,airtel')}</p>
              <p>{t('paymentScreen.paymentMethod,visa')}</p>
              <p>{t('paymentScreen.paymentMethod,bank')}</p>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>{t('paymentScreen.subscriptionInfo.securePayment')}</p>
            <p>{t('paymentScreen.subscriptionInfo.support')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
