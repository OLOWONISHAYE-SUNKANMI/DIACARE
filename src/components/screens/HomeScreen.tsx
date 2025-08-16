import { Activity, TrendingUp, Calendar, AlertCircle, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomeScreen = () => {
  const currentGlucose = 126; // mg/dL
  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: "low", color: "glucose-low", message: "Glycémie basse" };
    if (value <= 180) return { status: "normal", color: "glucose-normal", message: "Glycémie normale" };
    return { status: "high", color: "glucose-high", message: "Glycémie élevée" };
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      {/* Welcome Message */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Bonjour !</h2>
        <p className="text-muted-foreground">Comment vous sentez-vous aujourd'hui ?</p>
      </div>

      {/* Current Glucose Reading */}
      <Card className="bg-gradient-to-br from-card to-accent/20 border-2 border-medical-teal/20">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center space-x-2 text-foreground">
            <Activity className="w-5 h-5 text-medical-teal" />
            <span>Glycémie Actuelle</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className={`text-5xl font-bold text-${glucoseStatus.color}`}>
              {currentGlucose}
            </div>
            <div className="text-sm text-muted-foreground">mg/dL</div>
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-${glucoseStatus.color}/10 text-${glucoseStatus.color}`}>
              {glucoseStatus.status === "high" && <TrendingUp className="w-4 h-4" />}
              {glucoseStatus.status === "low" && <AlertCircle className="w-4 h-4" />}
              {glucoseStatus.status === "normal" && <Activity className="w-4 h-4" />}
              <span>{glucoseStatus.message}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center justify-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Dernière mesure : Aujourd'hui 14:30</span>
          </div>
        </CardContent>
      </Card>

      {/* Mission DARE */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Mission DARE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-medical-teal">Diabetes Awareness</strong> : Comprendre votre diabète
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-medical-teal">Routine</strong> : Établir des habitudes saines
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-medical-teal">Empowerment</strong> : Prendre le contrôle de votre santé
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center space-y-2">
            <Activity className="w-8 h-8 text-medical-teal mx-auto" />
            <p className="text-sm font-medium">Mesurer</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center space-y-2">
            <Pill className="w-8 h-8 text-medical-teal mx-auto" />
            <p className="text-sm font-medium">Insuline</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;