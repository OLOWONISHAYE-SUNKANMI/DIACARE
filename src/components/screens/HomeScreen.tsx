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

      {/* Current Glucose Reading - Modern Gradient Card */}
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden" style={{background: 'var(--gradient-mint)'}}>
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="flex items-center justify-center space-x-3 text-medical-teal-dark">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">Glycémie Actuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 pb-8">
          <div className="space-y-4">
            <div className="text-8xl font-black text-medical-teal-dark drop-shadow-lg">
              {currentGlucose}
            </div>
            <div className="text-2xl text-medical-teal-dark/80 font-semibold">mg/dL</div>
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-semibold bg-white/40 text-medical-teal-dark backdrop-blur-sm shadow-lg">
              <Activity className="w-5 h-5" />
              <span>Dans la normale</span>
            </div>
          </div>
          <div className="text-base text-medical-teal-dark/70 flex items-center justify-center space-x-2 font-medium">
            <Calendar className="w-5 h-5" />
            <span>Dernière mesure : Aujourd'hui 14:30</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid - Modern Pastel */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-foreground">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const gradients = ['var(--gradient-rose)', 'var(--gradient-lavender)', 'var(--gradient-mint)', 'var(--gradient-peach)'];
            const textColors = ['text-pastel-rose-dark', 'text-pastel-lavender-dark', 'text-pastel-mint-dark', 'text-pastel-peach-dark'];
            return (
              <Card key={index} className="border-0 shadow-2xl rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-3xl" style={{background: gradients[index]}}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg">
                    <div className="text-3xl">{action.emoji}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-white/40 flex items-center justify-center mx-auto backdrop-blur-sm shadow-md`}>
                    <Icon className={`w-7 h-7 ${textColors[index]}`} />
                  </div>
                  <p className={`text-base font-bold ${textColors[index]}`}>{action.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission DARE - Modern Pastel */}
      <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden" style={{background: 'var(--gradient-lavender)'}}>
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-2xl font-bold text-pastel-lavender-dark flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
              <Target className="w-6 h-6" />
            </div>
            <span>Mission DARE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-5">
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-pastel-lavender-dark text-white flex items-center justify-center font-black text-lg shadow-lg">D</div>
              <div>
                <p className="font-bold text-lg text-pastel-lavender-dark">Diabetes Awareness</p>
                <p className="text-pastel-lavender-dark/70 font-medium">Sensibilisation au diabète</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-pastel-lavender-dark text-white flex items-center justify-center font-black text-lg shadow-lg">A</div>
              <div>
                <p className="font-bold text-lg text-pastel-lavender-dark">Routine</p>
                <p className="text-pastel-lavender-dark/70 font-medium">Routines de soins quotidiennes</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/30 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-pastel-lavender-dark text-white flex items-center justify-center font-black text-lg shadow-lg">R</div>
              <div>
                <p className="font-bold text-lg text-pastel-lavender-dark">Empowerment</p>
                <p className="text-pastel-lavender-dark/70 font-medium">Autonomisation et contrôle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Défis DARE Aujourd'hui - Modern */}
      <Card className="border-0 shadow-2xl rounded-3xl bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-medical-teal flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span>Défis DARE Aujourd'hui</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl bg-muted/30">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg ${
                challenge.completed ? 'bg-success' : 'bg-muted-foreground'
              }`}>
                {challenge.letter}
              </div>
              <span className={`flex-1 text-base font-medium ${challenge.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {challenge.challenge}
              </span>
              {challenge.completed ? (
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-muted-foreground" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Cards - Premium Modern Design */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-foreground">Forfaits DARE</h3>
        <div className="space-y-6">
          {/* Forfait Essentiel */}
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden" style={{background: 'var(--gradient-peach)'}}>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl font-bold text-pastel-peach-dark flex items-center justify-between">
                <span>Forfait Essentiel</span>
                <div className="text-right">
                  <div className="text-4xl font-black text-pastel-peach-dark">5 000</div>
                  <div className="text-sm font-semibold text-pastel-peach-dark/70">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-pastel-peach-dark">Suivi glycémie de base</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-pastel-peach-dark">Rappels médicaments</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/20 backdrop-blur-sm opacity-60">
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-pastel-peach-dark/60">Analyses avancées</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/20 backdrop-blur-sm opacity-60">
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-pastel-peach-dark/60">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>

          {/* Forfait Premium */}
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden relative" style={{background: 'var(--gradient-rose)'}}>
            <div className="absolute top-4 right-4 bg-white/90 text-pastel-rose-dark px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">⭐ POPULAIRE</div>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl font-bold text-pastel-rose-dark flex items-center justify-between">
                <span>Forfait Premium</span>
                <div className="text-right">
                  <div className="text-4xl font-black text-pastel-rose-dark">10 000</div>
                  <div className="text-sm font-semibold text-pastel-rose-dark/70">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-pastel-rose-dark">Suivi glycémie avancé</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-pastel-rose-dark">Rappels intelligents</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-pastel-rose-dark">Analyses et prédictions IA</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-pastel-rose-dark">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;