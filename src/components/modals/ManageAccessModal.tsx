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

interface ManageAccessModalProps {
  open: boolean;
  onClose: () => void;
  memberName: string;
}

export default function ManageAccessModal({ open, onClose, memberName }: ManageAccessModalProps) {
  const [access, setAccess] = useState('read');

  return (
     <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Access for {memberName}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <RadioGroup value={access} onChange={setAccess}>
            <Stack direction="column" spacing={3}>
              <Radio value="read">Read Only</Radio>
              <Radio value="full">Full Access</Radio>
              <Radio value="remove">Remove Access</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={onClose}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
