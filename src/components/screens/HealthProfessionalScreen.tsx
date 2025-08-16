import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Stethoscope, 
  Video, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  CheckCircle,
  Clock,
  Star,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const HealthProfessionalScreen = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registrationStep, setRegistrationStep] = useState(1);
  const { toast } = useToast();

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscription soumise",
      description: "Votre demande d'inscription sera examinée sous 24h",
    });
    setRegistrationStep(2);
  };

  const handleConsultationStart = () => {
    toast({
      title: "Téléconsultation initiée",
      description: "Connexion avec le patient en cours...",
    });
  };

  // Mock data
  const consultations = [
    {
      id: 1,
      patient: "Marie D.",
      time: "14:30",
      type: "Suivi diabète",
      status: "En attente",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 2,
      patient: "Jean M.",
      time: "15:00",
      type: "Consultation urgente",
      status: "En cours",
      avatar: "/api/placeholder/32/32"
    },
    {
      id: 3,
      patient: "Sophie L.",
      time: "15:30",
      type: "Contrôle glycémie",
      status: "Programmée",
      avatar: "/api/placeholder/32/32"
    }
  ];

  const earnings = {
    today: 245,
    week: 1680,
    month: 6750,
    pending: 420
  };

  if (registrationStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Portal Professionnel DARE</CardTitle>
              <CardDescription>
                Rejoignez notre réseau de professionnels de santé et offrez des téléconsultations spécialisées en diabète
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialty">Spécialité *</Label>
                  <select id="specialty" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="">Sélectionnez votre spécialité</option>
                    <option value="endocrinologue">Endocrinologue</option>
                    <option value="medecin-generaliste">Médecin généraliste</option>
                    <option value="diabetologue">Diabétologue</option>
                    <option value="nutritionniste">Nutritionniste</option>
                    <option value="infirmier-diabetes">Infirmier spécialisé diabète</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="license">Numéro RPPS/ADELI *</Label>
                  <Input id="license" placeholder="Ex: 12345678901" required />
                </div>

                <div>
                  <Label htmlFor="hospital">Établissement</Label>
                  <Input id="hospital" placeholder="Hôpital ou clinique" />
                </div>

                <div>
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input id="email" type="email" required />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" type="tel" required />
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <Label htmlFor="terms" className="text-sm">
                    J'accepte les conditions d'utilisation et la charte déontologique DARE
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Soumettre ma candidature
                  <FileText className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <h4 className="font-semibold mb-2">Avantages professionnels :</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Rémunération de 45€ par téléconsultation</li>
                  <li>• Paiement automatique sous 48h</li>
                  <li>• Plateforme sécurisée et certifiée</li>
                  <li>• Accès aux données glycémiques temps réel</li>
                  <li>• Support technique 24/7</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Dr. Martin Dubois</h1>
                <p className="text-sm text-muted-foreground">Endocrinologue - RPPS: 12345678901</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Vérifié
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="earnings">Rémunérations</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-muted-foreground">Patients suivis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Video className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-muted-foreground">Consultations aujourd'hui</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">€540</p>
                      <p className="text-muted-foreground">Revenus aujourd'hui</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">4.9</p>
                      <p className="text-muted-foreground">Note moyenne</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prochaines consultations */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Prochaines consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={consultation.avatar} />
                          <AvatarFallback>{consultation.patient.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{consultation.patient}</p>
                          <p className="text-sm text-muted-foreground">{consultation.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{consultation.time}</p>
                        <Badge variant={consultation.status === 'En cours' ? 'default' : 'secondary'}>
                          {consultation.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={handleConsultationStart}>
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des consultations</CardTitle>
                <CardDescription>
                  Planifiez et gérez vos téléconsultations avec les patients DARE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Créneaux disponibles</h3>
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      Gérer mes créneaux
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="font-medium">Créneaux libres</p>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">Cette semaine</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <Video className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium">Consultations programmées</p>
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-sm text-muted-foreground">Cette semaine</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                        <p className="font-medium">Consultations terminées</p>
                        <p className="text-2xl font-bold">127</p>
                        <p className="text-sm text-muted-foreground">Ce mois</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenus détaillés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Aujourd'hui</span>
                    <span className="font-semibold">€{earnings.today}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Cette semaine</span>
                    <span className="font-semibold">€{earnings.week}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Ce mois</span>
                    <span className="font-semibold">€{earnings.month}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-orange-600">
                    <span>En attente de paiement</span>
                    <span className="font-semibold">€{earnings.pending}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paiements automatiques</CardTitle>
                  <CardDescription>
                    Vos rémunérations sont versées automatiquement tous les mardis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">Dernier virement</p>
                          <p className="text-sm text-green-600">15 janvier 2024</p>
                        </div>
                        <p className="text-lg font-bold text-green-800">€1,890</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-orange-800">Prochain virement</p>
                          <p className="text-sm text-orange-600">23 janvier 2024</p>
                        </div>
                        <p className="text-lg font-bold text-orange-800">€{earnings.pending}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mes patients</CardTitle>
                <CardDescription>
                  Suivi des patients diabétiques qui vous sont assignés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {consultations.map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={consultation.avatar} />
                          <AvatarFallback>{consultation.patient.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{consultation.patient}</p>
                          <p className="text-sm text-muted-foreground">Diabète Type 2 - Dernière glycémie: 142 mg/dL</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Dossier
                        </Button>
                        <Button size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Contacter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthProfessionalScreen;