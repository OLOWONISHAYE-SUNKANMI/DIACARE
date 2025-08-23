import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Select from 'react-select';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfessionalAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfessionalAccessModal = ({ isOpen, onClose }: ProfessionalAccessModalProps) => {
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
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const professionOptions = [
    { value: 'doctor', label: t('professionalAccess.doctor') },
    { value: 'nurse', label: t('professionalAccess.nurse') },
    { value: 'diabetologist', label: t('professionalAccess.diabetologist') },
    { value: 'nutritionist', label: t('professionalAccess.nutritionist') },
    { value: 'pharmacist', label: t('professionalAccess.pharmacist') },
    { value: 'other', label: t('professionalAccess.other') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
          country: 'FR',
          status: 'pending'
        });

      if (error) throw error;

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
        motivation: ''
      });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: t('common.error'),
        description: t('professionalAccess.requestError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('professionalAccess.title')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t('professionalAccess.firstName')}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('professionalAccess.lastName')}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">{t('professionalAccess.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="profession">{t('professionalAccess.profession')}</Label>
            <Select
              value={professionOptions.find(option => option.value === formData.profession) || null}
              onChange={(selectedOption) => 
                setFormData({ ...formData, profession: selectedOption?.value || '' })
              }
              options={professionOptions}
              placeholder={t('professionalAccess.selectProfession')}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              isSearchable={false}
              styles={{
                menuPortal: (base) => ({ 
                  ...base, 
                  zIndex: 9999 
                }),
                control: (base, state) => ({
                  ...base,
                  minHeight: '40px',
                  border: `1px solid ${state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--border))'}`,
                  borderRadius: '6px',
                  backgroundColor: 'hsl(var(--background))',
                  boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'hsl(var(--border))',
                  },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused 
                    ? 'hsl(var(--accent))' 
                    : 'transparent',
                  color: 'hsl(var(--popover-foreground))',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  '&:hover': {
                    backgroundColor: 'hsl(var(--accent))',
                  },
                  '&:active': {
                    backgroundColor: 'hsl(var(--accent))',
                  }
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'hsl(var(--foreground))',
                }),
                placeholder: (base) => ({
                  ...base,
                  color: 'hsl(var(--muted-foreground))',
                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: 'hsl(var(--muted-foreground))',
                  '&:hover': {
                    color: 'hsl(var(--foreground))',
                  }
                })
              }}
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <Label htmlFor="licenseNumber">{t('professionalAccess.licenseNumber')}</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="institution">{t('professionalAccess.institution')}</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="motivation">{t('professionalAccess.motivation')}</Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder={t('professionalAccess.motivationPlaceholder')}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? t('common.sending') : t('common.send')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};