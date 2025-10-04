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

interface InvitePartnerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InvitePartnerModal({ open, onClose }: InvitePartnerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [access, setAccess] = useState('read');

  const handleSend = () => {
    // Here you can integrate API call
    console.log({ name, phone, patientCode, access });
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite Care Partner</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="name">Family Name</FormLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter family name"
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+221 77 ..."
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="patientCode">Patient Code</FormLabel>
              <Input
                id="patientCode"
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                placeholder="Enter patient code"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Access Level</FormLabel>
              <RadioGroup value={access} onChange={setAccess}>
                <Stack direction="column" spacing={2}>
                  <Radio value="read">Read Only</Radio>
                  <Radio value="full">Full Access</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline"  onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            Send Code
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
