import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

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

const ApplicationCard = ({
  application,
  onApprove,
  onReject,
}: ApplicationCardProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewDocument = (document: any) => {
    toast({
      title: t('applicationCardFixes.Document.title'),
      description: t('applicationCardFixes.Document.description', {
        name: document.name || t('Document.default'),
      }),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            ✅ {t('applicationCardFixes.Status.approved')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            ❌ {t('applicationCardFixes.Status.rejected')}
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            ⏳ {t('applicationCardFixes.Status.pending')}
          </Badge>
        );
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
                <span className="font-medium">
                  {t('applicationCardFixes.Application.specialty')}:
                </span>{' '}
                {application.professional_type}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">
                  {t('applicationCardFixes.Application.location')}:
                </span>{' '}
                {application.city ? `${application.city}, ` : ''}
                {application.country}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">
                  {t('applicationCardFixes.Application.institution')}:
                </span>{' '}
                {application.institution ||
                  t('applicationCardFixes.Application.notSpecified')}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">
                  {t('applicationCardFixes.Application.license')}:
                </span>{' '}
                {application.license_number}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">
                  {t('applicationCardFixes.Application.email')}:
                </span>{' '}
                {application.email}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">
                  {t('applicationCardFixes.Application.date')}:
                </span>{' '}
                {formatDate(application.created_at)}
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
                ❌ {t('applicationCardFixes.Actions.reject')}
              </Button>

              <Button
                onClick={() => onApprove(application.id)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                ✅ {t('applicationCardFixes.Actions.approve')}
              </Button>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h5 className="font-bold mb-3 text-foreground">
            📄 {t('applicationCardFixes.Documents.title')}
          </h5>
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
                  📄{' '}
                  {doc.name ||
                    t('applicationCardFixes.Documents.default', {
                      index: idx + 1,
                    })}
                </Button>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                {t('applicationCardFixes.Documents.none')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
