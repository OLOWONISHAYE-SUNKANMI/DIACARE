import { useState } from "react";
import { Users, Share2, Settings, UserPlus, Shield, Eye, AlertTriangle, Clock, CheckCircle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface FamilyScreenProps {}

const FamilyScreen = (props: FamilyScreenProps) => {
  const [showShareCode, setShowShareCode] = useState(false);

  const familyMembers = [
    {
      id: 1,
      name: "Fatou Diop",
      role: "Épouse",
      permission: "Accès complet",
      status: "online",
      avatar: "F",
      lastSeen: "En ligne",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      id: 2,
      name: "Dr. Kane",
      role: "Médecin",
      permission: "Urgences",
      status: "emergency",
      avatar: "Dr",
      lastSeen: "Il y a 2h",
      icon: AlertTriangle,
      color: "text-orange-500"
    },
    {
      id: 3,
      name: "Ibrahim",
      role: "Fils",
      permission: "Lecture seule",
      status: "readonly",
      avatar: "I",
      lastSeen: "Il y a 1j",
      icon: Eye,
      color: "text-blue-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      time: "Il y a 10 min",
      action: "Fatou a consulté vos dernières glycémies",
      type: "view"
    },
    {
      id: 2,
      time: "Il y a 2h",
      action: "Dr. Kane a ajouté une note médicale",
      type: "medical"
    },
    {
      id: 3,
      time: "Hier 19:30",
      action: "Ibrahim a reçu une alerte manquée",
      type: "alert"
    },
    {
      id: 4,
      time: "Hier 15:00",
      action: "Fatou a confirmé votre injection",
      type: "confirmation"
    }
  ];

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-medical-teal" />
          Famille DARE
        </h1>
        <p className="text-muted-foreground">Votre cercle de soins</p>
      </div>

      {/* Code de partage */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
            <Share2 className="w-5 h-5" />
            Code de Partage Familial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-3xl font-mono font-bold text-yellow-800 bg-yellow-100 rounded-lg p-4">
              AF-2847
            </div>
            <p className="text-sm text-yellow-700">
              Partagez ce code avec vos proches pour qu'ils puissent vous accompagner
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
            >
              Copier le code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">3</div>
            <div className="text-xs text-muted-foreground">Care Partners</div>
          </CardContent>
        </Card>
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">47</div>
            <div className="text-xs text-muted-foreground">Alertes</div>
          </CardContent>
        </Card>
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">12</div>
            <div className="text-xs text-muted-foreground">Jours connectés</div>
          </CardContent>
        </Card>
      </div>

      {/* Membres de la famille */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-medical-teal" />
            Membres de la Famille
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {familyMembers.map((member, index) => (
            <div key={member.id}>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-medical-teal/10 text-medical-teal font-semibold">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{member.name}</span>
                    <member.icon className={`w-4 h-4 ${member.color}`} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.role} • {member.permission}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {member.lastSeen}
                  </div>
                </div>

                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              {index < familyMembers.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-medical-teal" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-medical-teal rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Boutons Actions */}
      <div className="space-y-3">
        <Button className="w-full bg-medical-teal hover:bg-medical-teal/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter un Care Partner
        </Button>
        <Button variant="outline" className="w-full">
          <Settings className="w-4 h-4 mr-2" />
          Gérer les Permissions
        </Button>
      </div>

      {/* Contact d'urgence rapide */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-700">Contact d'Urgence</div>
              <div className="text-sm text-red-600">Fatou Diop • +221 77 987 65 43</div>
            </div>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamilyScreen;