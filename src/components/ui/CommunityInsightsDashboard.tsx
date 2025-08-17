import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Users, 
  RefreshCw 
} from 'lucide-react';
import { useCommunityInsights } from '@/hooks/useDataIntegration';

const CommunityInsightsDashboard = () => {
  const { insights, loading, error, refresh } = useCommunityInsights();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights Communautaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insights Communautaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Insights Communautaires
            </CardTitle>
            <CardDescription>
              Données anonymisées de la communauté - Mis à jour le {insights.lastUpdated}
            </CardDescription>
          </div>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Temps dans la cible moyen */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-medical-green/10 to-medical-green/5 rounded-lg border border-medical-green/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-medical-green" />
              <div>
                <h3 className="font-semibold text-lg">Temps dans la cible moyen</h3>
                <p className="text-sm text-muted-foreground">Communauté globale</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-medical-green">{insights.averageTimeInRange}</div>
              <Badge variant="outline" className="bg-medical-green-light text-medical-green border-medical-green">
                <Users className="w-3 h-3 mr-1" />
                {insights.totalParticipants} participants
              </Badge>
            </div>
          </div>

          {/* Région la plus active */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-medical-blue/10 to-medical-blue/5 rounded-lg border border-medical-blue/20">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-medical-blue" />
              <div>
                <h3 className="font-semibold text-lg">Région la plus active</h3>
                <p className="text-sm text-muted-foreground">Plus d'engagement communautaire</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-medical-blue">{insights.mostActiveRegion}</div>
              <Badge variant="outline" className="bg-medical-blue-light text-medical-blue border-medical-blue">
                🏆 Champion
              </Badge>
            </div>
          </div>

          {/* Horaires de repas populaires */}
          <div className="p-4 bg-gradient-to-r from-medical-purple/10 to-medical-purple/5 rounded-lg border border-medical-purple/20">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-medical-purple" />
              <h3 className="font-semibold text-lg">Horaires de repas populaires</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.popularMealTimes.map((time, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-medical-purple-light text-medical-purple border-medical-purple"
                >
                  {time}
                </Badge>
              ))}
            </div>
          </div>

          {/* Défis communs */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-25 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="font-semibold text-lg">Défis communs</h3>
            </div>
            <div className="space-y-2">
              {insights.commonChallenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <span className="text-sm">{challenge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Les données sont anonymisées et agrégées pour protéger la confidentialité des utilisateurs
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityInsightsDashboard;