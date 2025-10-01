'use client';

import { useEffect } from 'react';
import { Share2, Users, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFamily } from '@/contexts/FamilyContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const FamilyScreen = () => {
  const { t } = useTranslation();
  const { accessCode, getAccessCode, loading } = useFamily();
  const { toast } = useToast();

  useEffect(() => {
    getAccessCode();
  }, []);

  const handleCopy = () => {
    if (!accessCode) return;
    navigator.clipboard.writeText(accessCode);
    toast({
      title: 'Copied!',
      description: 'The access code has been copied to your clipboard.',
    });
  };

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#FFAB40] flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-medical-teal" />
          {t('familyScreen.heading.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('familyScreen.heading.subtitle')}
        </p>
      </div>

      {/* Access Code */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
            <Share2 className="w-5 h-5" />
            {t('familyScreen.familySharingCode.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-3xl font-mono font-bold text-yellow-800 bg-yellow-100 rounded-lg p-4">
              {loading ? 'Loading...' : accessCode || '—'}
            </div>
            <p className="text-sm text-yellow-700">
              {t('familyScreen.familySharingCode.subtitle')}
            </p>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              disabled={loading || !accessCode}
            >
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="font-medium text-red-700">
              {t('familyScreen.emergencyContact')}
            </div>
            <div className="text-sm text-red-600">
              Fatou Diop • +221 77 987 65 43
            </div>
          </div>
          <Button size="sm" className="bg-red-600 hover:bg-red-700">
            <Phone className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyScreen;
