import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  Settings, 
  Play, 
  Pause,
  Calendar,
  Heart,
  BookOpen,
  Trophy,
  RefreshCw
} from 'lucide-react';
import { useAutoMessaging } from '@/hooks/useAutoMessaging';
import { useUserRoles } from '@/hooks/useUserRoles';
import AutoMessageCard from './AutoMessageCard';
import AutoMessaging from '@/utils/AutoMessaging';

const AutoMessagingDashboard = () => {
  const { hasPermission } = useUserRoles();
  const {
    messages,
    loading,
    sendMotivationalMessage,
    sendEducationalMessage,
    sendCelebrationMessage,
    checkDueMessages,
    triggerHelpfulMessages,
    reload
  } = useAutoMessaging();

  const [celebrationUser, setCelebrationUser] = useState('');
  const [celebrationType, setCelebrationType] = useState('one_year_dare');
  const [sending, setSending] = useState(false);

  // Check if user can manage automated messages
  const canManage = true; // For now, allow all users - will be restricted by RLS policies

  const handleSendMotivation = async () => {
    setSending(true);
    await sendMotivationalMessage();
    setSending(false);
  };

  const handleSendEducational = async () => {
    setSending(true);
    await sendEducationalMessage();
    setSending(false);
  };

  const handleSendCelebration = async () => {
    if (!celebrationUser.trim()) return;
    
    setSending(true);
    await sendCelebrationMessage(celebrationUser, celebrationType);
    setCelebrationUser('');
    setSending(false);
  };

  const handleTriggerAll = async () => {
    setSending(true);
    await triggerHelpfulMessages();
    setSending(false);
  };

  const handleCheckDue = async () => {
    setSending(true);
    await checkDueMessages();
    setSending(false);
  };

  if (!canManage) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour gérer les messages automatiques.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messages Automatiques</h2>
          <p className="text-muted-foreground">
            Gérez les messages motivationnels et éducatifs automatiques
          </p>
        </div>
        <Button onClick={reload} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="control" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="control" className="gap-2">
            <Settings className="w-4 h-4" />
            Contrôles
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="w-4 h-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="w-4 h-4" />
            Programmation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Envoyez des messages instantanément ou vérifiez les messages programmés
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={handleSendMotivation} 
                disabled={sending}
                className="gap-2 h-20 flex-col"
                variant="outline"
              >
                <Heart className="w-6 h-6 text-medical-green" />
                <span>Message Motivationnel</span>
              </Button>
              
              <Button 
                onClick={handleSendEducational} 
                disabled={sending}
                className="gap-2 h-20 flex-col"
                variant="outline"
              >
                <BookOpen className="w-6 h-6 text-medical-blue" />
                <span>Conseil Éducatif</span>
              </Button>
              
              <Button 
                onClick={handleTriggerAll} 
                disabled={sending}
                className="gap-2 h-20 flex-col"
                variant="outline"
              >
                <Play className="w-6 h-6 text-medical-purple" />
                <span>Tous les Messages</span>
              </Button>
              
              <Button 
                onClick={handleCheckDue} 
                disabled={sending}
                className="gap-2 h-20 flex-col"
                variant="outline"
              >
                <Clock className="w-6 h-6 text-medical-orange" />
                <span>Vérifier Programmés</span>
              </Button>
            </CardContent>
          </Card>

          {/* Celebration Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Messages de Célébration
              </CardTitle>
              <CardDescription>
                Créez des messages personnalisés pour célébrer les réussites des membres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="celebrationUser">Nom du membre</Label>
                  <Input
                    id="celebrationUser"
                    placeholder="Entrez le nom du membre"
                    value={celebrationUser}
                    onChange={(e) => setCelebrationUser(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="celebrationType">Type de célébration</Label>
                  <Select value={celebrationType} onValueChange={setCelebrationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_year_dare">1 an avec DARE</SelectItem>
                      <SelectItem value="glucose_streak">Régularité glycémique</SelectItem>
                      <SelectItem value="community_helper">Aide communautaire</SelectItem>
                      <SelectItem value="milestone_reached">Étape importante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handleSendCelebration}
                disabled={!celebrationUser.trim() || sending}
                className="gap-2"
              >
                <Trophy className="w-4 h-4" />
                Envoyer la Célébration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages Récents</CardTitle>
              <CardDescription>
                Historique des messages automatiques envoyés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <AutoMessageCard
                      key={message.id}
                      {...message}
                      showActions={true}
                      onResend={() => {
                        // Handle resend logic based on message type
                        if (message.type === 'daily_motivation') {
                          handleSendMotivation();
                        } else if (message.type === 'educational') {
                          handleSendEducational();
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucun message automatique envoyé récemment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages Programmés</CardTitle>
              <CardDescription>
                Configuration des messages automatiques récurrents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-medical-green" />
                    <div>
                      <p className="font-medium">Messages Motivationnels</p>
                      <p className="text-sm text-muted-foreground">
                        Tous les jours à 08:00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-medical-green-light text-medical-green">
                      Actif
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-medical-blue" />
                    <div>
                      <p className="font-medium">Conseils Éducatifs</p>
                      <p className="text-sm text-muted-foreground">
                        Chaque lundi à 10:00
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-medical-blue-light text-medical-blue">
                      Actif
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoMessagingDashboard;