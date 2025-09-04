import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useReminders, Reminder } from "@/hooks/useReminders";

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingReminder?: Reminder | null;
}

const reminderTypes = [
  { value: "insulin", label: "Insuline", icon: "💉", description: "Injection d'insuline" },
  { value: "medication", label: "Médicament", icon: "💊", description: "Prise de médicament" },
  { value: "glucose_test", label: "Test glycémie", icon: "🩸", description: "Mesure de glycémie" },
  { value: "meal", label: "Repas", icon: "🍽️", description: "Rappel de repas" },
  { value: "activity", label: "Activité", icon: "🏃", description: "Exercice physique" },
];

const daysOfWeek = [
  { value: 1, label: "Lundi", short: "Lun" },
  { value: 2, label: "Mardi", short: "Mar" },
  { value: 3, label: "Mercredi", short: "Mer" },
  { value: 4, label: "Jeudi", short: "Jeu" },
  { value: 5, label: "Vendredi", short: "Ven" },
  { value: 6, label: "Samedi", short: "Sam" },
  { value: 7, label: "Dimanche", short: "Dim" },
];

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  isOpen,
  onClose,
  editingReminder,
}) => {
  const { createReminder, updateReminder } = useReminders();

  const [formData, setFormData] = useState({
    reminder_type: "" as Reminder["reminder_type"],
    title: "",
    description: "",
    scheduled_time: "",
    days_of_week: [1, 2, 3, 4, 5, 6, 7] as number[],
    is_active: true,
    dose_amount: "",
    dose_unit: "",
  });

  const [loading, setLoading] = useState(false);

  // Load editing data when modal opens
  useEffect(() => {
    if (editingReminder) {
      setFormData({
        reminder_type: editingReminder.reminder_type,
        title: editingReminder.title,
        description: editingReminder.description || "",
        scheduled_time: editingReminder.scheduled_time,
        days_of_week: editingReminder.days_of_week,
        is_active: editingReminder.is_active,
        dose_amount: editingReminder.dose_amount || "",
        dose_unit: editingReminder.dose_unit || "",
      });
    } else {
      setFormData({
        reminder_type: "" as Reminder["reminder_type"],
        title: "",
        description: "",
        scheduled_time: "",
        days_of_week: [1, 2, 3, 4, 5, 6, 7],
        is_active: true,
        dose_amount: "",
        dose_unit: "",
      });
    }
  }, [editingReminder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reminder_type || !formData.title || !formData.scheduled_time) return;

    setLoading(true);
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, formData);
      } else {
        await createReminder(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving reminder:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayValue: number) => {
    setFormData((prev) => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dayValue)
        ? prev.days_of_week.filter((d) => d !== dayValue)
        : [...prev.days_of_week, dayValue].sort(),
    }));
  };

  const selectAllDays = () => setFormData((prev) => ({ ...prev, days_of_week: [1, 2, 3, 4, 5, 6, 7] }));
  const selectWeekdays = () => setFormData((prev) => ({ ...prev, days_of_week: [1, 2, 3, 4, 5] }));
  const selectWeekends = () => setFormData((prev) => ({ ...prev, days_of_week: [6, 7] }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" alignItems="center" gap={2}>
          ⏰ {editingReminder ? "Modifier le rappel" : "Nouveau rappel"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Type */}
              <FormControl isRequired>
                <FormLabel>Type de rappel</FormLabel>
                <Select
                  placeholder="Sélectionnez un type"
                  value={formData.reminder_type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reminder_type: e.target.value as Reminder["reminder_type"] }))
                  }
                >
                  {reminderTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Titre */}
              <FormControl isRequired>
                <FormLabel>Titre</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Humalog avant déjeuner"
                />
              </FormControl>

              {/* Description */}
              <FormControl>
                <FormLabel>Description (optionnelle)</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Informations supplémentaires..."
                />
              </FormControl>

              {/* Heure */}
              <FormControl isRequired>
                <FormLabel>Heure</FormLabel>
                <Input
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scheduled_time: e.target.value }))}
                />
              </FormControl>

              {/* Dose */}
              {(formData.reminder_type === "insulin" || formData.reminder_type === "medication") && (
                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Dose</FormLabel>
                    <Input
                      value={formData.dose_amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dose_amount: e.target.value }))}
                      placeholder="Ex: 10"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Unité</FormLabel>
                    <Select
                      placeholder="Unité"
                      value={formData.dose_unit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dose_unit: e.target.value }))}
                    >
                      {formData.reminder_type === "insulin" ? (
                        <>
                          <option value="UI">UI</option>
                          <option value="mL">mL</option>
                        </>
                      ) : (
                        <>
                          <option value="mg">mg</option>
                          <option value="g">g</option>
                          <option value="comprimé(s)">comprimé(s)</option>
                          <option value="gélule(s)">gélule(s)</option>
                          <option value="ml">ml</option>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </HStack>
              )}

              {/* Jours */}
              <FormControl>
                <FormLabel>Jours de répétition</FormLabel>
                <HStack spacing={2} wrap="wrap">
                  <Button size="sm" onClick={selectAllDays} variant="outline">
                    Tous les jours
                  </Button>
                  <Button size="sm" onClick={selectWeekdays} variant="outline">
                    Lun-Ven
                  </Button>
                  <Button size="sm" onClick={selectWeekends} variant="outline">
                    Week-end
                  </Button>
                </HStack>
                <HStack spacing={4} mt={2} wrap="wrap">
                  {daysOfWeek.map((day) => (
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
            Annuler
          </Button>
          <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading}>
            {editingReminder ? "Modifier" : "Créer"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
