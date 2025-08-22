import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import PlanSelection from '@/components/PlanSelection';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { LegalModal } from '@/components/modals/LegalModal';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, 
  Lock, 
  User, 
  Stethoscope, 
  Eye, 
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle,
  Users,
  Heart
} from 'lucide-react';

const AuthPage = () => {
  const { user, signIn, signUp, signInWithProfessionalCode, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  // États pour les formulaires - MOVED TO TOP
  const [activeTab, setActiveTab] = useState('patient');
  const [patientMode, setPatientMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | null>(null);

  // Données des formulaires pour patient
  const [patientSignInData, setPatientSignInData] = useState({ email: '', password: '' });
  const [patientSignUpData, setPatientSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  // Données pour professionnel
  const [professionalCode, setProfessionalCode] = useState('');
  
  // Données pour famille
  const [familyData, setFamilyData] = useState({ 
    patientCode: ''
  });

  // Show loading first
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue-light via-background to-medical-green-light">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handlePatientSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(patientSignInData.email, patientSignInData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError(t('auth.invalidCredentials'));
        } else if (error.message.includes('Email not confirmed')) {
          setError(t('auth.emailNotConfirmed'));
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.welcomePatient'),
      });
      
      navigate('/');
    } catch (err: any) {
      setError(t('auth.connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (patientSignUpData.password !== patientSignUpData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setIsLoading(false);
      return;
    }

    if (patientSignUpData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const { error, needsSubscription } = await signUp(
        patientSignUpData.email, 
        patientSignUpData.password,
        {
          first_name: patientSignUpData.firstName,
          last_name: patientSignUpData.lastName,
          user_type: 'patient'
        }
      );
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError(t('auth.userAlreadyExists'));
        } else {
          setError(error.message);
        }
        return;
      }

      if (needsSubscription) {
        // Show plan selection after successful signup
        setShowPlanSelection(true);
        setSuccess(t('auth.registrationSuccess') + ' ' + t('auth.choosePlan'));
      } else {
        setSuccess(t('auth.registrationSuccess') + ' ' + t('auth.confirmEmail'));
      }
      
      setPatientSignUpData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
      
      toast({
        title: t('auth.registrationSuccess'),
        description: needsSubscription ? t('auth.choosePlan') : t('auth.confirmEmail'),
      });
      
    } catch (err: any) {
      setError(t('auth.registrationError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelected = async (planId: string) => {
    try {
      setIsLoading(true);
      
      // Get plan details first
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError || !planData) {
        throw new Error('Plan non trouvé');
      }

      // Close plan selection and redirect to payment with Flutterwave
      setShowPlanSelection(false);
      
      // Store selected plan in localStorage for PaymentScreen
      localStorage.setItem('selectedPlan', JSON.stringify(planData));
      
      // Navigate to payment page
      navigate('/payment');
      
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sélection du plan');
      toast({
        title: "Erreur",
        description: err.message || "Impossible de traiter la sélection du plan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!familyData.patientCode || familyData.patientCode.length < 6) {
      setError(t('auth.invalidPatientCode'));
      setIsLoading(false);
      return;
    }

    try {
      // Logique d'accès famille avec code patient uniquement
      // Pas besoin d'inscription, juste validation du code
      toast({
        title: t('auth.familyAccessGranted'),
        description: t('auth.welcomeFamily'),
      });
      
      // Pour l'instant, redirection vers l'accueil
      // À terme, redirection vers interface famille
      navigate('/');
    } catch (err: any) {
      setError(t('auth.invalidOrExpiredCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessionalCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signInWithProfessionalCode(professionalCode);
      
      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: t('auth.professionalLoginSuccess'),
        description: t('auth.welcomeProfessional'),
      });
      
      navigate('/');
    } catch (err: any) {
      setError(t('auth.connectionError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Show plan selection modal if needed
  if (showPlanSelection) {
    return (
      <PlanSelection 
        onPlanSelected={handlePlanSelected}
        onClose={() => setShowPlanSelection(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-light via-background to-medical-green-light flex items-center justify-center p-4">
      {/* Language Selector - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-medical rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Stethoscope className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{t('appName')}</h1>
          <p className="text-lg font-medium text-muted-foreground mb-2">{t('appSlogan')}</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{t('auth.signInTitle')}</CardTitle>
            <CardDescription>
              {t('auth.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patient" className="text-xs">
                  {t('auth.patient')}
                </TabsTrigger>
                <TabsTrigger value="professional" className="text-xs">
                  <Stethoscope className="w-4 h-4 mr-1" />
                  {t('auth.professional')}
                </TabsTrigger>
                <TabsTrigger value="family" className="text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  {t('auth.family')}
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-success bg-success/10 text-success-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="patient" className="mt-6">

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={patientMode === 'signin' ? 'default' : 'outline'} 
                      onClick={() => setPatientMode('signin')}
                      className="text-xs"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      {t('auth.signInButton')}
                    </Button>
                    <Button 
                      variant={patientMode === 'signup' ? 'default' : 'outline'} 
                      onClick={() => setPatientMode('signup')}
                      className="text-xs"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      {t('auth.signUpButton')}
                    </Button>
                  </div>

                  {patientMode === 'signin' && (
                    <form onSubmit={handlePatientSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient-signin-email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signin-email"
                            type="email"
                            placeholder={t('auth.emailPlaceholder')}
                            value={patientSignInData.email}
                            onChange={(e) => setPatientSignInData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-signin-password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.password')}
                            value={patientSignInData.password}
                            onChange={(e) => setPatientSignInData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('auth.connecting') : t('auth.signIn')}
                      </Button>
                    </form>
                  )}

                  {patientMode === 'signup' && (
                    <form onSubmit={handlePatientSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="patient-firstName">{t('auth.firstName')}</Label>
                          <Input
                            id="patient-firstName"
                            placeholder={t('auth.firstName')}
                            value={patientSignUpData.firstName}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-lastName">{t('auth.lastName')}</Label>
                          <Input
                            id="patient-lastName"
                            placeholder={t('auth.lastName')}
                            value={patientSignUpData.lastName}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-signup-email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signup-email"
                            type="email"
                            placeholder={t('auth.emailPlaceholder')}
                            value={patientSignUpData.email}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-signup-password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.passwordMinLength')}
                            value={patientSignUpData.password}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-confirm-password">{t('auth.confirmPassword')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.confirmPasswordPlaceholder')}
                            value={patientSignUpData.confirmPassword}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t('auth.registering') : t('auth.signUp')}
                      </Button>
                    </form>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="professional" className="mt-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-medical-green-light rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-medical-green" />
                  </div>
                  <h3 className="font-semibold text-foreground">Professionnel de Santé</h3>
                  <p className="text-sm text-muted-foreground">Accès aux outils professionnels</p>
                </div>

                <form onSubmit={handleProfessionalCodeLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="professional-code">{t('auth.professionalCode')}</Label>
                    <Input
                      id="professional-code"
                      type="text"
                      placeholder={t('auth.professionalCodePlaceholder')}
                      value={professionalCode}
                      onChange={(e) => setProfessionalCode(e.target.value.toUpperCase())}
                      className="text-center font-mono text-lg"
                      maxLength={15}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Format: TYPE-PAYS-XXXX
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-medical-green hover:bg-medical-green/90" 
                    disabled={isLoading || professionalCode.length < 10}
                  >
                    {isLoading ? t('auth.connecting') : t('auth.professionalAccess')}
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="text-center text-sm text-muted-foreground">
                  {t('auth.professionalNotRegistered')}
                  <Button variant="link" className="p-0 ml-1 text-medical-green">
                    {t('auth.requestProfessionalAccess')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="family" className="mt-6">

                <form onSubmit={handleFamilyAccess} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-code">{t('auth.patientCode')}</Label>
                    <Input
                      id="patient-code"
                      type="text"
                      placeholder={t('auth.patientCodePlaceholder')}
                      value={familyData.patientCode}
                      onChange={(e) => setFamilyData(prev => ({ ...prev, patientCode: e.target.value.toUpperCase() }))}
                      className="text-center font-mono text-lg"
                      required
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {t('auth.codeProvidedByPatient')}
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !familyData.patientCode}
                  >
                    {isLoading ? t('auth.connecting') : t('auth.familyAccess')}
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="text-center text-sm text-muted-foreground">
                  {t('auth.needHelp')}
                  <Button variant="link" className="p-0 ml-1">
                    {t('auth.familyAccessGuide')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-3">
          <div className="text-sm text-muted-foreground">
            {t('auth.termsAcceptance')}{" "}
            <Button 
              variant="link" 
              className="p-0 text-sm underline text-primary"
              onClick={() => setLegalModal('terms')}
            >
              {t('auth.termsOfUse')}
            </Button>
            {" "}{t('auth.and')}{" "}
            <Button 
              variant="link" 
              className="p-0 text-sm underline text-primary"
              onClick={() => setLegalModal('privacy')}
            >
              {t('auth.privacyPolicy')}
            </Button>
          </div>
          
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <Button 
              variant="link" 
              className="p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setLegalModal('privacy')}
            >
              {t('auth.privacyPolicy')}
            </Button>
            <span>•</span>
            <Button 
              variant="link" 
              className="p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setLegalModal('terms')}
            >
              {t('auth.termsOfUse')}
            </Button>
            <span>•</span>
            <Button variant="link" className="p-0 text-xs text-muted-foreground hover:text-foreground">
              {t('auth.support')}
            </Button>
          </div>
        </div>
      </div>

      {/* Legal Modals */}
      <LegalModal 
        isOpen={legalModal !== null}
        onClose={() => setLegalModal(null)}
        type={legalModal || 'terms'}
      />
    </div>
  );
};

export default AuthPage;