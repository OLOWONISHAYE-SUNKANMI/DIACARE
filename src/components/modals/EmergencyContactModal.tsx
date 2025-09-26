import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

type EmergencyContactModalProps = {
  form: {
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
  };
  loading?: boolean;
  handleChange: (field: string, value: string) => void;
  handleUpdateProfile: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<boolean>;
  trigger?: React.ReactNode;
};

export const EmergencyContactModal: React.FC<EmergencyContactModalProps> = ({
  form,
  loading = false,
  handleChange,
  handleUpdateProfile,
  trigger,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const success = await handleUpdateProfile(e);
    if (success) {
      onClose();
    }
  };

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        <span onClick={onOpen}>{trigger}</span>
      ) : (
        <Button onClick={onOpen}>Edit</Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalHeader fontSize="lg" p={2}>
            Emergency Contact
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={2}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
              {/* Emergency Contact Name */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Contact Name</label>
                <Input
                  size="sm"
                  value={form.emergency_contact_name || ''}
                  onChange={e =>
                    handleChange('emergency_contact_name', e.target.value)
                  }
                  _focus={{
                    borderColor: '#32948f',
                    boxShadow: '0 0 0 1px #32948f',
                  }}
                  _focusVisible={{
                    borderColor: '#32948f',
                    boxShadow: '0 0 0 1px #32948f',
                  }}
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="flex flex-col">
                <label className="text-sm mb-1">Contact Phone</label>
                <Input
                  size="sm"
                  value={form.emergency_contact_phone || ''}
                  onChange={e =>
                    handleChange('emergency_contact_phone', e.target.value)
                  }
                  _focus={{
                    borderColor: '#32948f',
                    boxShadow: '0 0 0 1px #32948f',
                  }}
                  _focusVisible={{
                    borderColor: '#32948f',
                    boxShadow: '0 0 0 1px #32948f',
                  }}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                isDisabled={loading}
                mt={2}
                w="full"
                size="sm"
                bg="#3aa6a1"
                _hover={{ bg: '#32948f' }}
                color="#fff"
              >
                {loading
                  ? t('editProfileModalChanges.common.saving')
                  : t('editProfileModalChanges.common.saveChanges')}
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
