import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export interface Reminder {
  id: string;
  user_id: string;
  reminder_type:
    | 'insulin'
    | 'medication'
    | 'glucose_test'
    | 'meal'
    | 'activity';
  title: string;
  description?: string;
  scheduled_time: string; // HH:MM format
  days_of_week: number[]; // 1=Monday, 7=Sunday
  is_active: boolean;
  dose_amount?: string;
  dose_unit?: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderLog {
  id: string;
  reminder_id: string;
  user_id: string;
  action_type: 'completed' | 'snoozed' | 'missed';
  logged_at: string;
  notes?: string;
}

export function useReminders() {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all reminders for current user
  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_reminders')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (error) throw error;

      setReminders((data || []) as Reminder[]);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: t('useReminders.toast.errorTitle'),
        description: t('useReminders.toast.remindersLoadError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new reminder
  const createReminder = async (
    reminderData: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .insert({
          ...reminderData,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Refetch from backend to ensure UI is always in sync
      await fetchReminders();
      toast({
        title: t('useReminders.toast.reminderCreatedTitle'),
        description: t('useReminders.toast.reminderScheduled', {
          title: reminderData.title,
        }),
      });

      return data as Reminder;
    } catch (err: any) {
      toast({
        title: t('useReminders.toast.errorTitle'),
        description: t('useReminders.toast.reminderCreateError'),
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update reminder
  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      const { data, error } = await supabase
        .from('user_reminders')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setReminders(prev =>
        prev.map(r => (r.id === id ? (data as Reminder) : r))
      );
      toast({
        title: t('useReminders.toast.reminderUpdatedTitle'),
        description: t('useReminders.toast.reminderUpdatedDescription'),
      });

      return data as Reminder;
    } catch (err: any) {
      toast({
        title: t('useReminders.toast.reminderUpdateErrorTitle'),
        description: t('useReminders.toast.reminderUpdateErrorDescription'),
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete reminder
  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReminders(prev => prev.filter(r => r.id !== id));
      toast({
        title: t('useReminders.toast.reminderDeletedTitle'),
        description: t('useReminders.toast.reminderDeletedDescription'),
      });
    } catch (err: any) {
      toast({
        title: t('useReminders.toast.reminderDeleteErrorTitle'),
        description: t('useReminders.toast.reminderDeleteErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  // Toggle reminder active status
  const toggleReminder = async (id: string, is_active: boolean) => {
    await updateReminder(id, { is_active });
  };

  // Log reminder action
  const logReminderAction = async (
    reminderId: string,
    actionType: 'completed' | 'snoozed' | 'missed',
    notes?: string
  ) => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const { error } = await supabase.from('reminder_logs').insert({
        reminder_id: reminderId,
        action_type: actionType,
        user_id: userId,
        notes,
      });

      if (error) throw error;

      const actionEmoji = {
        completed: '✅',
        snoozed: '⏰',
        missed: '❌',
      };

      toast({
        title: t('useReminders.toast.reminderActionTitle', {
          emoji: actionEmoji[actionType],
          status: t(`useReminders.toast.reminderStatus.${actionType}`),
        }),
        description: notes || t('useReminders.toast.reminderActionDescription'),
      });
    } catch (err: any) {
      toast({
        title: t('useReminders.toast.reminderActionErrorTitle'),
        description: t('useReminders.toast.reminderActionErrorDescription'),
        variant: 'destructive',
      });
    }
  };

  // Get today's active reminders
  const getTodaysReminders = () => {
    const today = new Date().getDay(); // 0=Sunday, 1=Monday...
    const dayOfWeek = today === 0 ? 7 : today; // Convert to 1-7 format

    return reminders.filter(
      reminder =>
        reminder.is_active && reminder.days_of_week.includes(dayOfWeek)
    );
  };

  // Get upcoming reminders (next 2 hours)
  const getUpcomingReminders = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const twoHoursLater = currentTime + 120;

    return getTodaysReminders().filter(reminder => {
      const [hours, minutes] = reminder.scheduled_time.split(':').map(Number);
      const reminderTime = hours * 60 + minutes;

      return reminderTime >= currentTime && reminderTime <= twoHoursLater;
    });
  };

  // Get reminder type icon and color
  const getReminderTypeInfo = (type: Reminder['reminder_type']) => {
    const typeMap = {
      insulin: {
        icon: '💉',
        color: 'text-blue-600 bg-blue-50',
        name: t('useReminders.typeMap.insulin.name'),
      },
      medication: {
        icon: '💊',
        color: 'text-green-600 bg-green-50',
        name: t('useReminders.typeMap.medication.name'),
      },
      glucose_test: {
        icon: '🩸',
        color: 'text-red-600 bg-red-50',
        name: t('useReminders.typeMap.glucose_test.name'),
      },
      meal: {
        icon: '🍽️',
        color: 'text-orange-600 bg-orange-50',
        name: t('useReminders.typeMap.meal.name'),
      },
      activity: {
        icon: '🏃',
        color: 'text-purple-600 bg-purple-50',
        name: t('useReminders.typeMap.activity.name'),
      },
    };
    return typeMap[type];
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return {
    reminders,
    loading,
    error,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    logReminderAction,
    getTodaysReminders,
    getUpcomingReminders,
    getReminderTypeInfo,
    refreshReminders: fetchReminders,
  };
}
