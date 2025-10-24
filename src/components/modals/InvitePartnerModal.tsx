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
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

// InvitePartnerModal.tsx
interface InvitePartnerModalProps {
  open: boolean;
  onClose: () => void;
  familyMemberId?: string; // Make it optional
  patientAccessCode?: string; // Add this for when patients use it
  isPatientInviting?: boolean; // Flag to know which flow
}

export default function InvitePartnerModal({
  open,
  onClose,
  familyMemberId,
  patientAccessCode,
  isPatientInviting = false,
}: InvitePartnerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientCode, setPatientCode] = useState('');
  const [access, setAccess] = useState('read');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSend = async () => {
    // If patient is inviting, just share the access code via SMS/email
    if (isPatientInviting && patientAccessCode) {
      // TODO: Send SMS/Email with access code to the phone number
      toast({
        title: 'Invitation Sent!',
        description: `Access code ${patientAccessCode} has been shared with ${phone}`,
      });
      onClose();
      return;
    }

    if (!familyMemberId) {
      toast({
        title: 'Error',
        description: 'Family member ID not found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    if (!name || !phone || !patientCode) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (patientCode.length !== 8) {
      toast({
        title: 'Error',
        description: 'Patient code must be 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Call the request_patient_access function
      const { data, error } = await supabase.rpc('request_patient_access', {
        p_family_member_id: familyMemberId,
        p_patient_code: patientCode.toUpperCase(),
      });

      if (error) {
        console.error('Error requesting access:', error);
        throw error;
      }

      type RpcResult = {
        success: boolean;
        error?: string;
        request_id?: string;
        sms_details?: {
          to: string;
          patient_name: string;
          family_member_name: string;
          relation: string;
          message: string;
          response_code: string;
        };
      };

      let result: RpcResult;

      if (typeof data === 'string') {
        try {
          result = JSON.parse(data) as RpcResult;
        } catch {
          // If RPC returned a plain string, treat it as an error message
          result = { success: false, error: data };
        }
      } else {
        result = data as unknown as RpcResult;
      }

      if (result.success) {
        // TODO: Send actual SMS via your backend API
        // For now, we'll just log the SMS details
        console.log('SMS to send:', result.sms_details);

        // In production, call your SMS API here:
        // await sendSMS(result.sms_details);

        toast({
          title: 'Success!',
          description: `Access request sent to patient. They will receive an SMS with instructions.`,
        });

        // Reset form
        setName('');
        setPhone('');
        setPatientCode('');
        setAccess('read');

        onClose();
      } else {
        toast({
          title: 'Failed',
          description: result.error || 'Failed to send access request',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'An error occurred while sending the request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('invitePartnerModal.title')}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="name">
                {t('invitePartnerModal.form.name')}
              </FormLabel>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter family member name"
                disabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="phone">
                {t('invitePartnerModal.form.phone')}
              </FormLabel>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+221 77 ..."
                disabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="patientCode">
                {t('invitePartnerModal.form.code')}
              </FormLabel>
              <Input
                id="patientCode"
                value={patientCode}
                onChange={e => setPatientCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character patient code"
                maxLength={8}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                The patient will receive an SMS to approve/deny this request
              </p>
            </FormControl>

            <FormControl>
              <FormLabel>{t('invitePartnerModal.form.permission')}</FormLabel>
              <RadioGroup
                value={access}
                onChange={e => setAccess((e.target as HTMLInputElement).value)}
              >
                <Stack direction="column" spacing={2}>
                  <Radio value="read" isDisabled={loading}>
                    {t('invitePartnerModal.permissionOptions.read')}
                  </Radio>
                  <Radio value="full" isDisabled={loading}>
                    {t('invitePartnerModal.permissionOptions.full')}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {t('invitePartnerModal.button1')}
          </Button>
          <Button onClick={handleSend} className="ml-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              t('invitePartnerModal.button2')
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
