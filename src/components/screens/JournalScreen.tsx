
import { useState } from "react";
import { BookOpen, PenTool, AlertTriangle, CheckCircle, XCircle, TrendingUp, Clock, Syringe, X, Droplets, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import AddGlucoseModal from "@/components/modals/AddGlucoseModal";
import InsulinInjectionModal from "@/components/modals/InsulinInjectionModal";

interface JournalScreenProps {
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
}

const JournalScreen = ({ showAlert, setShowAlert }: JournalScreenProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
  const [isInsulinModalOpen, setIsInsulinModalOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleGlucoseEntry = (glucoseData: any) => {
    console.log("Nouvelle entrée glycémie:", glucoseData);
    toast({
      title: t('journal.glucose') + " " + t('common.save'),
      description: `${glucoseData.value} mg/dL - ${glucoseData.context}`,
    });
  };

  const handleInsulinEntry = (insulinData: any) => {
    console.log("Nouvelle injection insuline:", insulinData);
    toast({
      title: t('journal.insulin') + " " + t('common.save'),
      description: `${insulinData.insulinType} ${insulinData.dose}UI`,
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
      insulin: { type: "Humalog", dose: 8, injectionTime: "15h35", status: "injected" },
      context: "Après thiéboudienne"
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
      insulin: { type: "Lantus", dose: 20, injectionTime: "08h05", status: "injected" },
      context: "À jeun"
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
      insulin: { type: "Humalog", dose: 6, injectionTime: null, status: "missed" },
      context: "Avant dîner"
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
      insulin: { type: "Humalog", dose: 7, injectionTime: "12h20", status: "injected" },
      context: "Post-déjeuner"
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
      insulin: { type: "Humalog", dose: 5, injectionTime: "20h35", status: "injected" },
      context: "Après bissap sans sucre"
    }
  ];

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
          <BookOpen className="w-6 h-6 text-medical-teal" />
          <span>{t('journal.title')}</span>
        </h2>
        <p className="text-muted-foreground">{t('journal.subtitle')}</p>
      </div>

      {/* Rappel Insuline */}
      {showAlert && (
          <Alert className="border-red-200 bg-red-50 animate-scale-in">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 pr-8">
            <strong>{t('journal.insulinReminder')}</strong> - 19h00 Lantus 20UI
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

      {/* Boutons Nouvelles Entrées */}
      <div className="grid grid-cols-2 gap-3">
        <AddGlucoseModal onGlucoseAdd={handleGlucoseEntry}>
          <Button 
            className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white font-medium py-3 transition-all hover:scale-105 transform duration-200"
          >
            <Droplets className="w-5 h-5 mr-2" />
            {t('journal.glucose')}
          </Button>
        </AddGlucoseModal>

        <InsulinInjectionModal onInsulinAdd={handleInsulinEntry}>
          <Button 
            className="w-full bg-medical-blue hover:bg-medical-blue/90 text-white font-medium py-3 transition-all hover:scale-105 transform duration-200"
          >
            <Syringe className="w-5 h-5 mr-2" />
            {t('journal.insulin')}
          </Button>
        </InsulinInjectionModal>
      </div>

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
              {t('journal.filters.today')}
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="week" 
              className="data-[state=on]:bg-medical-teal data-[state=on]:text-white"
            >
              {t('journal.filters.week')}
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="month" 
              className="data-[state=on]:bg-medical-teal data-[state=on]:text-white"
            >
              {t('journal.filters.month')}
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>

      {/* Entrées du carnet */}
      <div className="space-y-4">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="border-medical-teal/20 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">{entry.date}</span>
                  <span className="text-muted-foreground">{entry.time}</span>
                  <Badge variant="secondary" className="text-xs">
                    {entry.context}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{entry.fullDate}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Glycémie avec context africain */}
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
                            ? `${t('journal.injected')} ${entry.insulin.injectionTime}`
                            : t('journal.missed')
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
            <span>{t('journal.weeklyStats.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-800 font-medium">{t('journal.weeklyStats.inTarget')}</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                68% (16/24)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-800 font-medium">{t('journal.weeklyStats.onTimeInjections')}</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                91% (21/23)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-purple-800 font-medium">{t('journal.weeklyStats.avgGlucose')}</span>
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
              <h4 className="font-semibold text-medical-teal mb-2">{t('journal.advice.title')}</h4>
              <p className="text-sm text-foreground/80">
                {t('journal.advice.example')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalScreen;
