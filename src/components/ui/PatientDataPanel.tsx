import { Button } from '@/components/ui/button';

interface GlucoseReading {
  time: string;
  value: number;
}

interface Medication {
  name: string;
  dose: string;
}

interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  diabetesType: number;
  location: string;
  diagnosisDate: string;
  lastHbA1c: number;
  recentGlucose: GlucoseReading[];
  medications: Medication[];
  alerts: string[];
}

interface PatientDataPanelProps {
  patient: PatientData;
}

const PatientDataPanel = ({ patient }: PatientDataPanelProps) => (
  <div className="p-4 space-y-4">
    {/* Infos patient */}
    <div className="bg-primary/10 p-4 rounded-lg">
      <h4 className="font-bold text-primary mb-2">👤 Informations Patient</h4>
      <div className="space-y-1 text-sm">
        <p><strong>Âge:</strong> {patient.age} ans</p>
        <p><strong>Type:</strong> Diabète Type {patient.diabetesType}</p>
        <p><strong>Diagnostic:</strong> {patient.diagnosisDate}</p>
        <p><strong>HbA1c:</strong> {patient.lastHbA1c}% (objectif &lt;7%)</p>
      </div>
    </div>
    
    {/* Glycémies récentes */}
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <h4 className="font-bold text-green-800 mb-2">📊 Glycémies Récentes</h4>
      <div className="space-y-2">
        {patient.recentGlucose.map((reading, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{reading.time}</span>
            <span className={`font-bold ${
              reading.value < 70 ? 'text-destructive' :
              reading.value > 180 ? 'text-destructive' :
              'text-green-600'
            }`}>
              {reading.value} mg/dL
            </span>
          </div>
        ))}
      </div>
    </div>
    
    {/* Traitement actuel */}
    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
      <h4 className="font-bold text-purple-800 mb-2">💊 Traitement</h4>
      <div className="space-y-1 text-sm">
        {patient.medications.map((med, idx) => (
          <p key={idx} className="text-foreground">{med.name} - {med.dose}</p>
        ))}
      </div>
    </div>
    
    {/* Alertes/Problèmes */}
    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
      <h4 className="font-bold text-destructive mb-2">⚠️ Alertes</h4>
      <div className="space-y-1 text-sm">
        {patient.alerts.map((alert, idx) => (
          <p key={idx} className="text-destructive">{alert}</p>
        ))}
      </div>
    </div>
    
    {/* Actions rapides */}
    <div className="space-y-2">
      <Button className="w-full" variant="outline" size="sm">
        📈 Voir graphiques complets
      </Button>
      <Button className="w-full" variant="outline" size="sm">
        📋 Historique consultations
      </Button>
      <Button className="w-full" variant="outline" size="sm">
        💉 Ajuster doses insuline
      </Button>
    </div>
  </div>
);

export default PatientDataPanel;