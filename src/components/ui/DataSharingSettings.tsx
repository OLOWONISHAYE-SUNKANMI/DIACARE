import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, Users, MapPin, Calendar, Heart } from 'lucide-react';
import { useDataSharing } from '@/hooks/useDataIntegration';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const DataSharingSettings = () => {
  const { t } = useTranslation();
  const { preferences, loading, updatePreferences } = useDataSharing();
  const { toast } = useToast();

  const handleToggle = async (
    key: keyof typeof preferences,
    value: boolean
  ) => {
    if (!preferences) return;

    const success = await updatePreferences({ [key]: value });
    if (success) {
      toast({
        title: t('dataSharingSettings.Settings.sharePrefs.successTitle'),
        description: t(
          'dataSharingSettings.Settings.sharePrefs.successDescription'
        ),
      });
    } else {
      toast({
        title: t('dataSharingSettings.Settings.sharePrefs.errorTitle'),
        description: t(
          'dataSharingSettings.Settings.sharePrefs.errorDescription'
        ),
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t('dataSharingSettings.Settings.privacy.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          {t('dataSharingSettings.Settings.privacy.anonymousData.title')}
        </CardTitle>
        <CardDescription>
          {t('dataSharingSettings.Settings.privacy.anonymousData.description')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-medical-green" />
            <div>
              <h4 className="font-medium">
                {t('dataSharingSettings.Settings.privacy.shareStats.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(
                  'dataSharingSettings.Settings.privacy.shareStats.description'
                )}
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareStats}
            onCheckedChange={checked => handleToggle('shareStats', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-medical-blue" />
            <div>
              <h4 className="font-medium">
                {t('dataSharingSettings.Settings.privacy.shareRegion.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(
                  'dataSharingSettings.Settings.privacy.shareRegion.description'
                )}
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareRegion}
            onCheckedChange={checked => handleToggle('shareRegion', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-medical-purple" />
            <div>
              <h4 className="font-medium">
                {t('dataSharingSettings.Settings.privacy.shareAge.title')}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t('dataSharingSettings.Settings.privacy.shareAge.description')}
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareAgeGroup}
            onCheckedChange={checked => handleToggle('shareAgeGroup', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-medical-teal" />
            <div>
              <h4 className="font-medium">
                {t(
                  'dataSharingSettings.Settings.privacy.shareDiabetesType.title'
                )}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t(
                  'dataSharingSettings.Settings.privacy.shareDiabetesType.description'
                )}
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareDiabetesType}
            onCheckedChange={checked =>
              handleToggle('shareDiabetesType', checked)
            }
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">
                {t('dataSharingSettings.Settings.privacy.guarantee.title')}
              </p>
              <p className="text-muted-foreground">
                {t(
                  'dataSharingSettings.Settings.privacy.guarantee.description'
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSharingSettings;
