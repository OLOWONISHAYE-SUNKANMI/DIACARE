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
  CheckCircle
} from 'lucide-react';

const AuthPage = () => {
  const { user, signIn, signUp, signInWithProfessionalCode, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // États pour les formulaires
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Données des formulaires
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [professionalCode, setProfessionalCode] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
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
        description: "Vous êtes maintenant connecté(e).",
      });
      
      navigate('/');
    } catch (err: any) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        signUpData.email, 
        signUpData.password,
        {
          first_name: signUpData.firstName,
          last_name: signUpData.lastName
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

      setSuccess('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
      setSignUpData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
      
      toast({
        title: "Inscription réussie !",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
      
    } catch (err: any) {
      setError('Une erreur est survenue lors de l\'inscription');
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-light via-background to-medical-green-light flex items-center justify-center p-4">
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
                <TabsTrigger value="signin" className="text-xs">
                  <LogIn className="w-4 h-4 mr-1" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-xs">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Inscription
                </TabsTrigger>
                <TabsTrigger value="professional" className="text-xs">
                  <Stethoscope className="w-4 h-4 mr-1" />
                  Pro
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

              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
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
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Prénom"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Nom"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 caractères"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Inscription...' : 'S\'inscrire'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="professional" className="mt-6">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-medical-green-light rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-medical-green" />
                  </div>
                  <h3 className="font-semibold text-foreground">Accès Professionnel</h3>
                  <p className="text-sm text-muted-foreground">Utilisez votre code professionnel</p>
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
                    {isLoading ? 'Connexion...' : 'Accéder à l\'espace pro'}
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="text-center text-sm text-muted-foreground">
                  Première fois ? 
                  <Button variant="link" className="p-0 ml-1 text-medical-green">
                    Postuler comme professionnel
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