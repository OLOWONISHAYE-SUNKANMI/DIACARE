import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Key, 
  Copy, 
  Shield, 
  Eye, 
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProfessionalCode {
  code: string;
  generated_at: string;
  specialty: string;
  is_active: boolean;
}

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  diabetes_type: string;
  glucose_readings: Array<{
    value: number;
    measured_at: string;
    meal_context: string;
  }>;
}

const ProfessionalCodeManager = () => {
  const [professionalCode, setProfessionalCode] = useState<ProfessionalCode | null>(null);
  const [patientAccessCode, setPatientAccessCode] = useState('');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);
  const [showPatientData, setShowPatientData] = useState(false);
  const { toast } = useToast();

  const generateProfessionalCode = async () => {
    setIsGenerating(true);
    try {
      // Simulation de l'appel à l'edge function
      const mockCode: ProfessionalCode = {
        code: `DARE-END-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        generated_at: new Date().toISOString(),
        specialty: 'endocrinologue',
        is_active: true
      };
      
      setProfessionalCode(mockCode);
      
      toast({
        title: "Code généré avec succès",
        description: "Votre code d'identification professionnel est prêt",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le code professionnel",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (professionalCode) {
      navigator.clipboard.writeText(professionalCode.code);
      toast({
        title: "Code copié",
        description: "Le code a été copié dans le presse-papiers",
      });
    }
  };

  const accessPatientData = async () => {
    if (!patientAccessCode.trim()) {
      toast({
        title: "Code manquant",
        description: "Veuillez saisir un code d'accès patient",
        variant: "destructive"
      });
      return;
    }

    setIsAccessing(true);
    try {
      // Simulation de l'accès aux données patient
      const mockPatientData: PatientData = {
        id: patientAccessCode,
        first_name: "Marie",
        last_name: "Dupont",
        diabetes_type: "Type 2",
        glucose_readings: [
          { value: 142, measured_at: "2024-01-15T08:30:00Z", meal_context: "À jeun" },
          { value: 180, measured_at: "2024-01-15T12:30:00Z", meal_context: "Après repas" },
          { value: 138, measured_at: "2024-01-15T18:00:00Z", meal_context: "Avant dîner" }
        ]
      };
      
      setPatientData(mockPatientData);
      setShowPatientData(true);
      
      toast({
        title: "Accès autorisé",
        description: "Données patient récupérées avec succès",
      });
    } catch (error) {
      toast({
        title: "Accès refusé",
        description: "Code d'accès invalide ou patient introuvable",
        variant: "destructive"
      });
    } finally {
      setIsAccessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Génération du code professionnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Code d'identification professionnel
          </CardTitle>
          <CardDescription>
            Générez votre code unique pour accéder aux données patients DARE
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!professionalCode ? (
            <Button 
              onClick={generateProfessionalCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              Générer mon code professionnel
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-lg font-semibold">{professionalCode.code}</p>
                    <p className="text-sm text-muted-foreground">
                      Généré le {new Date(professionalCode.generated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Actif
                    </Badge>
                    <Button size="sm" variant="outline" onClick={copyCodeToClipboard}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-amber-50 p-3 rounded border border-amber-200">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                <strong>Important :</strong> Ce code est personnel et confidentiel. Ne le partagez jamais. 
                Il vous permet d'accéder aux données sensibles des patients.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accès aux données patient */}
      {professionalCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Accès données patient
            </CardTitle>
            <CardDescription>
              Utilisez votre code professionnel pour accéder aux données d'un patient
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="patientCode">Code d'accès patient</Label>
              <div className="flex space-x-2">
                <Input
                  id="patientCode"
                  placeholder="Saisissez le code patient..."
                  value={patientAccessCode}
                  onChange={(e) => setPatientAccessCode(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={accessPatientData}
                  disabled={isAccessing}
                >
                  {isAccessing ? (
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Tous les accès sont tracés et sécurisés</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modale données patient */}
      <Dialog open={showPatientData} onOpenChange={setShowPatientData}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Données Patient - Accès Sécurisé</DialogTitle>
            <DialogDescription>
              Informations médicales sensibles - Usage strictement professionnel
            </DialogDescription>
          </DialogHeader>

          {patientData && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800">Informations Patient</h3>
                <p><strong>Nom :</strong> {patientData.last_name}</p>
                <p><strong>Prénom :</strong> {patientData.first_name}</p>
                <p><strong>Type de diabète :</strong> {patientData.diabetes_type}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Relevés glycémiques récents</h3>
                <div className="space-y-2">
                  {patientData.glucose_readings.map((reading, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>{new Date(reading.measured_at).toLocaleDateString()} - {reading.meal_context}</span>
                      <Badge variant={reading.value > 140 ? "destructive" : "secondary"}>
                        {reading.value} mg/dL
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded border border-red-200 text-xs text-red-700">
                <strong>Confidentialité :</strong> Ces données sont strictement confidentielles et protégées par le secret médical.
                Toute utilisation non autorisée est passible de sanctions.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalCodeManager;