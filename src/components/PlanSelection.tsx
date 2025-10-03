import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Users, Heart, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/ui/LanguageToggle';
import PaymentPlan from './PaymentPlan';

interface SubscriptionPlan {
  id: string;
  name: string;
  price_eur: number;
  description: string;
  features: any; // JSONB from database
  max_consultations_per_month: number;
  max_family_members: number;
}

interface PlanSelectionProps {
  onPlanSelected: (planId: string) => void;
  onClose: () => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({
  onPlanSelected,
  onClose,
}) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_eur');

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: t('planSelection.plans_error_title'),
        description: t('planSelection.plans_error_description'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      onPlanSelected(selectedPlan.id);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-center mt-4">{t('planSelection.loading_plans')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col min-h-screen">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {t('planSelection.choose_plan_title')}
          </h2>
          <div>
            <LanguageToggle />
          </div>
          <Button variant="outline" onClick={onClose}>
            {t('planSelection.cancel')}
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          {t('planSelection.choose_plan_description')}
        </p>
      </div>

      {/* Plans Grid */}
      <PaymentPlan
        plans={plans}
        selectedPlan={selectedPlan?.id}
        onPlanSelect={handlePlanSelect}
      />

      {/* Footer */}
      <div className="p-6 border-t flex justify-between items-center">
        <Button variant="outline" onClick={onClose}>
          {t('planSelection.cancel')}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!selectedPlan}
          className="min-w-[120px]"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {t('planSelection.continue')}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Secure Payment Info */}
      <div className="p-6 bg-muted/50 border-t">
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">{t('planSelection.payment_secure')}</p>
          <p>{t('planSelection.payment_method_card')}</p>
          <p>{t('planSelection.payment_method_mobile')}</p>
          <p>{t('planSelection.payment_method_bank')}</p>
          <p>{t('planSelection.payment_method_patient_code')}</p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
