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
    <div className="flex-1 p-6 space-y-8 pb-32 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center space-y-3 pt-4">
        <h2 className="text-4xl font-black text-foreground tracking-wide">Bonjour !</h2>
        <p className="text-lg text-muted-foreground font-light">Comment vous sentez-vous aujourd'hui ?</p>
      </div>

      {/* Current Glucose Reading - Dark Glassmorphism */}
      <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40">
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="flex items-center justify-center space-x-3 text-foreground">
            <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center backdrop-blur-sm border border-cyan/30">
              <Activity className="w-7 h-7 text-cyan" />
            </div>
            <span className="text-2xl font-bold text-white">Glycémie Actuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 pb-8">
          <div className="space-y-4">
            <div className="text-8xl font-black text-white drop-shadow-2xl">
              {currentGlucose}
            </div>
            <div className="text-2xl text-cyan font-semibold">mg/dL</div>
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-semibold bg-lime-green/20 text-lime-green backdrop-blur-sm shadow-lg border border-lime-green/30">
              <Activity className="w-5 h-5" />
              <span>Dans la normale</span>
            </div>
          </div>
          <div className="text-base text-muted-foreground flex items-center justify-center space-x-2 font-medium">
            <Calendar className="w-5 h-5" />
            <span>Dernière mesure : Aujourd'hui 14:30</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid - Dark Glassmorphism */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-foreground">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const colors = ['text-cyan', 'text-electric-green', 'text-vibrant-purple', 'text-vibrant-orange'];
            const bgColors = ['bg-cyan/20', 'bg-electric-green/20', 'bg-vibrant-purple/20', 'bg-vibrant-orange/20'];
            const borderColors = ['border-cyan/30', 'border-electric-green/30', 'border-vibrant-purple/30', 'border-vibrant-orange/30'];
            return (
              <Card key={index} className={`border backdrop-blur-xl shadow-2xl rounded-2xl transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-3xl bg-black/40 ${borderColors[index]}`}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg ${bgColors[index]} ${borderColors[index]} border`}>
                    <div className="text-3xl">{action.emoji}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-md ${bgColors[index]} ${borderColors[index]} border`}>
                    <Icon className={`w-7 h-7 ${colors[index]}`} />
                  </div>
                  <p className={`text-base font-bold text-white`}>{action.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission DARE - Dark Glassmorphism */}
      <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40">
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-vibrant-purple/20 flex items-center justify-center backdrop-blur-sm border border-vibrant-purple/30">
              <Target className="w-6 h-6 text-vibrant-purple" />
            </div>
            <span>Mission DARE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-5">
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-full bg-cyan text-white flex items-center justify-center font-black text-lg shadow-lg">D</div>
              <div>
                <p className="font-bold text-lg text-white">Diabetes Awareness</p>
                <p className="text-muted-foreground font-medium">Sensibilisation au diabète</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-full bg-electric-green text-white flex items-center justify-center font-black text-lg shadow-lg">A</div>
              <div>
                <p className="font-bold text-lg text-white">Routine</p>
                <p className="text-muted-foreground font-medium">Routines de soins quotidiennes</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 rounded-full bg-vibrant-purple text-white flex items-center justify-center font-black text-lg shadow-lg">R</div>
              <div>
                <p className="font-bold text-lg text-white">Empowerment</p>
                <p className="text-muted-foreground font-medium">Autonomisation et contrôle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Défis DARE Aujourd'hui - Dark Glassmorphism */}
      <Card className="border border-white/10 shadow-2xl rounded-2xl backdrop-blur-xl bg-black/40">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-medical-teal/20 flex items-center justify-center border border-medical-teal/30">
              <Target className="w-6 h-6 text-medical-teal" />
            </div>
            <span>Défis DARE Aujourd'hui</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg ${
                challenge.completed ? 'bg-lime-green' : 'bg-muted-foreground'
              }`}>
                {challenge.letter}
              </div>
              <span className={`flex-1 text-base font-medium ${challenge.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                {challenge.challenge}
              </span>
              {challenge.completed ? (
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-muted-foreground" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Cards - Dark Premium Design */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white">Forfaits DARE</h3>
        <div className="space-y-6">
          {/* Forfait Essentiel */}
          <Card className="border border-vibrant-orange/30 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 relative">
            <div className="absolute top-4 right-4 bg-vibrant-orange/20 text-vibrant-orange px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-vibrant-orange/30">💼 ESSENTIEL</div>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
                <span>Forfait Essentiel</span>
                <div className="text-right">
                  <div className="text-5xl font-black text-white">5 000</div>
                  <div className="text-base font-semibold text-vibrant-orange">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white">Suivi glycémie de base</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white">Rappels médicaments</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 opacity-50">
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-muted-foreground">Analyses avancées</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 opacity-50">
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-muted-foreground">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>

          {/* Forfait Premium */}
          <Card className="border border-vibrant-purple/30 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-black/40 relative">
            <div className="absolute top-4 right-4 bg-vibrant-purple/20 text-vibrant-purple px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-vibrant-purple/30">⭐ PREMIUM</div>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
                <span>Forfait Premium</span>
                <div className="text-right">
                  <div className="text-5xl font-black text-white">10 000</div>
                  <div className="text-base font-semibold text-vibrant-purple">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white">Suivi glycémie avancé</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white">Rappels intelligents</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white">Analyses et prédictions IA</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-8 h-8 rounded-full bg-lime-green flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;