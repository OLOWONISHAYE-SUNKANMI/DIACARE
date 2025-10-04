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
  Stack,
} from "@chakra-ui/react";

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  

  return (
     <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('manageAccessModal.title')} {memberName}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RadioGroup value={access} onChange={setAccess}>
            <Stack direction="column" spacing={3}>
              <Radio value="read">{t('manageAccessModal.radio1')}</Radio>
              <Radio value="full">{t('manageAccessModal.radio2')}</Radio>
              <Radio value="remove">{t('manageAccessModal.radio3')}</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" style={{ marginRight: '12px' }} onClick={onClose}>
          {t('manageAccessModal.button1')}
          </Button>
          <Button variant="default" onClick={onClose}>
            {t('manageAccessModal.button2')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
