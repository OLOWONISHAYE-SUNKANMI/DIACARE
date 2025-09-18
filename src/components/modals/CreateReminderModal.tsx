import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Checkbox,
  HStack,
  VStack,
  Box,
} from '@chakra-ui/react';
import { useReminders, Reminder } from '@/hooks/useReminders';
import { useTranslation } from 'react-i18next';

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingReminder?: Reminder | null;
}

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  isOpen,
  onClose,
  editingReminder,
}) => {
  const { t } = useTranslation();
  const { createReminder, updateReminder } = useReminders();

  const [formData, setFormData] = useState({
    reminder_type: '' as Reminder['reminder_type'],
    title: '',
    description: '',
    scheduled_time: '',
    days_of_week: [1, 2, 3, 4, 5, 6, 7] as number[],
    is_active: true,
    dose_amount: '',
    dose_unit: '',
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
        dose_unit: editingReminder.dose_unit || '',
      });
    } else {
      setFormData({
        reminder_type: '' as Reminder['reminder_type'],
        title: '',
        description: '',
        scheduled_time: '',
        days_of_week: [1, 2, 3, 4, 5, 6, 7],
        is_active: true,
        dose_amount: '',
        dose_unit: '',
      });
    }
  }, [editingReminder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reminder_type || !formData.title || !formData.scheduled_time)
      return;

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
        : [...prev.days_of_week, dayValue].sort(),
    }));
  };

  const selectAllDays = () =>
    setFormData(prev => ({ ...prev, days_of_week: [1, 2, 3, 4, 5, 6, 7] }));
  const selectWeekdays = () =>
    setFormData(prev => ({ ...prev, days_of_week: [1, 2, 3, 4, 5] }));
  const selectWeekends = () =>
    setFormData(prev => ({ ...prev, days_of_week: [6, 7] }));

  const reminderTypes = [
    {
      value: 'insulin',
      icon: '💉',
      label: t('createReminderModal.reminders.types.insulin.label'),
      description: t('createReminderModal.reminders.types.insulin.description'),
    },
    {
      value: 'medication',
      icon: '💊',
      label: t('createReminderModal.reminders.types.medication.label'),
      description: t(
        'createReminderModal.reminders.types.medication.description'
      ),
    },
    {
      value: 'glucose_test',
      icon: '🩸',
      label: t('createReminderModal.reminders.types.glucose_test.label'),
      description: t(
        'createReminderModal.reminders.types.glucose_test.description'
      ),
    },
    {
      value: 'meal',
      icon: '🍽️',
      label: t('createReminderModal.reminders.types.meal.label'),
      description: t('createReminderModal.reminders.types.meal.description'),
    },
    {
      value: 'activity',
      icon: '🏃',
      label: t('createReminderModal.reminders.types.activity.label'),
      description: t(
        'createReminderModal.reminders.types.activity.description'
      ),
    },
  ];

  const daysOfWeek = [
    {
      value: 1,
      label: t('createReminderModal.days.1.label'),
      short: t('createReminderModal.days.1.short'),
    },
    {
      value: 2,
      label: t('createReminderModal.days.2.label'),
      short: t('createReminderModal.days.2.short'),
    },
    {
      value: 3,
      label: t('createReminderModal.days.3.label'),
      short: t('createReminderModal.days.3.short'),
    },
    {
      value: 4,
      label: t('createReminderModal.days.4.label'),
      short: t('createReminderModal.days.4.short'),
    },
    {
      value: 5,
      label: t('createReminderModal.days.5.label'),
      short: t('createReminderModal.days.5.short'),
    },
    {
      value: 6,
      label: t('createReminderModal.days.6.label'),
      short: t('createReminderModal.days.6.short'),
    },
    {
      value: 7,
      label: t('createReminderModal.days.7.label'),
      short: t('createReminderModal.days.7.short'),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" alignItems="center" gap={2}>
          ⏰ {editingReminder ? 'Modifier le rappel' : 'Nouveau rappel'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Type */}
              <FormControl isRequired>
                <FormLabel>{t('createReminderModal.reminderType')}</FormLabel>
                <Select
                  placeholder={t('createReminderModal.placeholders.selectType')}
                  value={formData.reminder_type}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      reminder_type: e.target
                        .value as Reminder['reminder_type'],
                    }))
                  }
                >
                  {reminderTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Titre */}
              <FormControl isRequired>
                <FormLabel>{t('createReminderModal.title')}</FormLabel>
                <Input
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder={t(
                    'createReminderModal.placeholders.reminderTitle'
                  )}
                />
              </FormControl>

              {/* Description */}
              <FormControl>
                <FormLabel>
                  {t('createReminderModal.form.description.label')}
                </FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'createReminderModal.form.description.placeholder'
                  )}
                />
              </FormControl>

              {/* Heure */}
              <FormControl isRequired>
                <FormLabel>{t('createReminderModal.form.time')}</FormLabel>

                <Input
                  type="time"
                  value={formData.scheduled_time}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      scheduled_time: e.target.value,
                    }))
                  }
                />
              </FormControl>

              {/* Dose */}
              {(formData.reminder_type === 'insulin' ||
                formData.reminder_type === 'medication') && (
                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Dose</FormLabel>
                    <Input
                      value={formData.dose_amount}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          dose_amount: e.target.value,
                        }))
                      }
                      placeholder="Ex: 10"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t('createReminderModal.form.unit')}</FormLabel>
                    <Select
                      placeholder={t('form.unit')}
                      value={formData.dose_unit}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          dose_unit: e.target.value,
                        }))
                      }
                    >
                      {formData.reminder_type === 'insulin' ? (
                        <>
                          <option value="ui">
                            {t('createReminderModal.form.units.ui')}
                          </option>
                          <option value="ml">
                            {t('createReminderModal.form.units.ml')}
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="mg">
                            {t('createReminderModal.form.units.mg')}
                          </option>
                          <option value="g">
                            {t('createReminderModal.form.units.g')}
                          </option>
                          <option value="tablet">
                            {t('createReminderModal.form.units.tablet')}
                          </option>
                          <option value="capsule">
                            {t('createReminderModal.form.units.capsule')}
                          </option>
                          <option value="ml">
                            {t('createReminderModal.form.units.ml')}
                          </option>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </HStack>
              )}

              {/* Jours */}
              <FormControl>
                <FormLabel>
                  {t('createReminderModal.form.repeatDays')}
                </FormLabel>
                <HStack spacing={2} wrap="wrap">
                  <Button size="sm" onClick={selectAllDays} variant="outline">
                    {t('createReminderModal.form.repeatOptions.all')}
                  </Button>
                  <Button size="sm" onClick={selectWeekdays} variant="outline">
                    {t('createReminderModal.form.repeatOptions.weekdays')}
                  </Button>
                  <Button size="sm" onClick={selectWeekends} variant="outline">
                    {t('createReminderModal.form.repeatOptions.weekends')}
                  </Button>
                </HStack>

                <HStack spacing={4} mt={2} wrap="wrap">
                  {daysOfWeek.map(day => (
                    <Checkbox
                      key={day.value}
                      isChecked={formData.days_of_week.includes(day.value)}
                      onChange={() => handleDayToggle(day.value)}
                    >
                      {day.short}
                    </Checkbox>
                  ))}
                </HStack>
              </FormControl>
            </VStack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t('createReminderModal.buttons.cancel')}
          </Button>
          <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading}>
            {editingReminder
              ? t('createReminderModal.buttons.edit')
              : t('createReminderModal.buttons.create')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
