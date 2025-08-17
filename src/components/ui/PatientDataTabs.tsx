import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const [activeTab, setActiveTab] = useState('glucose');

  // Mock data pour la démonstration
  const glucoseData = [
    { value: 142, time: '08:30', context: 'Jeûne' },
    { value: 180, time: '12:45', context: 'Post-repas' },
    { value: 125, time: '16:20', context: 'Collation' },
    { value: 158, time: '20:15', context: 'Après dîner' }
  ];

  const medicationsData = [
    { name: 'Metformine', dosage: '500mg', frequency: '2x/jour', time: 'Matin/Soir' },
    { name: 'Insuline Lantus', dosage: '12 UI', frequency: '1x/jour', time: 'Soir' },
    { name: 'Humalog', dosage: '4-6 UI', frequency: 'Avant repas', time: 'Variable' }
  ];

  const mealsData = [
    { time: '07:30', meal: 'Petit-déjeuner', carbs: '45g', photo: '🥐' },
    { time: '12:30', meal: 'Déjeuner', carbs: '60g', photo: '🍽️' },
    { time: '19:00', meal: 'Dîner', carbs: '55g', photo: '🍛' }
  ];

  const activitiesData = [
    { time: '06:30', activity: 'Marche', duration: '30 min', intensity: 'Modérée' },
    { time: '18:00', activity: 'Vélo', duration: '45 min', intensity: 'Élevée' }
  ];

  const canAccessSection = (section: string) => {
    return patient.dataAccess.allowedSections.includes(section);
  };

  const SectionLocked = ({ section }: { section: string }) => (
    <div className="text-center py-8">
      <div className="text-4xl mb-4">🔒</div>
      <h3 className="text-lg font-semibold mb-2">Section non accessible</h3>
      <p className="text-muted-foreground">
        Vous n'avez pas l'autorisation d'accéder aux données de {section}.
      </p>
    </div>
  );

  return (
    <div className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="glucose" disabled={!canAccessSection('glucose')}>
            📈 Glycémie
          </TabsTrigger>
          <TabsTrigger value="medications" disabled={!canAccessSection('medications')}>
            💊 Médications
          </TabsTrigger>
          <TabsTrigger value="meals" disabled={!canAccessSection('meals')}>
            🍽️ Repas
          </TabsTrigger>
          <TabsTrigger value="activities" disabled={!canAccessSection('activities')}>
            🏃 Activités
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glucose" className="mt-4">
          {canAccessSection('glucose') ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Données Glycémiques - Aujourd'hui
                  <Badge variant={patient.lastGlucose && patient.lastGlucose > 140 ? "destructive" : "secondary"}>
                    Dernière: {patient.lastGlucose || '--'} mg/dL
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {glucoseData.map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-mono font-bold">
                          {reading.value}
                        </div>
                        <div className="text-sm text-muted-foreground">mg/dL</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{reading.time}</div>
                        <div className="text-sm text-muted-foreground">{reading.context}</div>
                      </div>
                      <Badge variant={reading.value > 140 ? "destructive" : "secondary"}>
                        {reading.value > 180 ? 'Élevé' : reading.value < 70 ? 'Bas' : 'Normal'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">📊 Résumé de la journée</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Moyenne:</span> 151 mg/dL
                    </div>
                    <div>
                      <span className="font-medium">Temps dans la cible:</span> 65%
                    </div>
                    <div>
                      <span className="font-medium">Variabilité:</span> Modérée
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SectionLocked section="glycémie" />
          )}
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          {canAccessSection('medications') ? (
            <Card>
              <CardHeader>
                <CardTitle>💊 Médications Actuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicationsData.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-bold text-lg">{med.name}</div>
                        <div className="text-muted-foreground">{med.dosage} • {med.frequency}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{med.time}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    📋 Voir Historique Complet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SectionLocked section="médications" />
          )}
        </TabsContent>

        <TabsContent value="meals" className="mt-4">
          {canAccessSection('meals') ? (
            <Card>
              <CardHeader>
                <CardTitle>🍽️ Repas et Glucides - Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mealsData.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{meal.photo}</div>
                        <div>
                          <div className="font-bold">{meal.meal}</div>
                          <div className="text-muted-foreground">{meal.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{meal.carbs} glucides</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium mb-2">📊 Total journalier</h4>
                  <div className="text-sm">
                    <span className="font-medium">Glucides totaux:</span> 160g
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SectionLocked section="repas" />
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          {canAccessSection('activities') ? (
            <Card>
              <CardHeader>
                <CardTitle>🏃 Activités Physiques - Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activitiesData.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-bold">{activity.activity}</div>
                        <div className="text-muted-foreground">{activity.time} • {activity.duration}</div>
                      </div>
                      <Badge variant={activity.intensity === 'Élevée' ? 'default' : 'secondary'}>
                        {activity.intensity}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">📊 Résumé</h4>
                  <div className="text-sm">
                    <span className="font-medium">Temps total:</span> 75 minutes
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SectionLocked section="activités" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};