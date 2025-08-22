import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useReminders, Reminder } from '@/hooks/useReminders';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingReminder?: Reminder | null;
}

const reminderTypes = [
  { value: 'insulin', label: 'Insuline', icon: '💉', description: 'Injection d\'insuline' },
  { value: 'medication', label: 'Médicament', icon: '💊', description: 'Prise de médicament' },
  { value: 'glucose_test', label: 'Test glycémie', icon: '🩸', description: 'Mesure de glycémie' },
  { value: 'meal', label: 'Repas', icon: '🍽️', description: 'Rappel de repas' },
  { value: 'activity', label: 'Activité', icon: '🏃', description: 'Exercice physique' }
];

const daysOfWeek = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 7, label: 'Dimanche', short: 'Dim' }
];

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({ 
  isOpen, 
  onClose, 
  editingReminder 
}) => {
  const { createReminder, updateReminder } = useReminders();
  
  const [formData, setFormData] = useState({
    reminder_type: '' as Reminder['reminder_type'],
    title: '',
    description: '',
    scheduled_time: '',
    days_of_week: [1, 2, 3, 4, 5, 6, 7] as number[],
    is_active: true,
    dose_amount: '',
    dose_unit: ''
  });

  const [loading, setLoading] = useState(false);

  // Load editing data when modal opens
  useEffect(() => {
    if (editingReminder) {
      setFormData({
        reminder_type: editingReminder.reminder_type,
        title: editingReminder.title,
        description: editingReminder.description || '',
        scheduled_time: editingReminder.scheduled_time,
        days_of_week: editingReminder.days_of_week,
        is_active: editingReminder.is_active,
        dose_amount: editingReminder.dose_amount || '',
        dose_unit: editingReminder.dose_unit || ''
      });
    } else {
      // Reset form for new reminder
      setFormData({
        reminder_type: '' as Reminder['reminder_type'],
        title: '',
        description: '',
        scheduled_time: '',
        days_of_week: [1, 2, 3, 4, 5, 6, 7],
        is_active: true,
        dose_amount: '',
        dose_unit: ''
      });
    }
  }, [editingReminder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reminder_type || !formData.title || !formData.scheduled_time) {
      return;
    }

    setLoading(true);
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, formData);
      } else {
        await createReminder(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayValue: number) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dayValue)
        ? prev.days_of_week.filter(d => d !== dayValue)
        : [...prev.days_of_week, dayValue].sort()
    }));
  };

  const selectAllDays = () => {
    setFormData(prev => ({ ...prev, days_of_week: [1, 2, 3, 4, 5, 6, 7] }));
  };

  const selectWeekdays = () => {
    setFormData(prev => ({ ...prev, days_of_week: [1, 2, 3, 4, 5] }));
  };

  const selectWeekends = () => {
    setFormData(prev => ({ ...prev, days_of_week: [6, 7] }));
  };

  const selectedType = reminderTypes.find(t => t.value === formData.reminder_type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span className="text-2xl">⏰</span>
            <span>{editingReminder ? 'Modifier le rappel' : 'Nouveau rappel'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de rappel */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Type de rappel</Label>
            <Select
              value={formData.reminder_type}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                reminder_type: value as Reminder['reminder_type'] 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type">
                  {selectedType && (
                    <div className="flex items-center space-x-2">
                      <span>{selectedType.icon}</span>
                      <span>{selectedType.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {reminderTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Titre du rappel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Humalog avant déjeuner"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description (optionnelle)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Informations supplémentaires..."
              rows={2}
            />
          </div>

          {/* Heure */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium">Heure</Label>
            <Input
              id="time"
              type="time"
              value={formData.scheduled_time}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
              required
            />
          </div>

          {/* Dose (pour insuline et médicaments) */}
          {(formData.reminder_type === 'insulin' || formData.reminder_type === 'medication') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose_amount" className="text-sm font-medium">Dose</Label>
                <Input
                  id="dose_amount"
                  value={formData.dose_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, dose_amount: e.target.value }))}
                  placeholder="Ex: 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dose_unit" className="text-sm font-medium">Unité</Label>
                <Select
                  value={formData.dose_unit}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dose_unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.reminder_type === 'insulin' ? (
                      <>
                        <SelectItem value="UI">UI (Unités internationales)</SelectItem>
                        <SelectItem value="mL">mL</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="comprimé(s)">comprimé(s)</SelectItem>
                        <SelectItem value="gélule(s)">gélule(s)</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Jours de la semaine */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Jours de répétition</Label>
            
            {/* Raccourcis */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAllDays}
                className={formData.days_of_week.length === 7 ? 'bg-primary text-primary-foreground' : ''}
              >
                Tous les jours
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectWeekdays}
                className={formData.days_of_week.length === 5 && !formData.days_of_week.includes(6) && !formData.days_of_week.includes(7) ? 'bg-primary text-primary-foreground' : ''}
              >
                Lun-Ven
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectWeekends}
                className={formData.days_of_week.length === 2 && formData.days_of_week.includes(6) && formData.days_of_week.includes(7) ? 'bg-primary text-primary-foreground' : ''}
              >
                Week-end
              </Button>
            </div>

            {/* Sélection des jours */}
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map(day => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={formData.days_of_week.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label 
                    htmlFor={`day-${day.value}`} 
                    className="text-sm cursor-pointer"
                  >
                    {day.short}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : editingReminder ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};