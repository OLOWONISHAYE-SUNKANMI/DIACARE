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
import { useTranslation } from 'react-i18next';
import { Check, Users, Heart } from 'lucide-react';
import { CurrencyConverter } from '@/utils/CurrencyConverter';

const PaymentPlan = ({ plans, selectedPlan, onPlanSelect }) => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    // Get selected country from localStorage
    const country = localStorage.getItem('selectedCountry');
    setSelectedCountry(country);
  }, []);

  const formatPrice = (eurPrice: number) => {
    if (!selectedCountry) {
      return `${(eurPrice / 100).toFixed(0)}€`;
    }
    const converted = CurrencyConverter.convertPrice(
      eurPrice / 100,
      selectedCountry
    );
    return converted.formatted;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(plan => {
          const isPatientPlan = plan.max_family_members === 0;
          const isSelected = selectedPlan === plan.id;

          // 🔑 Use correct plan key for interpolation
          const planKey = isPatientPlan
            ? 'paymentPlan.patientPlan'
            : 'paymentPlan.familyPlan';

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-200 cursor-pointer border-2 ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onPlanSelect(plan)}
            >
              {/* Recommended Badge for Family Plan */}
              {!isPatientPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground m-5">
                    {t('planSelection.badge_recommended_family')}
                  </Badge>
                </div>
              )}

              {/* Header */}
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                  {isPatientPlan ? (
                    <Heart className="w-8 h-8 text-primary" />
                  ) : (
                    <Users className="w-8 h-8 text-primary" />
                  )}
                </div>

                <CardTitle className="text-xl">
                  {t(`${planKey}.title`)}
                </CardTitle>
                <CardDescription className="text-sm">
                  {t(`${planKey}.subtitle`)}
                </CardDescription>

                <div className="mt-4">
                  <div className="text-3xl font-bold text-foreground">
                    {formatPrice(plan.price_eur)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(`${planKey}.pricePerMonth`)}
                  </div>
                </div>


                  {/* Description for each plan */}
                  <p className="mt-3 text-sm text-muted-foreground px-2 text-left">
                    {isPatientPlan
                      ? t('planSelection.patient_description')
                      : t('planSelection.family_description')} 
                  </p>
                  
              </CardHeader>

              {/* Features */}
              <CardContent className="space-y-4">

                 {/* Included Features Heading */}
                  <h4 className="text-base font-semibold text-foreground mb-2">
                    {t('planSelection.includeFeatures')}
                  </h4>

                <div className="space-y-3">
                  {(
                    isPatientPlan
                      ? [
                         t('planSelection.patientFeatures.predictiveAlert'),
                         t('planSelection.patientFeatures.glucoseTracking'),
                         t('planSelection.patientFeatures.insights'),
                         t('planSelection.patientFeatures.chat'),
                         t('planSelection.patientFeatures.insights'),
                         t('planSelection.patientFeatures.blog'),
                         t('planSelection.patientFeatures.reminder'),
                         t('planSelection.patientFeatures.mood'),
                        ]
                      : [
                          t('planSelection.familyFeatures.allFeatures'),
                          t('planSelection.familyFeatures.dataSharing'),
                          t('planSelection.familyFeatures.alert'),
                          t('planSelection.familyFeatures.dashboard'),
                          t('planSelection.familyFeatures.family'),
                          t('planSelection.familyFeatures.coaching'),
                          t('planSelection.familyFeatures.support'),
                          t('planSelection.familyFeatures.report'),
                        ]
                  ).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4 border-t">
                  <Button
                    className={`w-full ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                    onClick={() => onPlanSelect(plan)}
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
    </div>
  );
};

export default PaymentPlan;
