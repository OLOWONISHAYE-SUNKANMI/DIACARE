import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
} from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProfessionSelectionModal } from './ProfessionSelectionModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfessionalAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessionalAccessModal = ({
  isOpen,
  onClose,
}: ProfessionalAccessModalProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    licenseNumber: '',
    institution: '',
    motivation: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfessionModalOpen, setIsProfessionModalOpen] = useState(false);

  const getProfessionLabel = (value: string) => {
    const options = {
      doctor: t('professionalAccess.doctor'),
      nurse: t('professionalAccess.nurse'),
      diabetologist: t('professionalAccess.diabetologist'),
      nutritionist: t('professionalAccess.nutritionist'),
      pharmacist: t('professionalAccess.pharmacist'),
      other: t('professionalAccess.other'),
    };
    return options[value as keyof typeof options] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use the table 'professional_applications'
      const { error } = await supabase
        .from('professional_applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          professional_type: formData.profession,
          license_number: formData.licenseNumber,
          institution: formData.institution,
          country: 'FR', // You might want to make this dynamic
          city: '', // Required field, add to form or set default
          documents: [], // Required field for document URLs
          status: 'pending', // Default status for new applications
          reviewed_by: null,
          reviewed_at: null,
          rejection_reason: null,
          professional_code: null, // Will be set by admin when approved
          code_issued_at: null,
          code_expires_at: null,
          user_id: null, // Will be set when professional signs in
        });

      if (error) {
        console.error('Submission error:', error);
        throw error;
      }

      toast({
        title: t('professionalAccess.requestSent'),
        description: t('professionalAccess.requestSentDescription'),
      });

      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profession: '',
        licenseNumber: '',
        institution: '',
        motivation: '',
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: t('common.error'),
        description: t('professionalAccess.requestError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent maxW="4xl" py={6} px={4}>
        <ModalHeader>{t('professionalAccess.title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  {t('professionalAccess.firstName')}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  {t('professionalAccess.lastName')}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">{t('professionalAccess.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">{t('professionalAccess.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={e =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="profession">
                {t('professionalAccess.profession')}
              </Label>

              <Select
                id="profession"
                placeholder={t('professionalAccess.selectProfession')}
                value={formData.profession || ''}
                onChange={e =>
                  setFormData(prev => ({ ...prev, profession: e.target.value }))
                }
                focusBorderColor="teal.500"
                size="md"
                borderRadius="md"
              >
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Diabetologist">Diabetologist</option>
                <option value="General Practitioner">
                  General Practitioner
                </option>
                <option value="Diabetes Nurse">Diabetes Nurse</option>
                <option value="Psychologist">Psychologist</option>
                <option value="Nutritionist">Nutritionist</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="licenseNumber">
                {t('professionalAccess.licenseNumber')}
              </Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={e =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="institution">
                {t('professionalAccess.institution')}
              </Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={e =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="motivation">
                {t('professionalAccess.motivation')}
              </Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={e =>
                  setFormData({ ...formData, motivation: e.target.value })
                }
                placeholder={t('professionalAccess.motivationPlaceholder')}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? t('common.sending') : t('common.send')}
              </Button>
            </div>
          </form>

          <ProfessionSelectionModal
            isOpen={isProfessionModalOpen}
            onClose={() => setIsProfessionModalOpen(false)}
            selectedValue={formData.profession}
            onSelect={value => setFormData({ ...formData, profession: value })}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
