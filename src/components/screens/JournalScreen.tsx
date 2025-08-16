
import { useState } from "react";
import { BookOpen, PenTool, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock, Syringe, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";

interface JournalScreenProps {
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
}

const JournalScreen = ({ showAlert, setShowAlert }: JournalScreenProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const { toast } = useToast();

  const handleNewEntry = () => {
    toast({
      title: "Nouvelle entrée",
      description: "Redirection vers le formulaire de saisie",
    });
  };

  const journalEntries = [
    {
      id: 1,
      date: "Vendredi",
      time: "15h30",
      fullDate: "15 Nov 2024",
      glucose: 142,
      glucoseStatus: "Légèrement élevé",
      glucoseColor: "text-amber-600",
      glucoseBg: "bg-amber-50",
      insulin: { type: "Humalog", dose: 8, injectionTime: "15h35", status: "injected" }
    },
    {
      id: 2,
      date: "Vendredi",
      time: "08h00",
      fullDate: "15 Nov 2024",
      glucose: 118,
      glucoseStatus: "Dans la cible",
      glucoseColor: "text-emerald-600",
      glucoseBg: "bg-emerald-50",
      insulin: { type: "Lantus", dose: 20, injectionTime: "08h05", status: "injected" }
    },
    {
      id: 3,
      date: "Jeudi",
      time: "18h45",
      fullDate: "14 Nov 2024",
      glucose: 156,
      glucoseStatus: "Élevé",
      glucoseColor: "text-red-600",
      glucoseBg: "bg-red-50",
      insulin: { type: "Humalog", dose: 6, injectionTime: null, status: "missed" }
    },
    {
      id: 4,
      date: "Jeudi",
      time: "12h15",
      fullDate: "14 Nov 2024",
      glucose: 98,
      glucoseStatus: "Dans la cible",
      glucoseColor: "text-emerald-600",
      glucoseBg: "bg-emerald-50",
      insulin: { type: "Humalog", dose: 7, injectionTime: "12h20", status: "injected" }
    },
    {
      id: 5,
      date: "Mercredi",
      time: "20h30",
      fullDate: "13 Nov 2024",
      glucose: 88,
      glucoseStatus: "Dans la cible",
      glucoseColor: "text-emerald-600",
      glucoseBg: "bg-emerald-50",
      insulin: { type: "Humalog", dose: 5, injectionTime: "20h35", status: "injected" }
    }
  ];

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
          <BookOpen className="w-6 h-6 text-medical-teal" />
          <span>Carnet</span>
        </h2>
        <p className="text-muted-foreground">Suivi détaillé de vos glycémies et injections</p>
      </div>

      {/* Rappel Insuline */}
      {showAlert && (
        <Alert className="border-red-200 bg-red-50 animate-scale-in">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 pr-8">
            <strong>Rappel Insuline</strong> - 19h00 Lantus 20UI
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:bg-red-100"
            onClick={() => setShowAlert(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Bouton Nouvelle Entrée */}
      <Button 
        className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white font-medium py-3 transition-all hover:scale-105 transform duration-200"
        onClick={handleNewEntry}
      >
        <PenTool className="w-5 h-5 mr-2" />
        📝 Nouvelle entrée glycémie/insuline
      </Button>

      {/* Filtres de période */}
      <Card className="border-medical-teal/20">
        <CardContent className="p-4">
          <ToggleGroup 
            type="single" 
            value={selectedPeriod} 
            onValueChange={setSelectedPeriod}
            className="grid grid-cols-3 gap-2"
          >
            <ToggleGroupItem 
              value="today" 
              className="data-[state=on]:bg-medical-teal data-[state=on]:text-white"
            >
              Aujourd'hui
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="week" 
              className="data-[state=on]:bg-medical-teal data-[state=on]:text-white"
            >
              7 jours
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="month" 
              className="data-[state=on]:bg-medical-teal data-[state=on]:text-white"
            >
              30 jours
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* Entrées du carnet */}
      <div className="space-y-4">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="border-medical-teal/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">{entry.date}</span>
                  <span className="text-muted-foreground">{entry.time}</span>
                </div>
                <span className="text-sm text-muted-foreground">{entry.fullDate}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Glycémie */}
              <div className={`p-4 rounded-lg ${entry.glucoseBg} border border-opacity-20`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {entry.glucose} <span className="text-lg font-normal text-muted-foreground">mg/dL</span>
                    </div>
                    <div className={`text-sm font-medium ${entry.glucoseColor}`}>
                      {entry.glucoseStatus}
                    </div>
                  </div>
                  <TrendingUp className={`w-6 h-6 ${entry.glucoseColor}`} />
                </div>
              </div>

              {/* Détails Insuline */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Syringe className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">
                        {entry.insulin.type} {entry.insulin.dose}UI
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {entry.insulin.status === "injected" 
                            ? `Injecté à ${entry.insulin.injectionTime}`
                            : "Injection manquée"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {entry.insulin.status === "injected" ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Résumé hebdomadaire */}
      <Card className="border-medical-teal/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-medical-teal" />
            <span>Résumé hebdomadaire</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium">Dans la cible</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                68% (16/24)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium">Injections à temps</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                91% (21/23)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-800 font-medium">Moyenne glycémique</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                132 mg/dL
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conseil DARE personnalisé */}
      <Card className="border-medical-teal bg-gradient-to-r from-medical-teal/5 to-medical-teal/10">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-medical-teal rounded-full p-2 flex-shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-medical-teal mb-2">💡 Conseil DARE personnalisé</h4>
              <p className="text-sm text-foreground/80">
                Excellente adherence cette semaine ! Vos glycémies en fin d'après-midi sont légèrement élevées. 
                Considérez ajuster votre collation de 15h ou anticiper votre injection de Humalog de 10 minutes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalScreen;
