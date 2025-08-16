import { Pill, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DosesScreen = () => {
  return (
    <div className="flex-1 p-4 space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Pill className="w-6 h-6 text-medical-teal" />
          <span>Doses</span>
        </h2>
        <p className="text-muted-foreground">Gérez vos doses d'insuline</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-foreground">
            <Clock className="w-5 h-5 text-medical-teal" />
            <span>Rappels Insuline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Gestion des doses à venir...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DosesScreen;