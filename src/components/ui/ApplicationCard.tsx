import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfessionalApplication {
  id: string;
  first_name: string;
  last_name: string;
  professional_type: string;
  city?: string;
  country: string;
  documents: any[];
  created_at: string;
  institution?: string;
  license_number: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApplicationCardProps {
  application: ProfessionalApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ApplicationCard = ({ application, onApprove, onReject }: ApplicationCardProps) => {
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewDocument = (document: any) => {
    toast({
      title: "Document",
      description: `Visualisation de ${document.name || 'document'} - Fonctionnalité en développement`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">✅ Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">❌ Rejeté</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">⏳ En attente</Badge>;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-bold text-foreground">
                {application.first_name} {application.last_name}
              </h4>
              {getStatusBadge(application.status)}
            </div>
            
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Spécialité:</span> {application.professional_type}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Localisation:</span> {application.city ? `${application.city}, ` : ''}{application.country}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Institution:</span> {application.institution || 'Non spécifiée'}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">N° Licence:</span> {application.license_number}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span> {application.email}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Candidature du:</span> {formatDate(application.created_at)}
              </p>
            </div>
          </div>
          
          {application.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => onReject(application.id)}
                variant="destructive"
                size="sm"
              >
                ❌ Rejeter
              </Button>
              <Button
                onClick={() => onApprove(application.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                ✅ Approuver
              </Button>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <h5 className="font-bold mb-3 text-foreground">📄 Documents soumis:</h5>
          <div className="flex flex-wrap gap-2">
            {application.documents && application.documents.length > 0 ? (
              application.documents.map((doc: any, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  📄 {doc.name || `Document ${idx + 1}`}
                </Button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                Aucun document uploadé
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;