import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Euro, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProfessionalEarning {
  professional_id: string;
  professional_name: string;
  specialty: string;
  patients_count: number;
  consultations_count: number;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  rate_per_consultation: number;
  status: 'pending' | 'processing' | 'completed';
}

interface MonthlyDistribution {
  month: string;
  year: number;
  total_collected: number;
  platform_commission: number;
  professional_distributions: number;
  status: 'draft' | 'approved' | 'processed';
}

export const RevenueDistribution = () => {
  const [professionalEarnings, setProfessionalEarnings] = useState<ProfessionalEarning[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Données de démonstration pour la distribution des revenus
  const mockEarnings: ProfessionalEarning[] = [
    {
      professional_id: "1",
      professional_name: "Dr. Marie Dubois",
      specialty: "Endocrinologue",
      patients_count: 45,
      consultations_count: 78,
      gross_amount: 46800, // 78 × 600
      platform_fee: 4680, // 10%
      net_amount: 42120,
      rate_per_consultation: 600,
      status: 'pending'
    },
    {
      professional_id: "2",
      professional_name: "Dr. Pierre Martin",
      specialty: "Diabétologue",
      patients_count: 32,
      consultations_count: 65,
      gross_amount: 39000, // 65 × 600
      platform_fee: 3900,
      net_amount: 35100,
      rate_per_consultation: 600,
      status: 'pending'
    },
    {
      professional_id: "3",
      professional_name: "Dr. Sophie Laurent",
      specialty: "Nutritionniste",
      patients_count: 28,
      consultations_count: 52,
      gross_amount: 20800, // 52 × 400
      platform_fee: 2080,
      net_amount: 18720,
      rate_per_consultation: 400,
      status: 'pending'
    },
    {
      professional_id: "4",
      professional_name: "Dr. Jean Moreau",
      specialty: "Cardiologue",
      patients_count: 38,
      consultations_count: 71,
      gross_amount: 56800, // 71 × 800
      platform_fee: 5680,
      net_amount: 51120,
      rate_per_consultation: 800,
      status: 'completed'
    }
  ];

  const mockMonthlyStats: MonthlyDistribution = {
    month: 'Janvier',
    year: 2024,
    total_collected: 163400,
    platform_commission: 16340,
    professional_distributions: 147060,
    status: 'draft'
  };

  useEffect(() => {
    setProfessionalEarnings(mockEarnings);
    setMonthlyStats(mockMonthlyStats);
  }, [selectedMonth, selectedYear]);

  const handleProcessDistribution = async () => {
    setIsLoading(true);
    try {
      // Simuler le traitement de la distribution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mettre à jour le statut
      const updatedEarnings = professionalEarnings.map(earning => ({
        ...earning,
        status: 'processing' as const
      }));
      setProfessionalEarnings(updatedEarnings);
      
      if (monthlyStats) {
        setMonthlyStats({
          ...monthlyStats,
          status: 'approved'
        });
      }

      toast({
        title: "Distribution approuvée",
        description: "La distribution des revenus a été approuvée et sera traitée sous 24h.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'approbation de la distribution.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Payé</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700"><Clock className="w-3 h-3 mr-1" />En traitement</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><AlertCircle className="w-3 h-3 mr-1" />En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDistributionStatusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-700">Traité</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700">Approuvé</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Brouillon</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalPending = professionalEarnings
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.net_amount, 0);

  const totalProfessionals = professionalEarnings.length;
  const totalPatients = professionalEarnings.reduce((sum, e) => sum + e.patients_count, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques mensuelles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Revenus collectés</p>
                <p className="text-2xl font-bold">{formatAmount(monthlyStats?.total_collected || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Euro className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">À redistribuer</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Professionnels</p>
                <p className="text-2xl font-bold">{totalProfessionals}</p>
                <p className="text-xs text-muted-foreground">{totalPatients} patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Commission</p>
                <p className="text-2xl font-bold">{formatAmount(monthlyStats?.platform_commission || 0)}</p>
                <p className="text-xs text-muted-foreground">10% des revenus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution mensuelle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Distribution {monthlyStats?.month} {monthlyStats?.year}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {getDistributionStatusBadge(monthlyStats?.status || 'draft')}
              {monthlyStats?.status === 'draft' && (
                <Button onClick={handleProcessDistribution} disabled={isLoading}>
                  {isLoading ? 'Traitement...' : 'Approuver la distribution'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total collecté</p>
                <p className="text-lg font-semibold">{formatAmount(monthlyStats?.total_collected || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Commission plateforme</p>
                <p className="text-lg font-semibold text-orange-600">{formatAmount(monthlyStats?.platform_commission || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">À redistribuer</p>
                <p className="text-lg font-semibold text-green-600">{formatAmount(monthlyStats?.professional_distributions || 0)}</p>
              </div>
            </div>
            
            <Progress value={90} className="w-full" />
            <p className="text-sm text-muted-foreground">
              90% des paiements du mois traités
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Table des gains par professionnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Détail par professionnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Professionnel</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Consultations</TableHead>
                <TableHead>Tarif/consultation</TableHead>
                <TableHead>Revenus bruts</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Net à payer</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionalEarnings.map((earning) => (
                <TableRow key={earning.professional_id}>
                  <TableCell className="font-medium">{earning.professional_name}</TableCell>
                  <TableCell>{earning.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {earning.patients_count}
                    </div>
                  </TableCell>
                  <TableCell>{earning.consultations_count}</TableCell>
                  <TableCell>{formatAmount(earning.rate_per_consultation)}</TableCell>
                  <TableCell className="font-medium">{formatAmount(earning.gross_amount)}</TableCell>
                  <TableCell className="text-red-600">-{formatAmount(earning.platform_fee)}</TableCell>
                  <TableCell className="font-bold text-green-600">{formatAmount(earning.net_amount)}</TableCell>
                  <TableCell>{getStatusBadge(earning.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="flex space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exporter le rapport
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Exporter le rapport de distribution</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Le rapport inclura :</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Détail des revenus par professionnel</li>
                <li>Répartition des commissions</li>
                <li>Historique des paiements</li>
                <li>Statistiques mensuelles</li>
              </ul>
              <div className="flex space-x-2">
                <Button variant="outline">PDF</Button>
                <Button variant="outline">Excel</Button>
                <Button>Email automatique</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Historique des distributions
        </Button>
      </div>
    </div>
  );
};