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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
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
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      onPlanSelected(selectedPlan);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('planSelection.choose_plan_title')}
            </h2>
            <p className="text-muted-foreground">
              {t('planSelection.choose_plan_description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map(plan => {
              const isPatientPlan = plan.max_family_members === 0;
              const isSelected = selectedPlan === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`relative transition-all duration-200 cursor-pointer border-2 ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {!isPatientPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        {t('planSelection.badge_recommended_family')}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                      {isPatientPlan ? (
                        <Heart className="w-8 h-8 text-primary" />
                      ) : (
                        <Users className="w-8 h-8 text-primary" />
                      )}
                    </div>

                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>

                    <div className="mt-4">
                      <div className="text-3xl font-bold text-foreground">
                        {(plan.price_eur / 100).toFixed(0)}€
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('planSelection.per_month')}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {Array.isArray(plan.features)
                        ? plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-success" />
                              </div>
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                            </div>
                          ))
                        : null}
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        className={`w-full ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            {t('planSelection.selected')}
                          </>
                        ) : (
                          t('planSelection.choose_this_plan')
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!selectedPlan}
              className="min-w-[120px]"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Continuer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">{t('payment_secure')}</p>
              <p>{t('planSelection.payment_method_card')}</p>
              <p>{t('planSelection.payment_method_mobile')}</p>
              <p>{t('planSelection.payment_method_bank')}</p>
              <p>{t('planSelectioN.payment_method_patient_code')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
