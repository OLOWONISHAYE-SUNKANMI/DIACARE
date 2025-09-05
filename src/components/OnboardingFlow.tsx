import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Globe,
  CheckCircle,
  ArrowRight,
  Languages,
  Users,
  Heart,
  Shield,
  Smartphone,
  Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export const OnboardingFlow = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState<
    'patient' | 'professional' | 'family' | ''
  >('');
  const [preferences, setPreferences] = useState({
    notifications: true,
    dataSharing: false,
    reminders: true,
  });

  // Étapes de l'onboarding
  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'language',
      title: t('onboarding.languageSelection.title'),
      description: t('onboarding.languageSelection.description'),
      icon: <Languages className="w-8 h-8 text-primary" />,
      completed: selectedLanguage !== '',
    },
    {
      id: 'welcome',
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      icon: <Heart className="w-8 h-8 text-red-500" />,
      completed: true,
    },
    {
      id: 'profile',
      title: t('onboarding.profile.title'),
      description: t('onboarding.profile.description'),
      icon: <Users className="w-8 h-8 text-blue-500" />,
      completed: userType !== '' && userName !== '',
    },
    {
      id: 'privacy',
      title: t('onboarding.privacy.title'),
      description: t('onboarding.privacy.description'),
      icon: <Shield className="w-8 h-8 text-green-500" />,
      completed: true,
    },
    {
      id: 'features',
      title: t('onboarding.features.title'),
      description: t('onboarding.features.description'),
      icon: <Smartphone className="w-8 h-8 text-purple-500" />,
      completed: true,
    },
  ];

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleLanguageSelection = (language: 'fr' | 'en') => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('dare-language', language);

    toast({
      title: t('onboardingFlow.language_selected_title'),
      description: t('onboardingFlow.language_selected_description'),
    });

    setTimeout(() => {
      setCurrentStep(1);
    }, 1000);
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finaliser l'onboarding
      localStorage.setItem('dare-onboarding-completed', 'true');
      localStorage.setItem(
        'dare-user-preferences',
        JSON.stringify({
          userName,
          userType,
          preferences,
          language: selectedLanguage,
        })
      );

      toast({
        title: t('onboarding.completion.title'),
        description: t('onboarding.completion.description'),
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderLanguageSelection = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Globe className="w-16 h-16 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">
          {t('onboardingFlow.choose_language_title')}
        </h2>
        <p className="text-muted-foreground">
          {t('onboardingFlow.choose_language_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
        <Button
          variant={selectedLanguage === 'fr' ? 'default' : 'outline'}
          onClick={() => handleLanguageSelection('fr')}
          className="h-24 flex flex-col space-y-2"
        >
          <div className="text-2xl">🇫🇷</div>
          <div className="font-semibold">Français</div>
          <div className="text-xs opacity-70">France • Afrique</div>
        </Button>

        <Button
          variant={selectedLanguage === 'en' ? 'default' : 'outline'}
          onClick={() => handleLanguageSelection('en')}
          className="h-24 flex flex-col space-y-2"
        >
          <div className="text-2xl">🇺🇸</div>
          <div className="font-semibold">English</div>
          <div className="text-xs opacity-70">International</div>
        </Button>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <Heart className="w-16 h-16 mx-auto text-red-500" />
        <h2 className="text-2xl font-bold">{t('onboarding.welcome.title')}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t('onboarding.welcome.subtitle')}
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">{t('appSlogan')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{t('onboarding.features.glucose')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{t('onboarding.features.reminders')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{t('onboarding.features.consultation')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{t('onboarding.features.community')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Users className="w-16 h-16 mx-auto text-blue-500" />
        <h2 className="text-2xl font-bold">{t('onboarding.profile.title')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.profile.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('auth.firstName')}
          </label>
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t('onboarding.profile.namePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('onboarding.profile.userType')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant={userType === 'patient' ? 'default' : 'outline'}
              onClick={() => setUserType('patient')}
              className="h-20 flex flex-col space-y-2"
            >
              <div className="text-2xl">🏥</div>
              <div className="text-sm font-medium">{t('auth.patient')}</div>
            </Button>

            <Button
              variant={userType === 'professional' ? 'default' : 'outline'}
              onClick={() => setUserType('professional')}
              className="h-20 flex flex-col space-y-2"
            >
              <div className="text-2xl">👩‍⚕️</div>
              <div className="text-sm font-medium">
                {t('auth.professional')}
              </div>
            </Button>

            <Button
              variant={userType === 'family' ? 'default' : 'outline'}
              onClick={() => setUserType('family')}
              className="h-20 flex flex-col space-y-2"
            >
              <div className="text-2xl">👨‍👩‍👧‍👦</div>
              <div className="text-sm font-medium">{t('auth.family')}</div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Shield className="w-16 h-16 mx-auto text-green-500" />
        <h2 className="text-2xl font-bold">{t('onboarding.privacy.title')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.privacy.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <div className="font-medium">
              {t('onboarding.privacy.notifications')}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('onboarding.privacy.notificationsDesc')}
            </div>
          </div>
          <Button
            variant={preferences.notifications ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setPreferences(prev => ({
                ...prev,
                notifications: !prev.notifications,
              }))
            }
          >
            {preferences.notifications
              ? t('common.enable')
              : t('common.disable')}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <div className="font-medium">
              {t('onboarding.privacy.dataSharing')}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('onboarding.privacy.dataSharingDesc')}
            </div>
          </div>
          <Button
            variant={preferences.dataSharing ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setPreferences(prev => ({
                ...prev,
                dataSharing: !prev.dataSharing,
              }))
            }
          >
            {preferences.dataSharing ? t('common.enable') : t('common.disable')}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <div className="font-medium">
              {t('onboarding.privacy.reminders')}
            </div>
            <div className="text-sm text-muted-foreground">
              {t('onboarding.privacy.remindersDesc')}
            </div>
          </div>
          <Button
            variant={preferences.reminders ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setPreferences(prev => ({ ...prev, reminders: !prev.reminders }))
            }
          >
            {preferences.reminders ? t('common.enable') : t('common.disable')}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Star className="w-16 h-16 mx-auto text-yellow-500" />
        <h2 className="text-2xl font-bold">{t('onboarding.features.title')}</h2>
        <p className="text-muted-foreground">
          {t('onboarding.features.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="font-medium">
              {t('onboarding.features.tracking')}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('onboarding.features.trackingDesc')}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-green-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="font-medium">{t('onboarding.features.ai')}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('onboarding.features.aiDesc')}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-purple-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="font-medium">
              {t('onboarding.features.telehealth')}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('onboarding.features.telehealthDesc')}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-orange-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="font-medium">
              {t('onboarding.features.support')}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('onboarding.features.supportDesc')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderLanguageSelection();
      case 1:
        return renderWelcome();
      case 2:
        return renderProfile();
      case 3:
        return renderPrivacy();
      case 4:
        return renderFeatures();
      default:
        return renderLanguageSelection();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedLanguage !== '';
      case 2:
        return userName !== '' && userType !== '';
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span>DARE</span>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {t('onboarding.step')} {currentStep + 1} {t('onboarding.of')}{' '}
              {onboardingSteps.length}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <Separator />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              {t('common.back')}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>
                {currentStep === onboardingSteps.length - 1
                  ? t('onboarding.getStarted')
                  : t('common.next')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
