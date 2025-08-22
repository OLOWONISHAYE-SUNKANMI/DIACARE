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
import { useToast } from '@/hooks/use-toast';
import PlanSelection from '@/components/PlanSelection';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
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

  // États pour les formulaires - MOVED TO TOP
  const [activeTab, setActiveTab] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);

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
          setError('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter');
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: "Connexion réussie !",
        description: "Bienvenue dans votre espace patient.",
      });
      
      navigate('/');
    } catch (err: any) {
      setError('Une erreur est survenue lors de la connexion');
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
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (patientSignUpData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
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
          setError('Un compte existe déjà avec cette adresse email');
        } else {
          setError(error.message);
        }
        return;
      }

      if (needsSubscription) {
        // Show plan selection after successful signup
        setShowPlanSelection(true);
        setSuccess('Inscription réussie ! Choisissez maintenant votre forfait DiaCare.');
      } else {
        setSuccess('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      }
      
      setPatientSignUpData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
      
      toast({
        title: "Inscription réussie !",
        description: needsSubscription ? "Choisissez votre forfait DiaCare" : "Vérifiez votre email pour confirmer votre compte.",
      });
      
    } catch (err: any) {
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelected = async (planId: string) => {
    try {
      setIsLoading(true);
      
      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la session de paiement');
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement",
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
      setError('Veuillez entrer un code patient valide');
      setIsLoading(false);
      return;
    }

    try {
      // Logique d'accès famille avec code patient uniquement
      // Pas besoin d'inscription, juste validation du code
      toast({
        title: "Accès famille accordé !",
        description: "Bienvenue dans l'espace famille DiaCare.",
      });
      
      // Pour l'instant, redirection vers l'accueil
      // À terme, redirection vers interface famille
      navigate('/');
    } catch (err: any) {
      setError('Code patient invalide ou expiré');
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
        title: "Connexion professionnelle réussie !",
        description: "Bienvenue dans votre espace professionnel.",
      });
      
      navigate('/');
    } catch (err: any) {
      setError('Une erreur est survenue lors de la connexion');
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
          <h1 className="text-3xl font-bold text-foreground mb-2">DARE</h1>
          <p className="text-muted-foreground">Diabète Africain & Ressources d'Excellence</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Connexion</CardTitle>
            <CardDescription>
              Accédez à votre compte DARE
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patient" className="text-xs">
                  Patient
                </TabsTrigger>
                <TabsTrigger value="professional" className="text-xs">
                  <Stethoscope className="w-4 h-4 mr-1" />
                  Professionnel
                </TabsTrigger>
                <TabsTrigger value="family" className="text-xs">
                  <Users className="w-4 h-4 mr-1" />
                  Famille
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
                      variant={activeTab === 'patient' ? 'default' : 'outline'} 
                      onClick={() => setActiveTab('patient-signin')}
                      className="text-xs"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      Connexion
                    </Button>
                    <Button 
                      variant={activeTab === 'patient' ? 'outline' : 'outline'} 
                      onClick={() => setActiveTab('patient-signup')}
                      className="text-xs"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Inscription
                    </Button>
                  </div>

                  {activeTab === 'patient-signin' && (
                    <form onSubmit={handlePatientSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient-signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signin-email"
                            type="email"
                            placeholder="votre@email.com"
                            value={patientSignInData.email}
                            onChange={(e) => setPatientSignInData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-signin-password">Mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Votre mot de passe"
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
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                      </Button>
                    </form>
                  )}

                  {activeTab === 'patient-signup' && (
                    <form onSubmit={handlePatientSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="patient-firstName">Prénom</Label>
                          <Input
                            id="patient-firstName"
                            placeholder="Prénom"
                            value={patientSignUpData.firstName}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patient-lastName">Nom</Label>
                          <Input
                            id="patient-lastName"
                            placeholder="Nom"
                            value={patientSignUpData.lastName}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signup-email"
                            type="email"
                            placeholder="votre@email.com"
                            value={patientSignUpData.email}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-signup-password">Mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimum 6 caractères"
                            value={patientSignUpData.password}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="patient-confirm-password">Confirmer le mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient-confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirmez votre mot de passe"
                            value={patientSignUpData.confirmPassword}
                            onChange={(e) => setPatientSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Inscription...' : 'S\'inscrire comme patient'}
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
                    <Label htmlFor="professional-code">Code Professionnel</Label>
                    <Input
                      id="professional-code"
                      type="text"
                      placeholder="ENDO-SN-2847"
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
                    {isLoading ? 'Connexion...' : 'Accéder à l\'espace professionnel'}
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="text-center text-sm text-muted-foreground">
                  Pas encore inscrit ? 
                  <Button variant="link" className="p-0 ml-1 text-medical-green">
                    Demander un accès professionnel
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="family" className="mt-6">

                <form onSubmit={handleFamilyAccess} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-code">Code Patient</Label>
                    <Input
                      id="patient-code"
                      type="text"
                      placeholder="Code d'accès du patient"
                      value={familyData.patientCode}
                      onChange={(e) => setFamilyData(prev => ({ ...prev, patientCode: e.target.value.toUpperCase() }))}
                      className="text-center font-mono text-lg"
                      required
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Code fourni par le patient
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !familyData.patientCode}
                  >
                    {isLoading ? 'Connexion...' : 'Accéder à l\'espace famille'}
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="text-center text-sm text-muted-foreground">
                  Besoin d'aide ? 
                  <Button variant="link" className="p-0 ml-1">
                    Guide d'accès famille
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          En vous connectant, vous acceptez nos conditions d'utilisation
        </div>
      </div>
    </div>
  );
};

export default AuthPage;