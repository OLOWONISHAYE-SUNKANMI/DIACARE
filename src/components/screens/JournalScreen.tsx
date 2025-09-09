import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Syringe,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { format, isToday, isYesterday } from 'date-fns';

import { useMeals } from '@/contexts/MealContext';
import { useMedications } from '@/contexts/MedicationContext';
import { useActivities } from '@/contexts/ActivityContext';
import { useGlucose } from '@/contexts/GlucoseContext';

interface JournalScreenProps {
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
}

type JournalEntry = {
  id: string;
  date: string;
  time: string;
  fullDate: string;
  glucose?: number;
  glucoseStatus?: string;
  glucoseColor?: string;
  glucoseBg?: string;
  insulin?: {
    type: string;
    dose: number;
    injectionTime: string | null;
    status: 'injected' | 'missed';
  };
  meal?: {
    name: string;
    portion: number;
    carbs: number;
  };
  activity?: {
    name: string;
    duration: number;
    calories: number;
  };
  context: string;
  timestamp: Date;
};

const JournalScreen = ({ showAlert, setShowAlert }: JournalScreenProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'today' | 'week' | 'month'
  >('today');
  const { toast } = useToast();
  const { t } = useTranslation();

  const { meals } = useMeals();
  const { medications } = useMedications();
  const { activities } = useActivities();
  const { readings } = useGlucose();

  //  Transform DB → JournalEntry
  const buildEntries = useMemo(() => {
    const entries: JournalEntry[] = [];

    // Glucose
    readings.forEach(r => {
      const value = r.value;
      let status = t('journal.normal');
      let color = 'text-emerald-600';
      let bg = 'bg-emerald-50';
      if (value < 70) {
        status = t('journal.low');
        color = 'text-red-600';
        bg = 'bg-red-50';
      } else if (value > 180) {
        status = t('journal.high');
        color = 'text-amber-600';
        bg = 'bg-amber-50';
      }

      const d = new Date(r.timestamp);
      entries.push({
        id: r.id,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: d.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        glucose: value,
        glucoseStatus: status,
        glucoseColor: color,
        glucoseBg: bg,
        context: r.context || t('journal.glucose'),
        timestamp: d,
      });
    });

    // Medications (Insulin)
    medications.forEach(m => {
      const d = new Date(m.medication_time);
      entries.push({
        id: m.id,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: d.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        insulin: {
          type: m.medication_name,
          dose: m.dose,
          injectionTime: d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: 'injected', // replace if your DB tracks missed injections
        },
        context: t('journal.medication'),
        timestamp: d,
      });
    });

    // Meals
    meals.forEach(meal => {
      const d = new Date(meal.meal_time);
      entries.push({
        id: meal.id,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: d.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        meal: {
          name: meal.meal_name,
          portion: meal.portion_grams,
          carbs: meal.total_carbs,
        },
        context: t('journal.meal'),
        timestamp: d,
      });
    });

    // Activities
    activities.forEach(act => {
      const d = new Date(act.activity_time);
      entries.push({
        id: act.id,
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: d.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        activity: {
          name: act.activity_name,
          duration: act.duration_minutes,
          calories: act.total_calories_burned,
        },
        context: t('journal.activity'),
        timestamp: d,
      });
    });

    return entries.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [readings, medications, meals, activities, t]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, JournalEntry[]> = {};

    buildEntries.forEach(entry => {
      const dayKey = entry.date; // already formatted as local date
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push(entry);
    });

    // Sort groups by date (newest first)
    const sortedGroups = Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedGroups.map(([day, items]) => ({
      day,
      label: isToday(new Date(day))
        ? 'Today'
        : isYesterday(new Date(day))
        ? 'Yesterday'
        : format(new Date(day), 'EEEE, MMM d'),
      entries: items,
    }));
  }, [buildEntries]);

  //  Filter by period
  const filteredEntries = useMemo(() => {
    const now = new Date();
    return buildEntries.filter(entry => {
      const d = entry.timestamp;
      if (selectedPeriod === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (selectedPeriod === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (selectedPeriod === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return d >= monthAgo;
      }
      return true;
    });
  }, [buildEntries, selectedPeriod]);

  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
          <BookOpen className="w-6 h-6 text-medical-teal" />
          <span>{t('journal.title')}</span>
        </h2>
        <p className="text-muted-foreground">{t('journal.subtitle')}</p>
      </div>

      {/* Period Filters */}
      <Card className="border-medical-teal/20">
        <CardContent className="p-4">
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            onValueChange={val => val && setSelectedPeriod(val as any)}
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

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.map(entry => (
          <Card
            key={entry.id}
            className="border-medical-teal/20 hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-foreground">
                    {entry.date}
                  </span>
                  <span className="text-muted-foreground">{entry.time}</span>
                  <Badge variant="secondary" className="text-xs">
                    {entry.context}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {entry.fullDate}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Glucose */}
              {entry.glucose !== undefined && (
                <div
                  className={`p-4 rounded-lg ${entry.glucoseBg} border border-opacity-20`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        {entry.glucose}
                        <span className="text-lg font-normal text-muted-foreground ml-1">
                          mg/dL
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium ${entry.glucoseColor}`}
                      >
                        {entry.glucoseStatus}
                      </div>
                    </div>
                    <TrendingUp className={`w-6 h-6 ${entry.glucoseColor}`} />
                  </div>
                </div>
              )}

              {/* Insulin / Medication */}
              {entry.insulin && (
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
                            {entry.insulin.status === 'injected'
                              ? `${t('journal.injected')} ${
                                  entry.insulin.injectionTime
                                }`
                              : t('journal.missed')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {entry.insulin.status === 'injected' ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Meal Entry */}
              {entry.meal && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {entry.meal.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.meal.portion}g • {entry.meal.carbs}g carbs
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Entry */}
              {entry.activity && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        {entry.activity.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.activity.duration} min •{' '}
                        {entry.activity.calories} cal
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <p className="text-center text-muted-foreground">
            {t('journal.noEntries')}
          </p>
        )}
      </div>
    </div>
  );
};

export default JournalScreen;
