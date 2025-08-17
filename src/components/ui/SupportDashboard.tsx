import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Trophy, Heart, Calendar, AlertTriangle } from 'lucide-react';
import { useSupportFeatures } from '@/hooks/useSupportFeatures';
import SupportSessionCard from './SupportSessionCard';
import CommunityChallengeCard from './CommunityChallengeCard';
import SOSButton from './SOSButton';

const SupportDashboard = () => {
  const {
    supportSessions,
    communityChallenge,
    onlineExperts,
    peerSupportPairs,
    loading,
    error,
    joinSession,
    leaveSession,
    joinChallenge,
    updateChallengeProgress,
    reload
  } = useSupportFeatures();

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={reload} className="mt-4">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Support Communautaire</h2>
          <p className="text-muted-foreground">
            Entraide, sessions de groupe et défis communautaires
          </p>
        </div>
        <Button onClick={reload} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* Emergency Support Section */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Support d'Urgence
          </CardTitle>
          <CardDescription>
            Besoin d'aide immédiate ? Nos experts sont là pour vous aider 24h/7j
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <SOSButton />
              <p className="text-xs text-muted-foreground text-center">
                Cliquez seulement en cas de besoin réel d'assistance
              </p>
            </div>
            
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-medical-green" />
                <span className="font-medium text-sm">Experts disponibles</span>
              </div>
              <div className="text-2xl font-bold text-medical-green">
                {onlineExperts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Temps de réponse moyen: &lt; 5 minutes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions" className="gap-2">
            <Calendar className="w-4 h-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <Trophy className="w-4 h-4" />
            Défis
          </TabsTrigger>
          <TabsTrigger value="buddies" className="gap-2">
            <Heart className="w-4 h-4" />
            Binômes
          </TabsTrigger>
          <TabsTrigger value="experts" className="gap-2">
            <Users className="w-4 h-4" />
            Experts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions de Support</CardTitle>
              <CardDescription>
                Rejoignez nos sessions thématiques animées par des experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : supportSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportSessions.map((session) => (
                    <SupportSessionCard
                      key={session.id}
                      session={session}
                      onJoin={joinSession}
                      onLeave={leaveSession}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucune session programmée pour le moment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Défis Communautaires</CardTitle>
              <CardDescription>
                Participez aux défis et gagnez des badges de reconnaissance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : communityChallenge.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communityChallenge.map((challenge) => (
                    <CommunityChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onJoin={joinChallenge}
                      onUpdateProgress={updateChallengeProgress}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucun défi disponible pour le moment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buddies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Système de Binômes</CardTitle>
              <CardDescription>
                Trouvez un mentor ou accompagnez un nouveau membre
              </CardDescription>
            </CardHeader>
            <CardContent>
              {peerSupportPairs.length > 0 ? (
                <div className="space-y-4">
                  {peerSupportPairs.map((pair) => (
                    <div key={pair.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-medical-pink" />
                        <span className="font-medium">Relation de mentorat</span>
                        <Badge className="bg-medical-green-light text-medical-green">
                          Actif
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Commencé le {new Date(pair.paired_at).toLocaleDateString('fr-FR')}
                      </p>
                      {pair.notes && (
                        <p className="text-sm mt-2">{pair.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Vous n'avez pas encore de binôme assigné
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                      <Button variant="outline" className="gap-2">
                        <Users className="w-4 h-4" />
                        Devenir mentor
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Heart className="w-4 h-4" />
                        Trouver un mentor
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Experts en Ligne</CardTitle>
              <CardDescription>
                Nos experts diabète disponibles pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent>
              {onlineExperts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {onlineExperts.map((expert) => (
                    <div key={expert.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Expert disponible</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          Spécialités: {expert.specialties.join(', ')}
                        </div>
                        <div className="text-muted-foreground">
                          Temps de réponse: ~{expert.average_response_time_minutes} min
                        </div>
                        <div className="text-muted-foreground">
                          {expert.total_responses} réponses données
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucun expert disponible en ce moment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportDashboard;