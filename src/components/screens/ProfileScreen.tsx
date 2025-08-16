import { useState } from "react";
import { User, Phone, MapPin, Calendar, Users, Pill, Settings, Download, Shield, MessageSquare, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface ProfileScreenProps {}

const ProfileScreen = (props: ProfileScreenProps) => {
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Header Profil */}
      <div className="text-center space-y-4">
        <Avatar className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-400 to-gray-600">
          <AvatarFallback className="text-2xl text-white bg-transparent">👨</AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Amadou Diallo</h1>
          <p className="text-muted-foreground">Diabète Type 2 • Depuis 2019</p>
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              ✓ Profil Vérifié
            </Badge>
            <Badge variant="default" className="bg-medical-teal/10 text-medical-teal border-medical-teal/30">
              DARE Complet
            </Badge>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">6</div>
            <div className="text-xs text-muted-foreground">Années avec DARE</div>
          </CardContent>
        </Card>
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">847</div>
            <div className="text-xs text-muted-foreground">Mesures glycémie</div>
          </CardContent>
        </Card>
        <Card className="text-center p-3">
          <CardContent className="p-0">
            <div className="text-2xl font-bold text-medical-teal">91%</div>
            <div className="text-xs text-muted-foreground">Observance</div>
          </CardContent>
        </Card>
      </div>

      {/* Informations Personnelles */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-medical-teal" />
            Informations Personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nom complet</span>
              <p className="font-medium">Amadou Diallo</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date de naissance</span>
              <p className="font-medium">15 Mars 1975</p>
            </div>
            <div>
              <span className="text-muted-foreground">Âge</span>
              <p className="font-medium">49 ans</p>
            </div>
            <div>
              <span className="text-muted-foreground">Téléphone</span>
              <p className="font-medium">+221 77 123 45 67</p>
            </div>
            <div>
              <span className="text-muted-foreground">Ville</span>
              <p className="font-medium">Dakar, Sénégal</p>
            </div>
            <div>
              <span className="text-muted-foreground">Profession</span>
              <p className="font-medium">Enseignant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Équipe Médicale */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-medical-teal" />
            Équipe Médicale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Dr. Mamadou Kane</div>
            <div className="text-sm text-muted-foreground">Médecin traitant • Diabétologue</div>
            <div className="text-sm">📞 +221 33 825 14 52</div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="font-medium">CHU Aristide Le Dantec</div>
            <div className="text-sm text-muted-foreground">Établissement de suivi</div>
            <div className="text-sm text-muted-foreground">📍 Dakar, Sénégal</div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="font-medium">Dr. Aminata Sow</div>
            <div className="text-sm text-muted-foreground">Endocrinologue consultante</div>
            <div className="text-sm text-muted-foreground">🏥 Polyclinique du Point E</div>
          </div>
        </CardContent>
      </Card>

      {/* Traitement Actuel */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-medical-teal" />
            Traitement Actuel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-muted-foreground text-sm">Insulines</span>
            <p className="font-medium">Lantus 20UI matin • Humalog selon glycémie</p>
            <p className="text-xs text-muted-foreground">Conservées au frais (canari en terre cuite)</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Médicaments oraux</span>
            <p className="font-medium">Metformine 1000mg 2x/j</p>
            <p className="text-xs text-muted-foreground">Prix: 2,500 F CFA/mois</p>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Objectif glycémique</span>
            <p className="font-medium">70-140 mg/dL (norme UEMOA)</p>
            <p className="text-xs text-muted-foreground">Adapté au climat tropical</p>
          </div>
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card className="border-l-4 border-l-red-500 bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-700">
            <Phone className="w-5 h-5" />
            Contact d'Urgence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-medium text-red-700">Fatou Diop (Épouse)</div>
            <div className="text-sm text-red-600">+221 77 987 65 43</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <PhoneCall className="w-4 h-4 mr-1" />
              Appeler
            </Button>
            <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              <MessageSquare className="w-4 h-4 mr-1" />
              SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-medical-teal" />
            Paramètres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Notifications</span>
            <Switch 
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Partage de données</span>
            <Switch 
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mode sombre</span>
            <Switch 
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Boutons Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          <User className="w-4 h-4 mr-2" />
          Modifier le profil
        </Button>
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Exporter les données
        </Button>
        <Button variant="outline" className="w-full">
          <Shield className="w-4 h-4 mr-2" />
          Confidentialité
        </Button>
      </div>
    </div>
  );
};

export default ProfileScreen;