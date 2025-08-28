import { useState, useEffect } from "react";
import { Pill, Clock, AlertTriangle, CheckCircle, Calculator, X, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

interface DosesScreenProps {
  glucoseValue: number;
  setGlucoseValue: (value: number) => void;
  carbValue: number;
  setCarbValue: (value: number) => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
}

const DosesScreen = ({ 
  glucoseValue, 
  setGlucoseValue, 
  carbValue, 
  setCarbValue, 
  showAlert, 
  setShowAlert 
}: DosesScreenProps) => {
  const [calculatedDose, setCalculatedDose] = useState({ correction: 0, meal: 0, total: 0 });
  const { toast } = useToast();
  const { t } = useTranslation();

  // Insulin calculation logic
  useEffect(() => {
    // Correction dose calculation (target: 120 mg/dL, sensitivity: 50 mg/dL per unit)
    const targetGlucose = 120;
    const sensitivity = 50;
    const correction = Math.max(0, Math.round((glucoseValue - targetGlucose) / sensitivity));
    
    // Meal dose calculation (carb ratio: 15g per unit)
    const carbRatio = 15;
    const meal = Math.round(carbValue / carbRatio);
    
    const total = correction + meal;
    
    setCalculatedDose({ correction, meal, total });
  }, [glucoseValue, carbValue]);

  const handleMarkInjected = (type: string) => {
    toast({
      title: t('doses.injectionMarked'),
      description: `${type} ${t('doses.injectionSuccess')}`,
    });
  };

  const historyData = [
    { day: 'L', percentage: 100, injections: 4 },
    { day: 'M', percentage: 75, injections: 3 },
    { day: 'M', percentage: 100, injections: 4 },
    { day: 'J', percentage: 50, injections: 2 },
    { day: 'V', percentage: 100, injections: 4 },
    { day: 'S', percentage: 75, injections: 3 },
    { day: 'D', percentage: 100, injections: 4 },
  ];

  const adherence = Math.round(historyData.reduce((acc, day) => acc + day.percentage, 0) / historyData.length);

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Pill className="w-6 h-6 text-medical-teal" />
          <span>{t('doses.title')}</span>
        </h2>
        <p className="text-muted-foreground">{t('doses.subtitle')}</p>
      </div>

      {/* Insulin Reminder Alert */}
      {showAlert && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-destructive font-medium">
              {t("reminder.writeup")}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAlert(false)}
              className="h-auto p-1 text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Lantus Card */}
      <Card className="border-l-4 border-l-medical-teal">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-medical-teal" />
              <span className="text-foreground">{t('doses.lantus')}</span>
            </div>
            <Badge className="bg-success text-success-foreground">
              <CheckCircle className="w-3 h-3 mr-1" />
              {t('doses.active')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('lantus.dose')}</p>
              <p className="text-lg font-semibold text-foreground">20 UI</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('lantus.time')}</p>
              <p className="text-lg font-semibold text-foreground">07:30</p>
            </div>
          </div>
          
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-sm text-success font-medium">
              {t('lantus.injection')}
            </p>
          </div>
          
          <Button 
            className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white transition-all hover:scale-105 transform duration-200"
            onClick={() => handleMarkInjected("Lantus 20UI")}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {t('lantus.button')}
          </Button>
        </CardContent>
      </Card>

      {/* Humalog Card with Calculator */}
      <Card className="border-medical-teal border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-medical-teal" />
              <span className="text-foreground">{t("humalog.title")}</span>
            </div>
            <Badge className="bg-warning text-warning-foreground">
              <Clock className="w-3 h-3 mr-1" />
             {t("humalog.pending")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Glucose Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("humalog.glucose")} (mg/dL)
            </label>
            <Input
              type="number"
              value={glucoseValue}
              onChange={(e) => setGlucoseValue(Number(e.target.value))}
              className="text-lg font-semibold text-center"
            />
          </div>

          {/* Carbs Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                {t("humalog.carbs")}
              </label>
              <span className="text-lg font-semibold text-medical-teal">
                {carbValue}g
              </span>
            </div>
            <Slider
              value={[carbValue]}
              onValueChange={(value) => setCarbValue(value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0g</span>
              <span>50g</span>
              <span>100g</span>
            </div>
          </div>

          {/* Calculated Dose */}
          <Card className="bg-medical-teal/10 border-medical-teal/30">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-medical-teal flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>{t("humalog.dose")}</span>
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold text-medical-teal">
                    {calculatedDose.correction}
                  </p>
                  <p className="text-xs text-muted-foreground">Correction</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-medical-teal">
                    {calculatedDose.meal}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("humalog.meal")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-medical-teal">
                    {calculatedDose.total}
                  </p>
                  <p className="text-xs text-muted-foreground">Total UI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-medical-teal hover:bg-medical-teal/90 text-white">
            <Clock className="w-4 h-4 mr-2" />
            {t("humalog.button")}
          </Button>
        </CardContent>
      </Card>

      {/* Missed Injection Card */}
      <Card className="border-l-4 border-l-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <span>{t("injection.title")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm font-medium text-destructive">
              {t("injection.time")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("injection.administer")}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1 border-muted-foreground text-muted-foreground hover:bg-muted"
            >
              {t("injection.button1")}
            </Button>
            <Button 
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
            >
              {t("injection.button2")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day History */}
      <Card className="border-medical-teal/20">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-medical-teal" />
              <span>{t("history.title")}</span>
            </div>
            <Badge className="bg-medical-teal text-white">
              {adherence}% observance
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end h-24 space-x-2">
            {historyData.map((day, index) => {
              const height = (day.percentage / 100) * 100;
              const color = day.percentage === 100 ? 'bg-success' : 
                           day.percentage >= 75 ? 'bg-warning' : 'bg-destructive';
              
              return (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="relative w-full bg-muted rounded">
                    <div 
                      className={`${color} rounded transition-all duration-300`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-muted-foreground">{day.day}</div>
                    <div className="text-xs text-muted-foreground">{day.injections}/4</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-4">
            {t("history.message")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DosesScreen;