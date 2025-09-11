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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle,
  Download,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Mail,
  Calendar,
  Clock,
  Wallet,
  PieChart,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

// Interface definitions for TypeScript support
interface ProfessionalEarning {
  id: string;
  professionalName: string;
  speciality: string;
  consultationsCount: number;
  patientsCount: number;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'paid';
  currency: string;
}

interface RevenueDistributionConfig {
  plan_name: string;
  plan_price_cfa: number;
  professional_amount_cfa: number;
  app_fees_cfa: number;
  payment_platform_amount_cfa: number;
  net_profit_cfa: number;
  buffer_amount_cfa: number;
  reinvestment_amount_cfa: number;
}

interface MonthlyDistribution {
  id?: string;
  month_year: string;
  total_subscriptions: number;
  total_revenue_cfa: number;
  total_professional_payments_cfa: number;
  total_app_fees_cfa: number;
  total_platform_fees_cfa: number;
  total_net_profit_cfa: number;
  total_reinvestment_cfa: number;
  distribution_status: string; // Accept any string from database
  approved_at?: string;
  approved_by?: string;
  distributed_at?: string;
  created_at?: string;
  updated_at?: string;
}

const RevenueDistribution: React.FC = () => {
  const { t } = useTranslation();
  const [professionalEarnings, setProfessionalEarnings] = useState<
    ProfessionalEarning[]
  >([]);
  const [monthlyDistribution, setMonthlyDistribution] =
    useState<MonthlyDistribution | null>(null);
  const [distributionConfig, setDistributionConfig] = useState<
    RevenueDistributionConfig[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM format
  const { toast } = useToast();

  useEffect(() => {
    loadDistributionConfig();
    loadMonthlyDistribution();
  }, [selectedMonth]);

  const loadDistributionConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('revenue_distribution_config')
        .select('*')
        .order('plan_name');

      if (error) throw error;
      setDistributionConfig(data || []);
    } catch (error) {
      console.error('Error loading distribution config:', error);
      toast({
        title: t('revenueDistribution.toast.errorTitle'),
        description: t('revenueDistribution.toast.configLoadError'),
        variant: 'destructive',
      });
    }
  };

  const loadMonthlyDistribution = async () => {
    try {
      setLoading(true);

      // First try to get existing distribution
      const { data: existingData, error: existingError } = await supabase
        .from('monthly_revenue_distribution')
        .select('*')
        .eq('month_year', selectedMonth)
        .single();

      if (existingData) {
        setMonthlyDistribution(existingData);
      } else {
        // Calculate new distribution
        const { data, error } = await supabase.rpc(
          'calculate_monthly_revenue_distribution',
          {
            _month_year: selectedMonth,
          }
        );

        if (error) throw error;

        // Load the calculated distribution
        const { data: calculatedData, error: loadError } = await supabase
          .from('monthly_revenue_distribution')
          .select('*')
          .eq('month_year', selectedMonth)
          .single();

        if (loadError && loadError.code !== 'PGRST116') throw loadError;
        setMonthlyDistribution(calculatedData);
      }

      // Load mock professional earnings for display
      loadMockProfessionalEarnings();
    } catch (error) {
      console.error('Error loading monthly distribution:', error);
      toast({
        title: t('revenueDistribution.toast.errorTitle'),
        description: t('revenueDistribution.toast.loadError', {
          item: t('revenueDistribution.toast.monthlyDistribution'),
        }),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMockProfessionalEarnings = () => {
    // Mock data for professional earnings display
    const mockEarnings: ProfessionalEarning[] = [
      {
        id: '1',
        professionalName: 'Dr. Aminata Diallo',
        speciality: t('revenueDistribution.specialities.endocrinologist'),
        consultationsCount: 15,
        patientsCount: 12,
        grossAmount: 15000,
        platformFee: 1500,
        netAmount: 13500,
        status: 'pending',
        currency: 'XOF',
      },
      {
        id: '2',
        professionalName: 'Dr. Mamadou Sow',
        speciality: t('revenueDistribution.specialities.general_practitioner'),
        consultationsCount: 18,
        patientsCount: 14,
        grossAmount: 18000,
        platformFee: 1800,
        netAmount: 16200,
        status: 'approved',
        currency: 'XOF',
      },
    ];

    setProfessionalEarnings(mockEarnings);
  };

  const handleProcessDistribution = async () => {
    try {
      if (!monthlyDistribution) return;

      const { error } = await supabase
        .from('monthly_revenue_distribution')
        .update({
          distribution_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('month_year', monthlyDistribution.month_year);

      if (error) throw error;

      setMonthlyDistribution({
        ...monthlyDistribution,
        distribution_status: 'approved',
      });

      toast({
        title: t('revenueDistribution.distribution.approved.title'),
        description: t('revenueDistribution.distribution.approved.description'),
      });
    } catch (error) {
      console.error('Error approving distribution:', error);
      toast({
        title: t('revenueDistribution.error.title'),
        description: t('revenueDistribution.distribution.error'),
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-success/20 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('revenueDistribution.status.paid')}
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-primary/20 text-primary">
            <Clock className="w-3 h-3 mr-1" />
            {t('revenueDistribution.status.approved')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {t('revenueDistribution.status.pending')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t(`revenueDistribution.status.${status}`, status)}
          </Badge>
        );
    }
  };

  const getDistributionStatusBadge = (status: string) => {
    switch (status) {
      case 'distributed':
        return (
          <Badge className="bg-success/20 text-success">
            {t('revenueDistribution.distributionStatus.distributed')}
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-primary/20 text-primary">
            {t('revenueDistribution.distributionStatus.approved')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline">
            {t('revenueDistribution.distributionStatus.pending')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t(`revenueDistribution.distributionStatus.${status}`, status)}
          </Badge>
        );
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (monthYear: string): string => {
    const date = new Date(monthYear + '-01');
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('revenueDistribution.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('revenueDistribution.description')}
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, i) => {
                const date = new Date();
                date.setMonth(i);
                const monthValue = `${date.getFullYear()}-${String(i + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('fr-FR', {
                  month: 'long',
                });
                return (
                  <SelectItem key={monthValue} value={monthValue}>
                    {monthName} {date.getFullYear()}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadMonthlyDistribution}>
            <TrendingUp className="w-4 h-4 mr-2" />
            {t('revenueDistribution.refresh')}
          </Button>
        </div>
      </div>

      {/* Distribution Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {distributionConfig.map(config => (
          <Card key={config.plan_name} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                {t('revenueDistribution.plan', { planName: config.plan_name })}
              </CardTitle>
              <CardDescription>
                {t('revenueDistribution.autoDistribution', {
                  amount: formatAmount(config.plan_price_cfa),
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">
                    {t('revenueDistribution.professionals')}
                  </div>
                  <div className="font-medium">
                    {formatAmount(config.professional_amount_cfa)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(
                      (config.professional_amount_cfa / config.plan_price_cfa) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground">
                    {t('revenueDistribution.appMaintenance')}
                  </div>
                  <div className="font-medium">
                    {formatAmount(config.app_fees_cfa)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(
                      (config.app_fees_cfa / config.plan_price_cfa) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground">
                    {t('revenueDistribution.paymentPlatform')}
                  </div>
                  <div className="font-medium">
                    {formatAmount(config.payment_platform_amount_cfa)}
                  </div>
                  <div className="text-xs text-muted-foreground">2.9%</div>
                </div>

                <div>
                  <div className="text-muted-foreground">
                    {t('revenueDistribution.netProfit')}
                  </div>
                  <div className="font-medium text-success">
                    {formatAmount(config.net_profit_cfa)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(
                      (config.net_profit_cfa / config.plan_price_cfa) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>

                {config.reinvestment_amount_cfa > 0 && (
                  <div className="col-span-2">
                    <div className="text-muted-foreground">
                      {t('revenueDistribution.reinvestment')}
                    </div>
                    <div className="font-medium text-primary">
                      {formatAmount(config.reinvestment_amount_cfa)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(
                        (config.reinvestment_amount_cfa /
                          config.plan_price_cfa) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Statistics Cards */}
      {monthlyDistribution && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('revenueDistribution.distributionCards.totalRevenue')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(monthlyDistribution.total_revenue_cfa)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('revenueDistribution.distributionCards.subscriptions', {
                  count: monthlyDistribution.total_subscriptions,
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('revenueDistribution.distributionCards.professionals')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatAmount(
                  monthlyDistribution.total_professional_payments_cfa
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('revenueDistribution.distributionCards.toRedistribute')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('revenueDistribution.distributionCards.netProfit')}
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatAmount(monthlyDistribution.total_net_profit_cfa)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('revenueDistribution.distributionCards.fixedShare', {
                  amount: 2500,
                })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('revenueDistribution.distributionCards.reinvestment')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatAmount(monthlyDistribution.total_reinvestment_cfa)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t(
                  'revenueDistribution.distributionCards.marketingDevelopment'
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Distribution Status */}
      {monthlyDistribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('distributionCard.title', {
                month: getMonthName(monthlyDistribution.month_year),
              })}
            </CardTitle>
            <CardDescription>
              {t('revenueDistribution.distributionCard.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">
                  {t('revenueDistribution.distributionCard.appFees')}
                </div>
                <div className="font-medium">
                  {formatAmount(monthlyDistribution.total_app_fees_cfa)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  {t('revenueDistribution.distributionCard.platformFees')}
                </div>
                <div className="font-medium">
                  {formatAmount(monthlyDistribution.total_platform_fees_cfa)}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">
                  {t('revenueDistribution.distributionCard.netProfit')}
                </div>
                <div className="font-medium text-success">
                  {formatAmount(monthlyDistribution.total_net_profit_cfa)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t('revenueDistribution.distributionCard.progress')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('revenueDistribution.distributionCard.distributionStatus')}{' '}
                  {getDistributionStatusBadge(
                    monthlyDistribution.distribution_status
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {formatAmount(
                    monthlyDistribution.total_professional_payments_cfa
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('revenueDistribution.distributionCard.toProfessionals')}
                </p>
              </div>
            </div>

            <Progress
              value={
                monthlyDistribution.distribution_status === 'pending'
                  ? 30
                  : monthlyDistribution.distribution_status === 'approved'
                    ? 70
                    : 100
              }
              className="w-full"
            />

            <div className="flex justify-between items-center pt-4">
              <div className="flex space-x-2">
                {getDistributionStatusBadge(
                  monthlyDistribution.distribution_status
                )}
              </div>

              {monthlyDistribution.distribution_status === 'pending' && (
                <Button
                  onClick={handleProcessDistribution}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t(
                    'revenueDistribution.distributionCard.approveDistribution'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('revenueDistribution.earningsCard.title')}
          </CardTitle>
          <CardDescription>
            {t('revenueDistribution.earningsCard.description')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t('revenueDistribution.earningsCard.professional')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.speciality')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.consultations')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.patients')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.grossAmount')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.platformFee')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.netAmount')}
                </TableHead>
                <TableHead>
                  {t('revenueDistribution.earningsCard.status')}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {professionalEarnings.map(earning => (
                <TableRow key={earning.id}>
                  <TableCell className="font-medium">
                    {earning.professionalName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{earning.speciality}</Badge>
                  </TableCell>
                  <TableCell>{earning.consultationsCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      {earning.patientsCount}
                    </div>
                  </TableCell>
                  <TableCell>{formatAmount(earning.grossAmount)}</TableCell>
                  <TableCell className="text-destructive">
                    -{formatAmount(earning.platformFee)}
                  </TableCell>
                  <TableCell className="font-bold text-success">
                    {formatAmount(earning.netAmount)}
                  </TableCell>
                  <TableCell>{getStatusBadge(earning.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t('revenueDistribution.actions.exportPDF')}
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t('revenueDistribution.actions.reportExcel')}
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {t('revenueDistribution.actions.sendEmail')}
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t('revenueDistribution.actions.history')}
        </Button>
      </div>
    </div>
  );
};

export default RevenueDistribution;
