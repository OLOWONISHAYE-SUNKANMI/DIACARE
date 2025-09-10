import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

interface Payment {
  id: string;
  doctor: string;
  amount: number;
  consultations: number;
  date: string;
  status: 'paid' | 'pending' | 'processing';
}

interface PaymentRowProps {
  payment: Payment;
  onStatusChange?: () => void;
}

const PaymentRow = ({ payment, onStatusChange }: PaymentRowProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleProcessPayment = async () => {
    try {
      // Call edge function to process payment
      const { data, error } = await supabase.functions.invoke(
        'process-professional-payment',
        {
          body: {
            paymentId: payment.id,
            amount: payment.amount,
            doctorName: payment.doctor,
          },
        }
      );

      if (error) throw error;

      toast({
        title: t('paymentRow.payment.successTitle'),
        description: t('paymentRow.payment.successDescription', {
          amount: payment.amount,
          doctor: payment.doctor,
        }),
      });

      onStatusChange?.();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: t('paymentRow.payment.errorTitle'),
        description: t('paymentRow.payment.errorDescription'),
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            ✅ {t('paymentRow.status.paid')}
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            🔄 {t('paymentRow.status.processing')}
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            ⏳ {t('paymentRow.status.pending')}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-3">
        <div className="font-medium">{payment.doctor}</div>
        <div className="text-sm text-muted-foreground">ID: {payment.id}</div>
      </td>
      <td className="p-3">
        <span className="font-medium">{payment.consultations}</span>
        <span className="text-sm text-muted-foreground ml-1">
          consultations
        </span>
      </td>
      <td className="p-3">
        <span className="font-bold text-green-600">
          {payment.amount.toLocaleString()} F CFA
        </span>
      </td>
      <td className="p-3">
        <span className="text-sm">{formatDate(payment.date)}</span>
      </td>
      <td className="p-3">{getStatusBadge(payment.status)}</td>
      <td className="p-3">
        {payment.status === 'pending' && (
          <Button
            size="sm"
            onClick={handleProcessPayment}
            className="bg-green-600 hover:bg-green-700"
          >
            💸 {t('paymentRow.payment.pay')}
          </Button>
        )}
        {payment.status === 'paid' && (
          <Button size="sm" variant="outline" className="text-xs">
            📄 {t('paymentRow.payment.receipt')}
          </Button>
        )}
      </td>
    </tr>
  );
};

export default PaymentRow;
