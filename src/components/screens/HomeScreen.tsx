import { Activity, TrendingUp, Calendar, AlertCircle, Pill, BarChart3, Utensils, Footprints, Target, Check, X, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HomeScreen = () => {
  const currentGlucose = 126; // mg/dL
  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: "low", color: "glucose-low", message: "Glycémie basse" };
    if (value <= 180) return { status: "normal", color: "glucose-normal", message: "Glycémie normale" };
    return { status: "high", color: "glucose-high", message: "Glycémie élevée" };
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  const quickActions = [
    { icon: BarChart3, label: "Ajouter Glycémie", emoji: "📊" },
    { icon: Utensils, label: "Scanner Repas", emoji: "🍽️" },
    { icon: Pill, label: "Médicaments", emoji: "💊" },
    { icon: Footprints, label: "Activité", emoji: "🏃" },
  ];

  const challenges = [
    { letter: "D", challenge: "Mesurer la glycémie 3x aujourd'hui", completed: true },
    { letter: "A", challenge: "Prendre ses médicaments à l'heure", completed: false },
    { letter: "R", challenge: "30 min d'activité physique", completed: false },
    { letter: "E", challenge: "Noter ses observations", completed: true },
  ];

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      {/* Welcome & Regional Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Bonjour !</h2>
          <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
        </div>
        <Badge className="bg-africa-green text-white flex items-center space-x-1">
          <Globe className="w-3 h-3" />
          <span className="text-xs">🌍 Afrique de l'Ouest & Centrale</span>
        </Badge>
      </div>

      {/* Current Glucose Reading - Large Teal Card */}
      <Card className="bg-medical-teal text-white border-0 shadow-lg">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center space-x-2 text-white">
            <Activity className="w-6 h-6" />
            <span className="text-lg">Glycémie Actuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-white">
              {currentGlucose}
            </div>
            <div className="text-lg text-white/90">mg/dL</div>
            <div className="inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white">
              <Activity className="w-4 h-4" />
              <span>Dans la normale</span>
            </div>
          </div>
          <div className="text-sm text-white/80 flex items-center justify-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Dernière mesure : Aujourd'hui 14:30</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-all cursor-pointer hover:scale-105 border-medical-teal/20">
                <CardContent className="p-4 text-center space-y-3">
                  <div className="text-2xl">{action.emoji}</div>
                  <Icon className="w-6 h-6 text-medical-teal mx-auto" />
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission DARE */}
      <Card className="border-l-4 border-l-medical-teal bg-gradient-to-r from-medical-teal-light to-white">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center space-x-2">
            <Target className="w-5 h-5 text-medical-teal" />
            <span>Mission DARE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-medical-teal text-white flex items-center justify-center font-bold text-sm">D</div>
              <div>
                <p className="font-medium text-foreground">Diabetes Awareness</p>
                <p className="text-sm text-muted-foreground">Sensibilisation au diabète</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-medical-teal text-white flex items-center justify-center font-bold text-sm">A</div>
              <div>
                <p className="font-medium text-foreground">Routine</p>
                <p className="text-sm text-muted-foreground">Routines de soins quotidiennes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-medical-teal text-white flex items-center justify-center font-bold text-sm">R</div>
              <div>
                <p className="font-medium text-foreground">Empowerment</p>
                <p className="text-sm text-muted-foreground">Autonomisation et contrôle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Défis DARE Aujourd'hui */}
      <Card className="border-medical-teal border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center space-x-2">
            <Target className="w-5 h-5 text-medical-teal" />
            <span>Défis DARE Aujourd'hui</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                challenge.completed ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {challenge.letter}
              </div>
              <span className={`flex-1 text-sm ${challenge.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {challenge.challenge}
              </span>
              {challenge.completed ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <div className="w-4 h-4 rounded border border-muted-foreground" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Forfaits DARE</h3>
        <div className="space-y-3">
          {/* Forfait Essentiel */}
          <Card className="bg-pricing-essential-light border-pricing-essential">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center justify-between">
                <span>Forfait Essentiel</span>
                <span className="text-xl font-bold text-pricing-essential">5 000 F CFA/mois</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm">Suivi glycémie de base</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm">Rappels médicaments</span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="w-4 h-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Analyses avancées</span>
              </div>
              <div className="flex items-center space-x-2">
                <X className="w-4 h-4 text-destructive" />
                <span className="text-sm text-muted-foreground">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>

          {/* Forfait Premium */}
          <Card className="bg-pricing-premium-light border-pricing-premium">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center justify-between">
                <span>Forfait Premium</span>
                <span className="text-xl font-bold text-pricing-premium">10 000 F CFA/mois</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm">Suivi glycémie avancé</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm">Rappels intelligents</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm">Analyses et prédictions IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;