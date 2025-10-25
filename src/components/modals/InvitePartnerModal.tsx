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
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface InvitePartnerModalProps {
  open: boolean;
  onClose: () => void;
  familyMemberId?: string;
  patientAccessCode?: string;
  isPatientInviting?: boolean;
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
  const [profession, setProfession] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [relation, setRelation] = useState('');
  const [access, setAccess] = useState('read_only');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSend = async () => {
    if (isPatientInviting && patientAccessCode) {
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

    if (!name || !phone || !patientCode || !relation) {
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
      // First, update family member profile with additional info
      const { error: updateError } = await supabase
        .from('family_members')
        .update({
          full_name: name,
          phone: phone,
          profession: profession || null,
          city: city || null,
          country: country || null,
          relation: relation,
        })
        .eq('id', familyMemberId);

      if (updateError) {
        console.error('Error updating family member:', updateError);
      }

      // Then request access with permission level
      const { data, error } = await supabase.rpc('request_patient_access', {
        p_family_member_id: familyMemberId,
        p_patient_code: patientCode.toUpperCase(),
        p_permission_level: access, // Pass the permission level
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
          result = { success: false, error: data };
        }
      } else {
        result = data as unknown as RpcResult;
      }

      if (result.success) {
        console.log('SMS to send:', result.sms_details);

        toast({
          title: 'Success!',
          description: `Access request sent with ${
            access === 'read_only' ? 'Read-Only' : 'Full Access'
          } permission.`,
        });

        // Reset form
        setName('');
        setPhone('');
        setPatientCode('');
        setProfession('');
        setCity('');
        setCountry('');
        setRelation('');
        setAccess('read_only');

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
    <Modal isOpen={open} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
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
                placeholder="+234..."
                disabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="relation">Relationship to Patient</FormLabel>
              <Input
                id="relation"
                value={relation}
                onChange={e => setRelation(e.target.value)}
                placeholder="e.g., Son, Daughter, Spouse, Friend"
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
              <FormLabel htmlFor="profession">Profession (Optional)</FormLabel>
              <Input
                id="profession"
                value={profession}
                onChange={e => setProfession(e.target.value)}
                placeholder="Your profession"
                disabled={loading}
              />
            </FormControl>

            <div className="grid grid-cols-2 gap-3">
              <FormControl>
                <FormLabel htmlFor="city">City (Optional)</FormLabel>
                <Input
                  id="city"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Your city"
                  disabled={loading}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="country">Country (Optional)</FormLabel>
                <Input
                  id="country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Your country"
                  disabled={loading}
                />
              </FormControl>
            </div>

            {/* Fixed Radio Group */}
            <FormControl>
              <FormLabel>{t('invitePartnerModal.form.permission')}</FormLabel>
              <RadioGroup value={access} onChange={setAccess}>
                <Stack direction="column" spacing={2}>
                  <Radio value="read_only" isDisabled={loading}>
                    Read-Only Access (View dashboard, data, journal)
                  </Radio>
                  <Radio value="full_access" isDisabled={loading}>
                    Full Access (Can edit and manage data)
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
