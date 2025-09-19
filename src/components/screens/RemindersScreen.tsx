import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Edit, Trash2, CheckCircle, Timer, X } from 'lucide-react';
import { useReminders, Reminder } from '@/hooks/useReminders';
import { CreateReminderModal } from '@/components/modals/CreateReminderModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onAction: (
    reminderId: string,
    action: 'completed' | 'snoozed' | 'missed'
  ) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onToggle,
  onEdit,
  onDelete,
  onAction,
}) => {
  const { t } = useTranslation();
  const { getReminderTypeInfo } = useReminders();
  const typeInfo = getReminderTypeInfo(reminder.reminder_type);

  const getDaysString = (locale: 'en' | 'fr' = 'fr') => {
    const dayNames =
      locale === 'fr'
        ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (reminder.days_of_week.length === 7)
      return locale === 'fr' ? 'Tous les jours' : 'Every day';

    if (
      reminder.days_of_week.length === 5 &&
      !reminder.days_of_week.includes(6) &&
      !reminder.days_of_week.includes(7)
    ) {
      return locale === 'fr' ? 'Lun-Ven' : 'Mon-Fri';
    }

    return reminder.days_of_week.map(day => dayNames[day - 1]).join(', ');
  };

  const isUpcoming = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [hours, minutes] = reminder.scheduled_time.split(':').map(Number);
    const reminderTime = hours * 60 + minutes;

    const today = new Date().getDay();
    const dayOfWeek = today === 0 ? 7 : today;

    return (
      reminder.is_active &&
      reminder.days_of_week.includes(dayOfWeek) &&
      reminderTime >= currentTime &&
      reminderTime <= currentTime + 120
    );
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        !reminder.is_active ? 'opacity-60' : ''
      } ${isUpcoming() ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${typeInfo.color}`}>
              <span className="text-xl">{typeInfo.icon}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{reminder.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{typeInfo.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isUpcoming() && (
              <Badge variant="secondary" className="animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                {t('status.upcoming')} {/* Use your i18n key */}
              </Badge>
            )}
            <Switch
              checked={reminder.is_active}
              onCheckedChange={checked => onToggle(reminder.id, checked)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{reminder.scheduled_time}</span>
            </div>
            <span>•</span>
            <span>{getDaysString()}</span>
          </div>

          {reminder.description && (
            <p className="text-sm text-muted-foreground">
              {reminder.description}
            </p>
          )}

          {(reminder.dose_amount || reminder.dose_unit) && (
            <div className="text-sm">
              <span className="font-medium">Dose: </span>
              <span>
                {reminder.dose_amount} {reminder.dose_unit}
              </span>
            </div>
          )}

          {isUpcoming() && (
            <div className="flex space-x-2 pt-2 border-t">
              <Button
                size="sm"
                variant="default"
                onClick={() => onAction(reminder.id, 'completed')}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Fait
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(reminder.id, 'snoozed')}
              >
                <Timer className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(reminder.id, 'missed')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2 border-t">
            <Button size="sm" variant="ghost" onClick={() => onEdit(reminder)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(reminder.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RemindersScreen: React.FC = () => {
  // All hooks at the top level
  const { t } = useTranslation();
  const {
    reminders,
    loading,
    deleteReminder,
    toggleReminder,
    logReminderAction,
    getTodaysReminders,
    getUpcomingReminders,
    getReminderTypeInfo,
    refreshReminders,
  } = useReminders();

  // Helper to get next reminder Date object
  function getNextReminderDate(reminder) {
    const now = new Date();
    const [hours, minutes] = reminder.scheduled_time.split(':').map(Number);
    let next = new Date();
    next.setHours(hours, minutes, 0, 0);
    // If today is not a valid day or time has passed, find next valid day
    let dayOffset = 0;
    while (
      !reminder.days_of_week.includes(
        ((getTodayDayOfWeek() + dayOffset - 1) % 7) + 1
      ) ||
      (dayOffset === 0 && next < now)
    ) {
      dayOffset++;
      next = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + dayOffset,
        hours,
        minutes,
        0,
        0
      );
    }
    return next;
  }
  // Helper to get today as 1-7 (Mon-Sun)
  function getTodayDayOfWeek() {
    const today = new Date().getDay();
    return today === 0 ? 7 : today;
  }

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Remove these variables; call the functions directly in render

  // Toast scheduling logic
  const scheduledTimeouts = useRef([]);
  useEffect(() => {
    // Clear previous timeouts
    scheduledTimeouts.current.forEach(clearTimeout);
    scheduledTimeouts.current = [];
    reminders.forEach(reminder => {
      if (!reminder.is_active || !reminder.scheduled_time) return;
      const next = getNextReminderDate(reminder);
      const now = new Date();
      const msUntil = next.getTime() - now.getTime();
      if (msUntil > 0 && msUntil < 1000 * 60 * 60 * 24 * 7) {
        console.log(
          'Scheduling toast for',
          reminder.title,
          'in',
          msUntil / 1000,
          'seconds'
        );
        // only schedule up to 7 days ahead
        const timeoutId = setTimeout(() => {
          toast.info(`⏰ ${reminder.title}`, {
            body: reminder.description || undefined,
            autoClose: 30000, // 30 seconds
          });
        }, msUntil);
        scheduledTimeouts.current.push(timeoutId);
      }
    });
    return () => scheduledTimeouts.current.forEach(clearTimeout);
  }, [reminders]);

  const handleDelete = async (id: string) => {
    if (confirm(t('remindersScreen.reminder.delete_confirmation'))) {
      await deleteReminder(id);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsCreateModalOpen(false);
    setEditingReminder(null);
    setIsSyncing(true);
    await refreshReminders();
    setIsSyncing(false);
  };

  if (loading || isSyncing) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {' '}
        {/* 📌 stacked on mobile */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            ⏰ {t('reminderScreen.title')}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('reminderScreen.subtitle')}
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          {' '}
          {/* 📌 full width button on mobile */}
          <Plus className="w-4 h-4 mr-2" />
          {t('reminderScreen.button2')}
        </Button>
      </div>

      {/* Upcoming Reminders Alert */}
      {getUpcomingReminders().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800 text-base sm:text-lg">
              🔔{' '}
              {t('remindersScreen.reminder.upcoming', {
                time: '2h',
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingReminders().map(reminder => {
                const typeInfo = getReminderTypeInfo
                  ? getReminderTypeInfo(reminder.reminder_type)
                  : { icon: '⏰', name: 'Rappel' };
                return (
                  <div
                    key={reminder.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white rounded gap-2"
                  >
                    {/* 📌 stacks on mobile */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span>{typeInfo.icon}</span>
                      <span className="font-medium">{reminder.title}</span>
                      <span className="text-muted-foreground">
                        à {reminder.scheduled_time}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          logReminderAction(reminder.id, 'completed')
                        }
                        className="w-full sm:w-auto"
                      >
                        Fait
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Reminders */}
      {getTodaysReminders().length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            📅{' '}
            {t('remindersScreen.reminder.today', {
              count: getTodaysReminders().length,
            })}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 📌 responsive grid */}
            {getTodaysReminders().map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={toggleReminder}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAction={logReminderAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Reminders */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          📋 {t('reminderScreen.newReminder.title')} ({reminders.length})
        </h2>
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-5xl sm:text-6xl mb-4">⏰</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {t('reminderScreen.newReminder.reminderSet')}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                {t('reminderScreen.newReminder.writeup')}
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto"
              >
                {' '}
                {/* 📌 full width button on mobile */}
                <Plus className="w-4 h-4 mr-2" />
                {t('reminderScreen.button1')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {' '}
            {/* 📌 responsive grid */}
            {reminders.map(reminder => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={toggleReminder}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAction={logReminderAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <CreateReminderModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        editingReminder={editingReminder}
      />
    </div>
  );
};
