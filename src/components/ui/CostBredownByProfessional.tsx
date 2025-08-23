import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart } from "lucide-react";

interface CostBreakdown {
  profession: string;
  amount: number;
  percentage: number;
  color: string;
}

export const CostBreakdownByProfessional = () => {
  const costData: CostBreakdown[] = [
    { profession: "Endocrinologue", amount: 600, percentage: 30, color: "bg-primary" },
    { profession: "Médecin généraliste", amount: 500, percentage: 25, color: "bg-blue-500" },
    { profession: "Nutritionniste", amount: 350, percentage: 17.5, color: "bg-green-500" },
    { profession: "Psychologue", amount: 250, percentage: 12.5, color: "bg-yellow-500" },
    { profession: "Infirmière", amount: 300, percentage: 15, color: "bg-purple-500" }
  ];

  const totalAmount = costData.reduce((sum, item) => sum + item.amount, 0);

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()} F CFA`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Répartition des coûts par professionnel de santé
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Coût par patient / par mois
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Visual representation */}
          <div className="space-y-3">
            {costData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <span className="text-sm font-medium">{item.profession}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{formatAmount(item.amount)}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profession</TableHead>
                <TableHead className="text-right">Montant (F CFA)</TableHead>
                <TableHead className="text-right">Pourcentage (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${item.color}`} />
                      {item.profession}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatAmount(item.amount)}</TableCell>
                  <TableCell className="text-right">{item.percentage}%</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{formatAmount(totalAmount)}</TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Summary card */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Coût total mensuel par patient</p>
              <p className="text-2xl font-bold text-primary">{formatAmount(totalAmount)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};