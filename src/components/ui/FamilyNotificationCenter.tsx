import React, { useState, useEffect } from 'react';
import { Users, Bell, Plus, Mail, Phone, Heart, AlertTriangle, CheckCircle, X, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { familyNotificationService, FamilyMember } from '@/utils/FamilyNotificationService';
import { useToast } from '@/hooks/use-toast';
// Removed supabase dependency for now

interface FamilyNotificationCenterProps {
  className?: string;
}

const FamilyNotificationCenter: React.FC<FamilyNotificationCenterProps> = ({ className = "" }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    family_member_name: '',
    family_member_email: '',
    relationship: 'parent',
    notification_preferences: {
      hypoglycemia: true,
      hyperglycemia: true,
      medication_missed: false,
      emergency_only: false
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const members = await familyNotificationService.getFamilyMembers(user.id);
      setFamilyMembers(members);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres de la famille",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await familyNotificationService.addFamilyMember(user.id, newMember);
      
      toast({
        title: "✅ Membre ajouté",
        description: `${newMember.family_member_name} a été ajouté à votre cercle familial`,
      });

      setNewMember({
        family_member_name: '',
        family_member_email: '',
        relationship: 'parent',
        notification_preferences: {
          hypoglycemia: true,
          hyperglycemia: true,
          medication_missed: false,
          emergency_only: false
        }
      });
      
      setShowAddMember(false);
      loadFamilyMembers();
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre de la famille",
        variant: "destructive"
      });
    }
  };

  const updateNotificationPreferences = async (memberId: string, preferences: any) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ notification_preferences: preferences })
        .eq('id', memberId);

      if (error) throw error;

      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, notification_preferences: preferences }
            : member
        )
      );

      toast({
        title: "✅ Préférences mises à jour",
        description: "Les notifications ont été configurées",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive"
      });
    }
  };

  const getRelationshipLabel = (relationship: string) => {
    const labels: Record<string, string> = {
      'parent': 'Parent',
      'conjoint': 'Conjoint(e)',
      'enfant': 'Enfant',
      'frere_soeur': 'Frère/Sœur',
      'ami': 'Ami(e)',
      'autre': 'Autre'
    };
    return labels[relationship] || relationship;
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case 'parent': return '👨‍👩‍👧‍👦';
      case 'conjoint': return '💕';
      case 'enfant': return '👶';
      case 'frere_soeur': return '👫';
      case 'ami': return '👥';
      default: return '👤';
    }
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6 text-center">
          <Users className="w-8 h-8 text-blue-500 animate-pulse mx-auto mb-2" />
          <p>Chargement du cercle familial...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>Cercle Familial & Notifications</span>
            </div>
            <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un membre de la famille</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={newMember.family_member_name}
                      onChange={(e) => setNewMember(prev => ({
                        ...prev,
                        family_member_name: e.target.value
                      }))}
                      placeholder="Ex: Marie Dupont"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.family_member_email}
                      onChange={(e) => setNewMember(prev => ({
                        ...prev,
                        family_member_email: e.target.value
                      }))}
                      placeholder="marie@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relation</Label>
                    <Select
                      value={newMember.relationship}
                      onValueChange={(value) => setNewMember(prev => ({
                        ...prev,
                        relationship: value
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="conjoint">Conjoint(e)</SelectItem>
                        <SelectItem value="enfant">Enfant</SelectItem>
                        <SelectItem value="frere_soeur">Frère/Sœur</SelectItem>
                        <SelectItem value="ami">Ami(e)</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label>Préférences de notification</Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Risques d'hypoglycémie</span>
                      </div>
                      <Switch
                        checked={newMember.notification_preferences.hypoglycemia}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          notification_preferences: {
                            ...prev.notification_preferences,
                            hypoglycemia: checked
                          }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Risques d'hyperglycémie</span>
                      </div>
                      <Switch
                        checked={newMember.notification_preferences.hyperglycemia}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          notification_preferences: {
                            ...prev.notification_preferences,
                            hyperglycemia: checked
                          }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Oublis de médication</span>
                      </div>
                      <Switch
                        checked={newMember.notification_preferences.medication_missed}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          notification_preferences: {
                            ...prev.notification_preferences,
                            medication_missed: checked
                          }
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Urgences seulement</span>
                      </div>
                      <Switch
                        checked={newMember.notification_preferences.emergency_only}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          notification_preferences: {
                            ...prev.notification_preferences,
                            emergency_only: checked
                          }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddMember} className="flex-1">
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddMember(false)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{familyMembers.length}</div>
              <div className="text-sm opacity-90">Membres connectés</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {familyMembers.filter(m => !m.notification_preferences.emergency_only).length}
              </div>
              <div className="text-sm opacity-90">Notifications actives</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Members List */}
      {familyMembers.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun membre de famille</h3>
            <p className="text-gray-500 mb-4">
              Ajoutez vos proches pour qu'ils reçoivent des alertes en temps réel
            </p>
            <Button onClick={() => setShowAddMember(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un proche
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {familyMembers.map((member) => (
            <Card key={member.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getRelationshipIcon(member.relationship)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {member.family_member_name}
                        </h3>
                        <Badge variant="secondary">
                          {getRelationshipLabel(member.relationship)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <Mail className="w-4 h-4" />
                        <span>{member.family_member_email}</span>
                      </div>
                      
                      {/* Notification Preferences */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Notifications actives:</h4>
                        <div className="flex flex-wrap gap-2">
                          {member.notification_preferences.hypoglycemia && (
                            <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Hypoglycémie
                            </Badge>
                          )}
                          {member.notification_preferences.hyperglycemia && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Hyperglycémie
                            </Badge>
                          )}
                          {member.notification_preferences.medication_missed && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                              <Bell className="w-3 h-3 mr-1" />
                              Médication
                            </Badge>
                          )}
                          {member.notification_preferences.emergency_only && (
                            <Badge variant="outline" className="text-red-700 border-red-300 bg-red-100">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Urgences uniquement
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs text-green-600">Connecté</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Heart className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">
                Protection Familiale Active
              </h4>
              <p className="text-sm text-blue-700">
                Vos proches recevront automatiquement des alertes par email et SMS 
                lorsque l'IA détecte un risque glycémique. Les notifications d'urgence 
                sont envoyées immédiatement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyNotificationCenter;