import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  Activity,
  Heart,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

export const PatientDataTabs: React.FC<PatientDataTabsProps> = ({
  patient,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: t('patientDataTabs.tabs.overview'), icon: '📊' },
    { id: 'glucose', name: t('patientDataTabs.tabs.glucose'), icon: '🩸' },
    {
      id: 'medications',
      name: t('patientDataTabs.tabs.medications'),
      icon: '💊',
    },
    { id: 'meals', name: t('patientDataTabs.tabs.meals'), icon: '🍽️' },
    {
      id: 'activities',
      name: t('patientDataTabs.tabs.activities'),
      icon: '🏃',
    },
    { id: 'history', name: t('patientDataTabs.tabs.history'), icon: '📋' },
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
        {activeTab === 'glucose' && (
          <GlucoseTab
            patient={patient}
            canAccess={canAccessSection('glucose')}
          />
        )}
        {activeTab === 'medications' && (
          <MedicationsTab
            patient={patient}
            canAccess={canAccessSection('medications')}
          />
        )}
        {activeTab === 'meals' && (
          <MealsTab patient={patient} canAccess={canAccessSection('meals')} />
        )}
        {activeTab === 'activities' && (
          <ActivitiesTab
            patient={patient}
            canAccess={canAccessSection('activities')}
          />
        )}
        {activeTab === 'history' && <HistoryTab patient={patient} />}
      </div>
    </div>
  );
};

const { t } = useTranslation();
// Composant Section verrouillée
const SectionLocked = ({ section }: { section: string }) => (
  <Card>
    <CardContent className="text-center py-12">
      <div className="text-6xl mb-4">🔒</div>
      <h3 className="text-lg font-semibold mb-2">
        {t('patientDataTabs.access.sectionNotAccessibleTitle')}
      </h3>
      <p className="text-muted-foreground">
        {t('patientDataTabs.access.sectionNotAccessibleDesc', { section })}
      </p>
    </CardContent>
  </Card>
);

// Onglet Vue d'ensemble
const OverviewTab: React.FC<{ patient: any }> = ({ patient }) => {
  // Mock data pour la démonstration
  const mockPatient = {
    currentHbA1c: patient.currentHbA1c || 7.2,
    timeInRange: patient.timeInRange || 68,
    medications: patient.medications || [
      { name: t('patientDataTabs.medications.metformin'), dose: '500mg 2x/j' },
      { name: t('patientDataTabs.medications.lantus'), dose: '12 UI/soir' },
      { name: t('patientDataTabs.medications.humalog'), dose: '4-6 UI/repas' },
    ],
    activeAlerts: patient.activeAlerts || [
      t('patientDataTabs.alerts.hba1cAboveTarget'),
      t('patientDataTabs.alerts.threeHypoglycemiasWeek'),
      t('patientDataTabs.alerts.followUpAppointment'),
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Métriques clés */}
      <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
        <h4 className="font-bold text-destructive mb-2">
          🩸 {t('patientDataTabs.glycemicControl.title')}
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('patientDataTabs.glycemicControl.currentHbA1c')}:</span>
            <span className="font-bold text-destructive">
              {mockPatient.currentHbA1c}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('patientDataTabs.glycemicControl.target')}:</span>
            <span className="text-green-600">&lt;7%</span>
          </div>
          <div className="flex justify-between">
            <span>{t('patientDataTabs.glycemicControl.timeInRange')}:</span>
            <span className="font-bold">{mockPatient.timeInRange}%</span>
          </div>
          <div className="mt-3">
            <Progress value={mockPatient.timeInRange} className="h-2" />
          </div>
        </div>
      </div>

      {/* Traitement actuel */}
      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
        <h4 className="font-bold text-primary mb-2">
          💊 {t('patientDataTabs.treatment.title')}
        </h4>
        <div className="space-y-1 text-sm">
          {mockPatient.medications.map((med, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{med.name}:</span>
              <span className="font-bold">{med.dose}</span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Badge variant="secondary" className="text-xs">
            {mockPatient.medications.length}{' '}
            {t('patientDataTabs.treatment.activeMedications')}
          </Badge>
        </div>
      </div>

      {/* Alertes */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <h4 className="font-bold text-orange-800 mb-2">
          ⚠️ {t('patientDataTabs.alerts.title')}
        </h4>
        <div className="space-y-1 text-sm">
          {mockPatient.activeAlerts.map((alert, idx) => (
            <div key={idx} className="text-orange-700 flex items-start gap-1">
              <span className="text-orange-500 mt-1">•</span>
              <span>{alert}</span>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Badge
            variant="outline"
            className="text-xs border-orange-300 text-orange-700"
          >
            {mockPatient.activeAlerts.length}{' '}
            {t('patientDataTabs.alerts.count')}
          </Badge>
        </div>
      </div>

      {/* Dernières glycémies */}
      <div className="bg-muted/50 p-4 rounded-lg border">
        <h4 className="font-bold mb-3">
          🩸 {t('patientDataTabs.latestMeasures.title')}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {t('patientDataTabs.latestMeasures.current')}:
            </span>
            <Badge
              variant={patient.lastGlucose > 140 ? 'destructive' : 'secondary'}
            >
              {patient.lastGlucose || 142} mg/dL
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {t('patientDataTabs.latestMeasures.sevenDayAvg')}:
            </span>
            <span className="font-medium">156 mg/dL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">
              {t('patientDataTabs.latestMeasures.variability')}:
            </span>
            <span className="font-medium">15% CV</span>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-bold text-green-800 mb-2">
          🏃 {t('patientDataTabs.activity.title')}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('patientDataTabs.activity.today')}:</span>
            <span className="font-bold">75 min</span>
          </div>
          <div className="flex justify-between">
            <span>{t('patientDataTabs.activity.thisWeek')}:</span>
            <span className="font-bold">4h 30min</span>
          </div>
          <div className="flex justify-between">
            <span>{t('patientDataTabs.activity.target')}:</span>
            <span className="text-green-600">150 min/sem</span>
          </div>
        </div>
        <div className="mt-3">
          <Progress value={75} className="h-2" />
          <p className="text-xs text-green-600 mt-1">
            {t('patientDataTabs.activity.progress', { percent: 75 })}
          </p>
        </div>
      </div>

      {/* Nutrition */}
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-bold text-purple-800 mb-2">
          🍽️ {t('patientDataTabs.nutrition.title')}
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('patientDataTabs.nutrition.carbsToday')}:</span>
            <span className="font-bold">160g</span>
          </div>
          <div className="flex justify-between">
            <span>{t('patientDataTabs.nutrition.mealsLogged')}:</span>
            <span className="font-bold">3/3</span>
          </div>
          <div className="flex justify-between">
            <span>{t('nutrition.avgGI')}:</span>
            <span className="font-bold">
              {t('patientDataTabs.nutrition.giModerate')}
            </span>
          </div>
        </div>
      </div>

      {/* Graphique glycémie récente */}
      <div className="col-span-full bg-muted/30 p-6 rounded-lg border">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          📈 {t('patientDataTabs.charts.sevenDayGlucose')}
        </h4>
        <div className="h-48 bg-background rounded border flex items-center justify-center border-dashed">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{t('patientDataTabs.charts.patientGlucoseGraph')}</p>
            <p className="text-sm">{t('charts.last7DaysData')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Onglet Glycémies
const GlucoseTab: React.FC<{ patient: any; canAccess: boolean }> = ({
  patient,
  canAccess,
}) => {
  if (!canAccess) return <SectionLocked section="glycémie" />;

  const glucoseData = [
    {
      value: 142,
      time: '08:30',
      context: t('patientDataTabs.glucose.context.fasting'),
      trend: t('patientDataTabs.glucose.trend.stable'),
    },
    {
      value: 180,
      time: '12:45',
      context: t('patientDataTabs.glucose.context.postMeal'),
      trend: t('patientDataTabs.glucose.trend.up'),
    },
    {
      value: 125,
      time: '16:20',
      context: t('patientDataTabs.glucose.context.snack'),
      trend: t('patientDataTabs.glucose.trend.down'),
    },
    {
      value: 158,
      time: '20:15',
      context: t('patientDataTabs.glucose.context.afterDinner'),
      trend: t('patientDataTabs.glucose.trend.up'),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🩸 {t('patientDataTabs.glycemia.todayData')}
            <Badge
              variant={
                patient.lastGlucose && patient.lastGlucose > 140
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {t('patientDataTabs.glycemia.last')}:{' '}
              {patient.lastGlucose || '--'} mg/dL
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {glucoseData.map((reading, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-mono font-bold text-primary">
                    {reading.value}
                  </div>
                  <div className="text-sm text-muted-foreground">mg/dL</div>
                  <div className="text-lg">
                    {reading.trend === t('patientDataTabs.glucose.trend.up') &&
                      '↗️'}
                    {reading.trend ===
                      t('patientDataTabs.glucose.trend.down') && '↘️'}
                    {reading.trend ===
                      t('patientDataTabs.glucose.trend.stable') && '➡️'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{reading.time}</div>
                  <div className="text-sm text-muted-foreground">
                    {reading.context}
                  </div>
                </div>
                <Badge
                  variant={
                    reading.value > 180
                      ? 'destructive'
                      : reading.value < 70
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {reading.value > 180
                    ? t('glycemia.level.high')
                    : reading.value < 70
                      ? t('patientDataTabs.glycemia.level.low')
                      : t('patientDataTabs.glycemia.level.normal')}
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
const MedicationsTab: React.FC<{ patient: any; canAccess: boolean }> = ({
  patient,
  canAccess,
}) => {
  if (!canAccess) return <SectionLocked section="médicaments" />;

  const medications = [
    {
      name: 'Metformine',
      dosage: '500mg',
      frequency: t('patientDataTabs.medication.frequency.twiceDaily'),
      time: t('patientDataTabs.medication.time.morningEvening'),
      adherence: 95,
    },
    {
      name: 'Insuline Lantus',
      dosage: '12 UI',
      frequency: t('patientDataTabs.medication.frequency.onceDaily'),
      time: t('patientDataTabs.medication.time.evening'),
      adherence: 88,
    },
    {
      name: 'Humalog',
      dosage: '4-6 UI',
      frequency: t('patientDataTabs.medication.frequency.beforeMeal'),
      time: t('patientDataTabs.medication.time.variable'),
      adherence: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>💊 {t('patientDataTabs.medications.current')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medications.map((med, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-bold text-lg">{med.name}</div>
                  <div className="text-muted-foreground">
                    {med.dosage} • {med.frequency}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Observance:</span>
                      <Progress value={med.adherence} className="flex-1" />
                      <span className="text-sm font-medium">
                        {med.adherence}%
                      </span>
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
const MealsTab: React.FC<{ patient: any; canAccess: boolean }> = ({
  patient,
  canAccess,
}) => {
  if (!canAccess) return <SectionLocked section="nutrition" />;

  const meals = [
    {
      time: '07:30',
      meal: t('patientDataTabs.meals.breakfast'),
      carbs: 45,
      calories: 380,
      photo: '🥐',
    },
    {
      time: '12:30',
      meal: t('patientDataTabs.meals.lunch'),
      carbs: 60,
      calories: 520,
      photo: '🍽️',
    },
    {
      time: '19:00',
      meal: t('patientDataTabs.meals.dinner'),
      carbs: 55,
      calories: 450,
      photo: '🍛',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🍽️ {t('patientDataTabs.nutrition.todayMeals')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{meal.photo}</div>
                  <div>
                    <div className="font-bold">{meal.meal}</div>
                    <div className="text-muted-foreground">{meal.time}</div>
                  </div>
                </div>
                <div className="text-right space-x-2">
                  <Badge variant="secondary">
                    {meal.carbs} {t('patientDataTabs.nutrition.carbs')}
                  </Badge>
                  <Badge variant="outline">{meal.calories} kcal</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium mb-2">
              📊 {t('patientDataTabs.nutrition.dailySummary')}
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">
                  {t('patientDataTabs.nutrition.totalCarbs')}:
                </span>{' '}
                160g
              </div>
              <div>
                <span className="font-medium">
                  {t('patientDataTabs.nutrition.totalCalories')}:
                </span>{' '}
                1350 kcal
              </div>
              <div>
                <span className="font-medium">
                  {t('patientDataTabs.nutrition.avgGlycemicIndex')}:
                </span>{' '}
                {t('patientDataTabs.nutrition.gi.moderate')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Onglet Activités
const ActivitiesTab: React.FC<{ patient: any; canAccess: boolean }> = ({
  patient,
  canAccess,
}) => {
  if (!canAccess) return <SectionLocked section="activités" />;

  const activities = [
    {
      time: '06:30',
      activity: t('patientDataTabs.activities.walk'),
      duration: 30,
      intensity: t('patientDataTabs.activities.intensity.moderate'),
      calories: 120,
    },
    {
      time: '18:00',
      activity: t('patientDataTabs.activities.cycling'),
      duration: 45,
      intensity: t('patientDataTabs.activities.intensity.high'),
      calories: 280,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('patientDataTabs.activities.todayActivities')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">{activity.activity}</div>
                    <div className="text-muted-foreground">
                      {activity.time} • {activity.duration}{' '}
                      {t('patientDataTabs.activities.minutes')}
                    </div>
                  </div>
                </div>
                <div className="text-right space-x-2">
                  <Badge
                    variant={
                      activity.intensity ===
                      t('patientDataTabs.activities.intensity.high')
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {activity.intensity}
                  </Badge>
                  <Badge variant="outline">{activity.calories} kcal</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2">
              📊 {t('patientDataTabs.activities.summary')}
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">
                  {t('patientDataTabs.activities.totalTime')}:
                </span>{' '}
                75 {t('patientDataTabs.activities.minutes')}
              </div>
              <div>
                <span className="font-medium">
                  {t('patientDataTabs.activities.caloriesBurned')}:
                </span>{' '}
                400 kcal
              </div>
              <div>
                <span className="font-medium">
                  {t('patientDataTabs.activities.weeklyGoal')}:
                </span>{' '}
                150 {t('patientDataTabs.activities.minutes')}
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
    {
      date: '2024-01-15',
      doctor: 'Dr. Martin',
      type: t('patientDataTabs.consultations.consultation'),
      notes: t('patientDataTabs.consultations.notes.adjustInsulin'),
    },
    {
      date: '2024-01-10',
      doctor: 'Dr. Dubois',
      type: t('patientDataTabs.consultations.teleconsultation'),
      notes: t('patientDataTabs.consultations.notes.glycemiaFollowUp'),
    },
    {
      date: '2024-01-05',
      doctor: 'Dr. Martin',
      type: t('patientDataTabs.consultations.consultation'),
      notes: t('patientDataTabs.consultations.notes.quarterlyCheck'),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('patientDataTabs.consultations.historyTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consultations.map((consultation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{consultation.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {consultation.doctor}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {new Date(consultation.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {consultation.notes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
