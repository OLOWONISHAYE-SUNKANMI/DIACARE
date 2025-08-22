import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Edit, Trash2, CheckCircle, Timer, X } from 'lucide-react';
import { useReminders, Reminder } from '@/hooks/useReminders';
import { CreateReminderModal } from '@/components/modals/CreateReminderModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useTranslation } from 'react-i18next';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onAction: (reminderId: string, action: 'completed' | 'snoozed' | 'missed') => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ 
  reminder, 
  onToggle, 
  onEdit, 
  onDelete, 
  onAction 
}) => {
  const { getReminderTypeInfo } = useReminders();
  const typeInfo = getReminderTypeInfo(reminder.reminder_type);
  
  const getDaysString = () => {
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    if (reminder.days_of_week.length === 7) return 'Tous les jours';
    if (reminder.days_of_week.length === 5 && !reminder.days_of_week.includes(6) && !reminder.days_of_week.includes(7)) {
      return 'Lun-Ven';
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
    
    return reminder.is_active && 
           reminder.days_of_week.includes(dayOfWeek) && 
           reminderTime >= currentTime && 
           reminderTime <= currentTime + 120;
  };

  return (
    <Card className={`transition-all hover:shadow-md ${!reminder.is_active ? 'opacity-60' : ''} ${isUpcoming() ? 'ring-2 ring-primary' : ''}`}>
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
                Bientôt
              </Badge>
            )}
            <Switch 
              checked={reminder.is_active}
              onCheckedChange={(checked) => onToggle(reminder.id, checked)}
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
            <p className="text-sm text-muted-foreground">{reminder.description}</p>
          )}
          
          {(reminder.dose_amount || reminder.dose_unit) && (
            <div className="text-sm">
              <span className="font-medium">Dose: </span>
              <span>{reminder.dose_amount} {reminder.dose_unit}</span>
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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(reminder)}
            >
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
  const { t } = useTranslation();
  const {
    reminders,
    loading,
    deleteReminder,
    toggleReminder,
    logReminderAction,
    getTodaysReminders,
    getUpcomingReminders
  } = useReminders();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const todaysReminders = getTodaysReminders();
  const upcomingReminders = getUpcomingReminders();

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) {
      await deleteReminder(id);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingReminder(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">⏰ Mes Rappels</h1>
          <p className="text-muted-foreground">
            Gérez vos rappels pour insuline, médicaments, tests et plus
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rappel
        </Button>
      </div>

      {/* Upcoming Reminders Alert */}
      {upcomingReminders.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              🔔 Rappels à venir (2h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReminders.map(reminder => {
                const typeInfo = reminders.length > 0 ? 
                  useReminders().getReminderTypeInfo(reminder.reminder_type) : 
                  { icon: '⏰', name: 'Rappel' };
                
                return (
                  <div key={reminder.id} className="flex items-center justify-between p-2 bg-white rounded">
                    <div className="flex items-center space-x-2">
                      <span>{typeInfo.icon}</span>
                      <span className="font-medium">{reminder.title}</span>
                      <span className="text-sm text-muted-foreground">à {reminder.scheduled_time}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => logReminderAction(reminder.id, 'completed')}
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
      {todaysReminders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">📅 Aujourd'hui ({todaysReminders.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {todaysReminders.map(reminder => (
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
        <h2 className="text-xl font-semibold mb-4">
          📋 Tous les rappels ({reminders.length})
        </h2>
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-lg font-semibold mb-2">Aucun rappel configuré</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier rappel pour ne jamais oublier vos traitements
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer un rappel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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