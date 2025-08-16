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
      <div className="text-center space-y-4 pt-6">
        <h2 className="text-5xl font-black text-white tracking-wide drop-shadow-lg">Bonjour !</h2>
        <p className="text-xl text-white/90 font-light drop-shadow-md">Comment vous sentez-vous aujourd'hui ?</p>
      </div>

      {/* Current Glucose Reading - Glassmorphisme */}
      <Card className="border border-white/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
        <CardHeader className="text-center pb-6 pt-10">
          <CardTitle className="flex items-center justify-center space-x-4 text-white">
            <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-lg" style={{background: 'rgba(0, 206, 209, 0.3)'}}>
              <Activity className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white drop-shadow-lg">Glycémie Actuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-8 pb-10">
          <div className="space-y-6">
            <div className="text-9xl font-black text-white drop-shadow-2xl filter" style={{textShadow: '0 0 30px rgba(255,255,255,0.5)'}}>
              {currentGlucose}
            </div>
            <div className="text-3xl text-medical-teal font-bold drop-shadow-lg">mg/dL</div>
            <div className="inline-flex items-center space-x-3 px-8 py-4 rounded-full text-xl font-semibold text-white backdrop-blur-sm shadow-xl border border-white/40" style={{background: 'rgba(152, 251, 152, 0.3)'}}>
              <Activity className="w-6 h-6" />
              <span>Dans la normale</span>
            </div>
          </div>
          <div className="text-lg text-white/80 flex items-center justify-center space-x-3 font-medium drop-shadow-md">
            <Calendar className="w-6 h-6" />
            <span>Dernière mesure : Aujourd'hui 14:30</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid - Glassmorphisme */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white drop-shadow-lg">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const glassColors = [
              'rgba(135, 206, 235, 0.3)', // Sky blue
              'rgba(152, 251, 152, 0.3)', // Mint green  
              'rgba(221, 160, 221, 0.3)', // Plum
              'rgba(255, 182, 193, 0.3)'  // Light pink
            ];
            const iconColors = ['text-glass-blue', 'text-glass-mint', 'text-glass-purple', 'text-glass-orange'];
            return (
              <Card key={index} className="border border-white/30 backdrop-blur-xl shadow-2xl rounded-3xl transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-3xl" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg border border-white/40" style={{background: glassColors[index]}}>
                    <div className="text-3xl">{action.emoji}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-md border border-white/30" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                    <Icon className={`w-7 h-7 text-white`} />
                  </div>
                  <p className="text-base font-bold text-white drop-shadow-md">{action.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mission DARE - Glassmorphisme */}
      <Card className="border border-white/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3 drop-shadow-lg">
            <div className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-lg" style={{background: 'rgba(221, 160, 221, 0.3)'}}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <span>Mission DARE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-5">
            <div className="flex items-start space-x-4 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-black text-lg shadow-lg" style={{background: 'rgba(0, 206, 209, 0.6)'}}>D</div>
              <div>
                <p className="font-bold text-lg text-white drop-shadow-md">Diabetes Awareness</p>
                <p className="text-white/80 font-medium">Sensibilisation au diabète</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-black text-lg shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>A</div>
              <div>
                <p className="font-bold text-lg text-white drop-shadow-md">Routine</p>
                <p className="text-white/80 font-medium">Routines de soins quotidiennes</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-black text-lg shadow-lg" style={{background: 'rgba(221, 160, 221, 0.6)'}}>R</div>
              <div>
                <p className="font-bold text-lg text-white drop-shadow-md">Empowerment</p>
                <p className="text-white/80 font-medium">Autonomisation et contrôle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Défis DARE Aujourd'hui - Glassmorphisme */}
      <Card className="border border-white/30 shadow-2xl rounded-3xl backdrop-blur-xl" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3 drop-shadow-lg">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/40 shadow-lg" style={{background: 'rgba(0, 206, 209, 0.3)'}}>
              <Target className="w-6 h-6 text-white" />
            </div>
            <span>Défis DARE Aujourd'hui</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg ${
                challenge.completed ? 'bg-glass-mint' : 'bg-white/30'
              }`}>
                {challenge.letter}
              </div>
              <span className={`flex-1 text-base font-medium ${challenge.completed ? 'line-through text-white/60' : 'text-white'} drop-shadow-sm`}>
                {challenge.challenge}
              </span>
              {challenge.completed ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white/40" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pricing Cards - Glassmorphisme Premium */}
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-white drop-shadow-lg">Forfaits DARE</h3>
        <div className="space-y-6">
          {/* Forfait Essentiel */}
          <Card className="border border-white/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl relative" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/40 text-white shadow-lg" style={{background: 'rgba(255, 182, 193, 0.3)'}}>💼 ESSENTIEL</div>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl font-bold text-white flex items-center justify-between drop-shadow-lg">
                <span>Forfait Essentiel</span>
                <div className="text-right">
                  <div className="text-5xl font-black text-white drop-shadow-lg">5 000</div>
                  <div className="text-base font-semibold text-glass-orange">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-md" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white drop-shadow-sm">Suivi glycémie de base</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-md" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white drop-shadow-sm">Rappels médicaments</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-md opacity-50" style={{background: 'rgba(255, 255, 255, 0.1)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(255, 182, 193, 0.6)'}}>
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-white/60">Analyses avancées</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/10 shadow-md opacity-50" style={{background: 'rgba(255, 255, 255, 0.1)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(255, 182, 193, 0.6)'}}>
                  <X className="w-5 h-5 text-white" />
                </div>
                <span className="text-base text-white/60">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>

          {/* Forfait Premium */}
          <Card className="border border-white/30 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl relative" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/40 text-white shadow-lg" style={{background: 'rgba(221, 160, 221, 0.3)'}}>⭐ PREMIUM</div>
            <CardHeader className="pb-4 pt-6">
              <CardTitle className="text-xl font-bold text-white flex items-center justify-between drop-shadow-lg">
                <span>Forfait Premium</span>
                <div className="text-right">
                  <div className="text-5xl font-black text-white drop-shadow-lg">10 000</div>
                  <div className="text-base font-semibold text-glass-purple">F CFA/mois</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-md" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white drop-shadow-sm">Suivi glycémie avancé</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-md" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white drop-shadow-sm">Rappels intelligents</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-md" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white drop-shadow-sm">Analyses et prédictions IA</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-2xl backdrop-blur-sm border border-white/20 shadow-md" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{background: 'rgba(152, 251, 152, 0.6)'}}>
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-white drop-shadow-sm">Support médical 24/7</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;