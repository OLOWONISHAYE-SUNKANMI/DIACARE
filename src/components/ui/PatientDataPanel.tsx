interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  diabetesType: number;
  location: string;
}

interface PatientDataPanelProps {
  patient: PatientData;
}

const PatientDataPanel = ({ patient }: PatientDataPanelProps) => {
  return (
    <div className="p-4">
      {/* En-tête patient */}
      <div className="bg-muted p-4 rounded-lg mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{patient.firstName} {patient.lastName}</h3>
            <p className="text-muted-foreground text-sm">{patient.age} ans • {patient.location}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Type diabète:</span>
            <p className="font-medium">Type {patient.diabetesType}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Dernière glycémie:</span>
            <p className="font-medium text-primary">1.2 g/L</p>
          </div>
        </div>
      </div>

      {/* Données récentes */}
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            📊 Données récentes
          </h4>
          <div className="space-y-2">
            <div className="bg-card p-3 rounded border">
              <div className="flex justify-between items-center">
                <span className="text-sm">Glycémie moyenne (7j)</span>
                <span className="font-medium">1.15 g/L</span>
              </div>
            </div>
            <div className="bg-card p-3 rounded border">
              <div className="flex justify-between items-center">
                <span className="text-sm">Temps dans la cible</span>
                <span className="font-medium text-primary">78%</span>
              </div>
            </div>
            <div className="bg-card p-3 rounded border">
              <div className="flex justify-between items-center">
                <span className="text-sm">HbA1c (estimation)</span>
                <span className="font-medium">6.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Médicaments */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            💊 Médicaments actuels
          </h4>
          <div className="space-y-2">
            <div className="bg-card p-3 rounded border">
              <p className="font-medium">Metformine 850mg</p>
              <p className="text-sm text-muted-foreground">2x/jour - Matin et soir</p>
            </div>
            <div className="bg-card p-3 rounded border">
              <p className="font-medium">Insuline lente</p>
              <p className="text-sm text-muted-foreground">20 UI - Avant coucher</p>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            📋 Dernières consultations
          </h4>
          <div className="space-y-2">
            <div className="bg-card p-3 rounded border">
              <p className="font-medium text-sm">15 Jan 2024</p>
              <p className="text-xs text-muted-foreground">Ajustement dosage insuline</p>
            </div>
            <div className="bg-card p-3 rounded border">
              <p className="font-medium text-sm">28 Déc 2023</p>
              <p className="text-xs text-muted-foreground">Consultation de routine</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDataPanel;