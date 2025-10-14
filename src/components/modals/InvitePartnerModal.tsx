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
  FormControl,
  FormLabel,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface InvitePartnerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InvitePartnerModal({ open, onClose }: InvitePartnerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [access, setAccess] = useState('read');

  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSend = () => {
    // Here you can integrate API call
    console.log({ name, phone, patientCode, access });
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('invitePartnerModal.title')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="name">{t('invitePartnerModal.form.name')}</FormLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter family name"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="phone">{t('invitePartnerModal.form.phone')}</FormLabel>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 ..."
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="patientCode">{t('invitePartnerModal.form.code')}</FormLabel>
              <Input
                id="patientCode"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                placeholder="Enter patient code"
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('invitePartnerModal.form.permission')}</FormLabel>
              <RadioGroup value={access} onChange={(e) => setAccess((e.target as HTMLInputElement).value)}>
                <Stack direction="column" spacing={2}>
                  <Radio value="read">{t('invitePartnerModal.permissionOptions.read')}</Radio>
                  <Radio value="full">{t('invitePartnerModal.permissionOptions.full')}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline"  onClick={onClose}>
           {t('invitePartnerModal.button1')}
          </Button>
          <Button onClick={handleSend} className="ml-2">
           {t('invitePartnerModal.button2')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
