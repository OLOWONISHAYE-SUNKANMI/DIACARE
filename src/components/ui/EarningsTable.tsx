import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Euro, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Earning {
  id: string;
  date: string;
  patient: string;
  consultationType: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: string;
}

export const EarningsTable = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  // Données de démo pour un endocrinologue (600 F CFA par consultation)
  const earnings: Earning[] = [
    {
      id: '1',
      date: '2024-01-15',
      patient: 'Marie D.',
      consultationType: t('professionalDashboard.revenue.consultationType.one'),
      amount: 600,
      platformFee: 60,
      netAmount: 540,
      status: t('professionalDashboard.revenue.status.paid'),
    },
    {
      id: '2',
      date: '2024-01-14',
      patient: 'Pierre M.',
      consultationType: t('professionalDashboard.revenue.consultationType.two'),
      amount: 600,
      platformFee: 60,
      netAmount: 540,
      status: t('professionalDashboard.revenue.status.paid'),
    },
    {
      id: '3',
      date: '2024-01-13',
      patient: 'Sophie L.',
      consultationType: t(
        'professionalDashboard.revenue.consultationType.three'
      ),
      amount: 600,
      platformFee: 60,
      netAmount: 540,
      status: t('professionalDashboard.revenue.status.processing'),
    },
    {
      id: '4',
      date: '2024-01-12',
      patient: 'Jean B.',
      consultationType: t(
        'professionalDashboard.revenue.consultationType.four'
      ),
      amount: 600,
      platformFee: 60,
      netAmount: 540,
      status: t('professionalDashboard.revenue.status.pending'),
    },
    {
      id: '5',
      date: '2024-01-11',
      patient: 'Anne C.',
      consultationType: t(
        'professionalDashboard.revenue.consultationType.five'
      ),
      amount: 600,
      platformFee: 60,
      netAmount: 540,
      status: t('professionalDashboard.revenue.status.paid'),
    },
    {
      id: '6',
      date: '2024-01-10',
      patient: 'Michel R.',
      consultationType: t('professionalDashboard.revenue.consultationType.six'),
      amount: 600,
      platformFee: 60,
      netAmount: 540,
      status: t('professionalDashboard.revenue.status.paid'),
    },
  ];

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEarnings = earnings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(earnings.length / itemsPerPage);

  const totalEarnings = earnings.reduce(
    (sum, earning) => sum + earning.netAmount,
    0
  );
  const monthlyGrowth = '+15%';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case t('professionalDashboard.revenue.status.paid'):
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {t('professionalDashboard.revenue.status.paid')}
          </Badge>
        );
      case t('professionalDashboard.revenue.status.processing'):
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {t('professionalDashboard.revenue.status.processing')}
          </Badge>
        );
      case t('professionalDashboard.revenue.status.pending'):
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            {t('professionalDashboard.revenue.status.pending')}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Euro className="h-5 w-5 mr-2" />
            {t('professionalDashboard.revenue.title')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {monthlyGrowth}
            </span>
            <span className="text-sm text-muted-foreground">
              {t('professionalDashboard.revenue.thisMonth')}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{formatAmount(totalEarnings)}</p>
          <p className="text-sm text-muted-foreground">
            {t('professionalDashboard.revenue.revenueThisMonth')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                {t('professionalDashboard.revenue.tableHeader.grossAmount')}
              </TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Net</TableHead>
              <TableHead>
                {' '}
                {t('professionalDashboard.revenue.tableHeader.status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEarnings.map(earning => (
              <TableRow key={earning.id}>
                <TableCell className="font-medium">
                  {new Date(earning.date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>{earning.patient}</TableCell>
                <TableCell>{earning.consultationType}</TableCell>
                <TableCell>{formatAmount(earning.amount)}</TableCell>
                <TableCell className="text-red-600">
                  -{formatAmount(earning.platformFee)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatAmount(earning.netAmount)}
                </TableCell>
                <TableCell>{getStatusBadge(earning.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, earnings.length)} of {earnings.length} earnings
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm">Rows per page:</span>
              <Input
                type="number"
                min="1"
                max="50"
                value={itemsPerPage}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 5;
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
                className="w-16 h-8 text-center"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
