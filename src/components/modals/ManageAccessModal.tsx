'use client';

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ManageAccessModalProps {
  open: boolean;
  onClose: () => void;
  memberName: string;
}

export default function ManageAccessModal({ open, onClose, memberName }: ManageAccessModalProps) {
  const [access, setAccess] = useState('read');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = () => {
    console.log("Selected access:", access);
    toast({
      title: "Access updated",
      description: `Access level set to "${access}" for ${memberName}`,
      variant: "default",
    });
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t('manageAccessModal.title')} {memberName}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <RadioGroup value={access} onChange={setAccess}>
              <Stack direction="column" spacing={3}>
                <Radio value="read">{t('manageAccessModal.radio1')}</Radio>
                <Radio value="full">{t('manageAccessModal.radio2')}</Radio>
                <Radio value="remove">{t('manageAccessModal.radio3')}</Radio>
              </Stack>
            </RadioGroup>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            {t('manageAccessModal.button1')}
          </Button>
          <Button colorScheme="blue" type="submit" onClick={handleSubmit}>
            {t('manageAccessModal.button2')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
