import { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { CalendarIcon, Users, FileText, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

// ✅ Zustand dark mode store
import { useThemeStore } from '@/store/useThemeStore.js';

// 🔹 Reusable Action Button
const ActionButton = ({ onClick, icon: Icon, label }) => (
  <Button
    onClick={onClick}
    variant="outline"
    w="full"
    justifyContent="flex-start"
  >
    <Icon className="h-4 w-4 mr-2" />
    {label}
  </Button>
);

export const QuickActions = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const [consultationDate, setConsultationDate] = useState<Date>();

  const consultationModal = useDisclosure();
  const reportModal = useDisclosure();
  const patientModal = useDisclosure();
  const settingsModal = useDisclosure();

  // ✅ Zustand dark mode
  const { darkMode } = useThemeStore();

  // ✅ Themed Components
  const ThemedModalContent = ({ children }) => (
    <ModalContent>{children}</ModalContent>
  );

  const ThemedModalHeader = ({ children }) => (
    <ModalHeader>{children}</ModalHeader>
  );

  const ThemedModalBody = ({ children }) => <ModalBody>{children}</ModalBody>;

  const ThemedModalFooter = ({ children }) => (
    <ModalFooter>{children}</ModalFooter>
  );

  // ✅ Success Toast Handler
  const handleSuccess = (title, description, onClose) => {
    toast({
      title,
      description,
      status: 'success',
      duration: 2500,
      isClosable: true,
      position: 'top-right',
    });
    onClose();
  };

  return (
    <div className="space-y-3">
      {/* ================= Consultation ================= */}
      <ActionButton
        onClick={consultationModal.onOpen}
        icon={CalendarIcon}
        label={t(
          'professionalDashboard.overview.quickActions.scheduleAppointment.title'
        )}
      />
      <Modal
        isOpen={consultationModal.isOpen}
        onClose={consultationModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ThemedModalContent>
          <ThemedModalHeader>
            {t(
              'professionalDashboard.overview.quickActions.scheduleAppointment.title'
            )}
          </ThemedModalHeader>
          <ModalCloseButton color={darkMode ? '#AEE6DA' : 'gray.600'} />
          <ThemedModalBody>
            <FormControl mb={3}>
              <FormLabel>Patient</FormLabel>
              <Select
                placeholder="Select patient"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="marie">Marie Dubois</option>
                <option value="pierre">Pierre Martin</option>
                <option value="sophie">Sophie Laurent</option>
                <option value="jean">Jean Bernard</option>
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Date</FormLabel>
              <Button
                variant="outline"
                w="full"
                onClick={() => setConsultationDate(new Date())}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {consultationDate
                  ? format(consultationDate, 'PPP', { locale: fr })
                  : t(
                      'professionalDashboard.overview.quickActions.scheduleAppointment.date.placeholder'
                    )}
              </Button>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>
                {t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.time.title'
                )}
              </FormLabel>
              <Select
                placeholder={t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.time.placeholder'
                )}
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(
                  time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  )
                )}
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>
                {t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.consultationType.title'
                )}
              </FormLabel>
              <Select
                placeholder="Select type"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="routine">{t('...routine')}</option>
                <option value="urgent">{t('...urgent')}</option>
                <option value="teleconsultation">
                  {t('...teleconsultation')}
                </option>
                <option value="first">{t('...first')}</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>
                Notes (
                {t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.notes.title'
                )}
                )
              </FormLabel>
              <Textarea
                placeholder={t(
                  'professionalDashboard.overview.quickActions.scheduleAppointment.notes.placeholder'
                )}
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
          </ThemedModalBody>
          <ThemedModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={consultationModal.onClose}
            >
              {t(
                'professionalDashboard.overview.quickActions.scheduleAppointment.button1'
              )}
            </Button>
            <Button
              bg={darkMode ? '#FA6657' : 'blue.500'}
              color="white"
              _hover={{ bg: darkMode ? '#F7845D' : 'blue.600' }}
              onClick={() =>
                handleSuccess(
                  t('quickActions.actions.scheduleConsultation.title'),
                  t('quickActions.actions.scheduleConsultation.description'),
                  consultationModal.onClose
                )
              }
            >
              {t(
                'professionalDashboard.overview.quickActions.scheduleAppointment.button2'
              )}
            </Button>
          </ThemedModalFooter>
        </ThemedModalContent>
      </Modal>

      {/* ================= Report ================= */}
      <ActionButton
        onClick={reportModal.onOpen}
        icon={FileText}
        label={t(
          'professionalDashboard.overview.quickActions.reportGenerator.title'
        )}
      />
      <Modal
        isOpen={reportModal.isOpen}
        onClose={reportModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ThemedModalContent>
          <ThemedModalHeader>
            {t(
              'professionalDashboard.overview.quickActions.reportGenerator.title'
            )}
          </ThemedModalHeader>
          <ModalCloseButton color={darkMode ? '#AEE6DA' : 'gray.600'} />
          <ThemedModalBody>
            <FormControl mb={3}>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Select report type"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="monthly">Monthly</option>
                <option value="patient">Patient</option>
                <option value="financial">Financial</option>
                <option value="activity">Activity</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Period</FormLabel>
              <Select
                placeholder="Select period"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="last-week">Last Week</option>
                <option value="last-month">Last Month</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="custom">Custom</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Format</FormLabel>
              <Select
                placeholder="Select format"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </Select>
            </FormControl>
          </ThemedModalBody>
          <ThemedModalFooter>
            <Button variant="outline" mr={3} onClick={reportModal.onClose}>
              {t(
                'professionalDashboard.overview.quickActions.reportGenerator.button1'
              )}
            </Button>
            <Button
              bg={darkMode ? '#FA6657' : 'blue.500'}
              color="white"
              _hover={{ bg: darkMode ? '#F7845D' : 'blue.600' }}
              onClick={() =>
                handleSuccess(
                  t('quickActions.actions.generateReport.title'),
                  t('quickActions.actions.generateReport.description'),
                  reportModal.onClose
                )
              }
            >
              {t(
                'professionalDashboard.overview.quickActions.reportGenerator.button2'
              )}
            </Button>
          </ThemedModalFooter>
        </ThemedModalContent>
      </Modal>

      {/* ================= Patient ================= */}
      <ActionButton
        onClick={patientModal.onOpen}
        icon={Users}
        label={t(
          'professionalDashboard.overview.quickActions.addPatient.title'
        )}
      />
      <Modal
        isOpen={patientModal.isOpen}
        onClose={patientModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ThemedModalContent>
          <ThemedModalHeader>
            {t(
              'professionalDashboard.overview.quickActions.addPatient.subtitle'
            )}
          </ThemedModalHeader>
          <ModalCloseButton color={darkMode ? '#AEE6DA' : 'gray.600'} />
          <ThemedModalBody>
            <FormControl mb={3}>
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder="First Name"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder="Last Name"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="email@example.com"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                placeholder="+33 6 12 34 56 78"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Diabetes Type</FormLabel>
              <Select
                placeholder="Select type"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="gestational">Gestational</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                placeholder="Medical notes"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
          </ThemedModalBody>
          <ThemedModalFooter>
            <Button variant="outline" mr={3} onClick={patientModal.onClose}>
              {t(
                'professionalDashboard.overview.quickActions.addPatient.button1'
              )}
            </Button>
            <Button
              bg={darkMode ? '#FA6657' : 'blue.500'}
              color="white"
              _hover={{ bg: darkMode ? '#F7845D' : 'blue.600' }}
              onClick={() =>
                handleSuccess(
                  t('quickActions.actions.addPatient.title'),
                  t('quickActions.actions.addPatient.description'),
                  patientModal.onClose
                )
              }
            >
              {t(
                'professionalDashboard.overview.quickActions.addPatient.button2'
              )}
            </Button>
          </ThemedModalFooter>
        </ThemedModalContent>
      </Modal>

      {/* ================= Settings ================= */}
      <ActionButton
        onClick={settingsModal.onOpen}
        icon={Settings}
        label={t(
          'professionalDashboard.overview.quickActions.accountSetting.title'
        )}
      />
      <Modal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ThemedModalContent>
          <ThemedModalHeader>
            {t(
              'professionalDashboard.overview.quickActions.accountSetting.title'
            )}
          </ThemedModalHeader>
          <ModalCloseButton color={darkMode ? '#AEE6DA' : 'gray.600'} />
          <ThemedModalBody>
            <FormControl mb={3}>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="Select status"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Notifications</FormLabel>
              <Select
                placeholder="Select notification preference"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              >
                <option value="all">All</option>
                <option value="important">Important only</option>
                <option value="none">None</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Consultation Fee (XOF)</FormLabel>
              <Input
                type="number"
                placeholder="5000"
                bg={darkMode ? '#137657' : 'white'}
                color={darkMode ? '#E2E8F0' : 'gray.800'}
              />
            </FormControl>
          </ThemedModalBody>
          <ThemedModalFooter>
            <Button variant="outline" mr={3} onClick={settingsModal.onClose}>
              {t(
                'professionalDashboard.overview.quickActions.accountSetting.button1'
              )}
            </Button>
            <Button
              bg={darkMode ? '#FA6657' : 'blue.500'}
              color="white"
              _hover={{ bg: darkMode ? '#F7845D' : 'blue.600' }}
              onClick={() =>
                handleSuccess(
                  t('quickActions.actions.accountSetting.title'),
                  t('quickActions.actions.accountSetting.description'),
                  settingsModal.onClose
                )
              }
            >
              {t(
                'professionalDashboard.overview.quickActions.accountSetting.button2'
              )}
            </Button>
          </ThemedModalFooter>
        </ThemedModalContent>
      </Modal>
    </div>
  );
};

export default QuickActions;
