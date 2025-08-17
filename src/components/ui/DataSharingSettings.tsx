import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, Users, MapPin, Calendar, Heart } from 'lucide-react';
import { useDataSharing } from '@/hooks/useDataIntegration';
import { useToast } from '@/hooks/use-toast';

const DataSharingSettings = () => {
  const { preferences, loading, updatePreferences } = useDataSharing();
  const { toast } = useToast();

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    if (!preferences) return;

    const success = await updatePreferences({ [key]: value });
    if (success) {
      toast({
        title: "Préférences mises à jour",
        description: "Vos paramètres de partage ont été sauvegardés."
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Paramètres de confidentialité
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
          Partage de données anonymes
        </CardTitle>
        <CardDescription>
          Contribuez à améliorer la communauté en partageant vos données de manière anonyme
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-medical-green" />
            <div>
              <h4 className="font-medium">Partager mes statistiques</h4>
              <p className="text-sm text-muted-foreground">
                Glycémie moyenne et temps dans la cible
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareStats}
            onCheckedChange={(checked) => handleToggle('shareStats', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-medical-blue" />
            <div>
              <h4 className="font-medium">Partager ma région</h4>
              <p className="text-sm text-muted-foreground">
                Région géographique pour les statistiques locales
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareRegion}
            onCheckedChange={(checked) => handleToggle('shareRegion', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-medical-purple" />
            <div>
              <h4 className="font-medium">Partager ma tranche d'âge</h4>
              <p className="text-sm text-muted-foreground">
                Groupe d'âge pour les comparaisons démographiques
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareAgeGroup}
            onCheckedChange={(checked) => handleToggle('shareAgeGroup', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-medical-teal" />
            <div>
              <h4 className="font-medium">Partager mon type de diabète</h4>
              <p className="text-sm text-muted-foreground">
                Type de diabète pour des insights spécialisés
              </p>
            </div>
          </div>
          <Switch
            checked={preferences.shareDiabetesType}
            onCheckedChange={(checked) => handleToggle('shareDiabetesType', checked)}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Confidentialité garantie</p>
              <p className="text-muted-foreground">
                Toutes les données partagées sont anonymisées et ne peuvent pas être liées à votre identité. 
                Elles servent uniquement à améliorer l'expérience communautaire.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSharingSettings;