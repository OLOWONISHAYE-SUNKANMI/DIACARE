import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Activity, Heart, TrendingUp, Calendar, Clock } from 'lucide-react';

interface PatientDataTabsProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    diabetesType: string;
    patientCode: string;
    lastGlucose?: number;
    dataAccess: {
      allowedSections: string[];
      consultationsRemaining: number;
      expiresAt: string;
    };
  };
}

export const PatientDataTabs: React.FC<PatientDataTabsProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: '📊 Vue d\'ensemble', icon: '📊' },
    { id: 'glucose', name: '🩸 Glycémies', icon: '🩸' },
    { id: 'medications', name: '💊 Médicaments', icon: '💊' },
    { id: 'meals', name: '🍽️ Nutrition', icon: '🍽️' },
    { id: 'activities', name: '🏃 Activités', icon: '🏃' },
    { id: 'history', name: '📋 Historique', icon: '📋' }
  ];

  const canAccessSection = (section: string) => {
    return patient.dataAccess.allowedSections.includes(section);
  };

  return (
    <div>
      {/* Navigation onglets */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Contenu onglets */}
      <div className="min-h-96">
        {activeTab === 'overview' && <OverviewTab patient={patient} />}
        {activeTab === 'glucose' && <GlucoseTab patient={patient} canAccess={canAccessSection('glucose')} />}
        {activeTab === 'medications' && <MedicationsTab patient={patient} canAccess={canAccessSection('medications')} />}
        {activeTab === 'meals' && <MealsTab patient={patient} canAccess={canAccessSection('meals')} />}
        {activeTab === 'activities' && <ActivitiesTab patient={patient} canAccess={canAccessSection('activities')} />}
        {activeTab === 'history' && <HistoryTab patient={patient} />}
      </div>
    </div>
  );
};

// Composant Section verrouillée
const SectionLocked = ({ section }: { section: string }) => (
  <Card>
    <CardContent className="text-center py-12">
      <div className="text-6xl mb-4">🔒</div>
      <h3 className="text-lg font-semibold mb-2">Section non accessible</h3>
      <p className="text-muted-foreground">
        Vous n'avez pas l'autorisation d'accéder aux données de {section}.
      </p>
    </CardContent>
  </Card>
);

// Onglet Vue d'ensemble
const OverviewTab: React.FC<{ patient: any }> = ({ patient }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Dernière glycémie */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dernière Glycémie</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{patient.lastGlucose || '--'} mg/dL</div>
          <p className="text-xs text-muted-foreground">
            {patient.lastGlucose && patient.lastGlucose > 140 ? 'Élevée' : 'Normale'}
          </p>
        </CardContent>
      </Card>

      {/* HbA1c estimée */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">HbA1c Estimée</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7.2%</div>
          <p className="text-xs text-muted-foreground">Objectif: {'<'}7%</p>
        </CardContent>
      </Card>

      {/* Temps dans la cible */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temps dans la cible</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">68%</div>
          <Progress value={68} className="mt-2" />
        </CardContent>
      </Card>
    </div>

    {/* Résumé des 7 derniers jours */}
    <Card>
      <CardHeader>
        <CardTitle>📈 Résumé des 7 derniers jours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold">156 mg/dL</div>
            <div className="text-sm text-muted-foreground">Moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">42</div>
            <div className="text-sm text-muted-foreground">Mesures</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">15%</div>
            <div className="text-sm text-muted-foreground">Variabilité</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">3</div>
            <div className="text-sm text-muted-foreground">Hypoglycémies</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Onglet Glycémies
const GlucoseTab: React.FC<{ patient: any; canAccess: boolean }> = ({ patient, canAccess }) => {
  if (!canAccess) return <SectionLocked section="glycémie" />;

  const glucoseData = [
    { value: 142, time: '08:30', context: 'Jeûne', trend: 'stable' },
    { value: 180, time: '12:45', context: 'Post-repas', trend: 'up' },
    { value: 125, time: '16:20', context: 'Collation', trend: 'down' },
    { value: 158, time: '20:15', context: 'Après dîner', trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🩸 Données Glycémiques - Aujourd'hui
            <Badge variant={patient.lastGlucose && patient.lastGlucose > 140 ? "destructive" : "secondary"}>
              Dernière: {patient.lastGlucose || '--'} mg/dL
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {glucoseData.map((reading, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-mono font-bold text-primary">
                    {reading.value}
                  </div>
                  <div className="text-sm text-muted-foreground">mg/dL</div>
                  <div className="text-lg">
                    {reading.trend === 'up' && '↗️'}
                    {reading.trend === 'down' && '↘️'}
                    {reading.trend === 'stable' && '➡️'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{reading.time}</div>
                  <div className="text-sm text-muted-foreground">{reading.context}</div>
                </div>
                <Badge variant={reading.value > 180 ? "destructive" : reading.value < 70 ? "destructive" : "secondary"}>
                  {reading.value > 180 ? 'Élevé' : reading.value < 70 ? 'Bas' : 'Normal'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Onglet Médicaments
const MedicationsTab: React.FC<{ patient: any; canAccess: boolean }> = ({ patient, canAccess }) => {
  if (!canAccess) return <SectionLocked section="médicaments" />;

  const medications = [
    { name: 'Metformine', dosage: '500mg', frequency: '2x/jour', time: 'Matin/Soir', adherence: 95 },
    { name: 'Insuline Lantus', dosage: '12 UI', frequency: '1x/jour', time: 'Soir', adherence: 88 },
    { name: 'Humalog', dosage: '4-6 UI', frequency: 'Avant repas', time: 'Variable', adherence: 92 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💊 Médications Actuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-bold text-lg">{med.name}</div>
                  <div className="text-muted-foreground">{med.dosage} • {med.frequency}</div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Observance:</span>
                      <Progress value={med.adherence} className="flex-1" />
                      <span className="text-sm font-medium">{med.adherence}%</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{med.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Onglet Nutrition
const MealsTab: React.FC<{ patient: any; canAccess: boolean }> = ({ patient, canAccess }) => {
  if (!canAccess) return <SectionLocked section="nutrition" />;

  const meals = [
    { time: '07:30', meal: 'Petit-déjeuner', carbs: 45, calories: 380, photo: '🥐' },
    { time: '12:30', meal: 'Déjeuner', carbs: 60, calories: 520, photo: '🍽️' },
    { time: '19:00', meal: 'Dîner', carbs: 55, calories: 450, photo: '🍛' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🍽️ Repas et Nutrition - Aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{meal.photo}</div>
                  <div>
                    <div className="font-bold">{meal.meal}</div>
                    <div className="text-muted-foreground">{meal.time}</div>
                  </div>
                </div>
                <div className="text-right space-x-2">
                  <Badge variant="secondary">{meal.carbs}g glucides</Badge>
                  <Badge variant="outline">{meal.calories} kcal</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium mb-2">📊 Bilan journalier</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Glucides totaux:</span> 160g
              </div>
              <div>
                <span className="font-medium">Calories totales:</span> 1350 kcal
              </div>
              <div>
                <span className="font-medium">Index glycémique moyen:</span> Modéré
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Onglet Activités
const ActivitiesTab: React.FC<{ patient: any; canAccess: boolean }> = ({ patient, canAccess }) => {
  if (!canAccess) return <SectionLocked section="activités" />;

  const activities = [
    { time: '06:30', activity: 'Marche', duration: 30, intensity: 'Modérée', calories: 120 },
    { time: '18:00', activity: 'Vélo', duration: 45, intensity: 'Élevée', calories: 280 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Activités Physiques - Aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">{activity.activity}</div>
                    <div className="text-muted-foreground">{activity.time} • {activity.duration} min</div>
                  </div>
                </div>
                <div className="text-right space-x-2">
                  <Badge variant={activity.intensity === 'Élevée' ? 'default' : 'secondary'}>
                    {activity.intensity}
                  </Badge>
                  <Badge variant="outline">{activity.calories} kcal</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">📊 Résumé</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Temps total:</span> 75 minutes
              </div>
              <div>
                <span className="font-medium">Calories brûlées:</span> 400 kcal
              </div>
              <div>
                <span className="font-medium">Objectif hebdo:</span> 150 min
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Onglet Historique
const HistoryTab: React.FC<{ patient: any }> = ({ patient }) => {
  const consultations = [
    { date: '2024-01-15', doctor: 'Dr. Martin', type: 'Consultation', notes: 'Ajustement insuline' },
    { date: '2024-01-10', doctor: 'Dr. Dubois', type: 'Téléconsultation', notes: 'Suivi glycémies' },
    { date: '2024-01-05', doctor: 'Dr. Martin', type: 'Consultation', notes: 'Contrôle trimestriel' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des Consultations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultations.map((consultation, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{consultation.type}</div>
                    <div className="text-sm text-muted-foreground">{consultation.doctor}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{new Date(consultation.date).toLocaleDateString('fr-FR')}</div>
                  <div className="text-sm text-muted-foreground">{consultation.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};