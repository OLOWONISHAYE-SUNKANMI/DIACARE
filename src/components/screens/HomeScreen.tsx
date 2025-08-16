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
    <div className="flex-1 p-4 space-y-6 pb-24 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Bonjour !</h2>
        <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
      </div>

      {/* Current Glucose Reading - Medical Card */}
      <Card className="bg-card shadow-lg border border-border rounded-lg">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center space-x-2 text-card-foreground">
            <div className="w-10 h-10 rounded-full bg-medical-green flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold">Glycémie Actuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-medical-green">
              {currentGlucose}
            </div>
            <div className="text-lg text-muted-foreground">mg/dL</div>
            <div className="inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium bg-status-active-bg text-status-active">
              <Activity className="w-4 h-4" />
              <span>Dans la normale</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Dernière mesure : Aujourd'hui 14:30</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid - Medical Style */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colors = ['text-medical-blue', 'text-medical-green', 'text-medical-teal', 'text-warning'];
            const bgColors = ['bg-medical-blue-light', 'bg-medical-green-light', 'bg-medical-teal-light', 'bg-status-warning-bg'];
            return (
              <Card key={index} className="bg-card shadow-md border border-border rounded-lg transition-all cursor-pointer hover:shadow-lg hover:scale-105">
                <CardContent className="p-4 text-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${bgColors[index]}`}>
                    <div className="text-xl">{action.emoji}</div>
                  </div>
                  <Icon className={`w-6 h-6 ${colors[index]} mx-auto`} />
                  <p className="text-sm font-medium text-card-foreground">{action.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission DARE - Medical Style */}
      <Card className="bg-card shadow-lg border border-border rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-medical-green flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span>Mission DARE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-medical-green-light">
              <div className="w-8 h-8 rounded-full bg-medical-green text-white flex items-center justify-center font-bold text-sm">D</div>
              <div>
                <p className="font-medium text-card-foreground">Diabetes Awareness</p>
                <p className="text-sm text-muted-foreground">Sensibilisation au diabète</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-medical-teal-light">
              <div className="w-8 h-8 rounded-full bg-medical-teal text-white flex items-center justify-center font-bold text-sm">A</div>
              <div>
                <p className="font-medium text-card-foreground">Routine</p>
                <p className="text-sm text-muted-foreground">Routines de soins quotidiennes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-medical-blue-light">
              <div className="w-8 h-8 rounded-full bg-medical-blue text-white flex items-center justify-center font-bold text-sm">R</div>
              <div>
                <p className="font-medium text-card-foreground">Empowerment</p>
                <p className="text-sm text-muted-foreground">Autonomisation et contrôle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Défis DARE Aujourd'hui - Medical Style */}
      <Card className="bg-card shadow-lg border border-border rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-medical-green flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span>Défis DARE Aujourd'hui</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                challenge.completed ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {challenge.letter}
              </div>
              <span className={`flex-1 text-sm font-medium ${challenge.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
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

      {/* Pricing Cards - Medical Professional */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Forfaits DARE</h3>
        <div className="space-y-3">
          {/* Forfait Essentiel */}
          <Card className="bg-card shadow-lg border border-border rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center justify-between">
                <span>Forfait Essentiel</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-medical-green">5 000</div>
                  <div className="text-sm text-muted-foreground">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-card-foreground">Suivi glycémie de base</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-card-foreground">Rappels médicaments</span>
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
          <Card className="bg-card shadow-lg border-2 border-medical-green rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>Forfait Premium</span>
                  <Badge className="bg-medical-green text-white text-xs">RECOMMANDÉ</Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-medical-green">10 000</div>
                  <div className="text-sm text-muted-foreground">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-card-foreground">Suivi glycémie avancé</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-card-foreground">Rappels intelligents</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-card-foreground">Analyses et prédictions IA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-card-foreground">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;