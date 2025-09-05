import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Calendar,
  Award,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  professional_type: string;
  license_number: string;
  institution: string;
  country: string;
  city: string;
  documents: string[];
  status: string;
  created_at: string;
}

interface ApplicationCardProps {
  application: Application;
  onSelect: (application: Application) => void;
  onApprove: (application: Application) => void;
  onReject: (application: Application) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onSelect,
  onApprove,
  onReject,
}) => {
  const { t } = useTranslation();
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSpecialtyIcon = (type: string) => {
    switch (type) {
      case 'endocrinologist':
        return '🩺';
      case 'diabetologist':
        return '💉';
      case 'nutritionist':
        return '🥗';
      case 'general_practitioner':
        return '👨‍⚕️';
      case 'nurse':
        return '👩‍⚕️';
      case 'pharmacist':
        return '💊';
      case 'psychologist':
        return '🧠';
      case 'podiatrist':
        return '🦶';
      default:
        return '⚕️';
    }
  };

  const getSpecialtyLabel = (type: string) => {
    const labels = {
      endocrinologist: t('applicationCard.professional_endocrinologist'),
      diabetologist: t('applicationCard.professional_diabetologist'),
      nutritionist: t('applicationCard.professional_nutritionist'),
      general_practitioner: t(
        'applicationCard.professional_generalPractitioner'
      ),
      nurse: t('applicationCard.professional_nurse'),
      pharmacist: t('applicationCard.professional_pharmacist'),
      psychologist: t('applicationCard.professional_psychologist'),
      podiatrist: t('applicationCard.professional_podiatrist'),
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-status-warning animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 bg-gradient-medical text-primary-foreground">
            <AvatarFallback className="bg-transparent text-primary-foreground font-bold">
              {getInitials(application.first_name, application.last_name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-lg font-bold text-foreground">
              Dr. {application.first_name} {application.last_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-lg">
                {getSpecialtyIcon(application.professional_type)}
              </span>
              <span>{getSpecialtyLabel(application.professional_type)}</span>
            </div>
          </div>
        </div>

        <Badge
          variant="outline"
          className="bg-status-warning-bg text-status-warning border-status-warning/20"
        >
          <Clock className="h-3 w-3 mr-1" />
          {t('applicationCard.badge_pending')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{application.email}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{application.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {application.city}, {application.country}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span className="truncate">
            {application.institution || t('applicationCard.notSpecified')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <Calendar className="h-3 w-3" />
        <span>
          {t('applicationCard.application_submitted')}{' '}
          {formatDistanceToNow(new Date(application.created_at), {
            addSuffix: true,
            locale: fr,
          })}
        </span>
      </div>

      <Separator className="mb-4" />

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelect(application)}
          className="flex-1 min-w-24"
        >
          <FileText className="h-4 w-4 mr-1" />
          Examiner
        </Button>

        <Button
          size="sm"
          onClick={() => onApprove(application)}
          className="bg-success text-success-foreground hover:bg-success/90 flex-1 min-w-24"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          {t('applicationCard.button_approve')}
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onReject(application)}
          className="flex-1 min-w-24"
        >
          <XCircle className="h-4 w-4 mr-1" />
          {t('applicationCard.button_reject')}
        </Button>
      </div>
    </Card>
  );
};

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
}) => {
  const getSpecialtyIcon = (type: string) => {
    switch (type) {
      case 'endocrinologist':
        return '🩺';
      case 'diabetologist':
        return '💉';
      case 'nutritionist':
        return '🥗';
      case 'general_practitioner':
        return '👨‍⚕️';
      case 'nurse':
        return '👩‍⚕️';
      case 'pharmacist':
        return '💊';
      case 'psychologist':
        return '🧠';
      case 'podiatrist':
        return '🦶';
      default:
        return '⚕️';
    }
  };

  const { t } = useTranslation();

  const getSpecialtyLabel = (type: string) => {
    const labels = {
      endocrinologist: t('applicationCard.professional_endocrinologist'),
      diabetologist: t('applicationCard.professional_diabetologist'),
      nutritionist: t('applicationCard.professional_nutritionist'),
      general_practitioner: t(
        'applicationCard.professional_generalPractitioner'
      ),
      nurse: t('applicationCard.professional_nurse'),
      pharmacist: t('applicationCard.professional_pharmacist'),
      psychologist: t('applicationCard.professional_psychologist'),
      podiatrist: t('applicationCard.professional_podiatrist'),
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Card className="p-6 sticky top-6">
      <div className="text-center mb-6">
        <Avatar className="h-20 w-20 mx-auto mb-3 bg-gradient-medical text-primary-foreground">
          <AvatarFallback className="bg-transparent text-primary-foreground font-bold text-xl">
            {`${application.first_name.charAt(0)}${application.last_name.charAt(0)}`.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-xl font-bold text-foreground">
          Dr. {application.first_name} {application.last_name}
        </h2>

        <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
          <span className="text-xl">
            {getSpecialtyIcon(application.professional_type)}
          </span>
          <span className="font-medium">
            {getSpecialtyLabel(application.professional_type)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('applicationCard.personalInfo_title')}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('applicationCard.personalInfo_email')}
              </span>
              <span className="font-medium text-right text-foreground">
                {application.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('applicationCard.personalInfo_phone')}
              </span>
              <span className="font-medium text-foreground">
                {application.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('applicationCard.personalInfo_location')}
              </span>
              <span className="font-medium text-right text-foreground">
                {application.city}, {application.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          <Award className="h-4 w-4" />
          {t('applicationCard.professionalQualifications_title')}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t('applicationCard.professionalQualifications_licenseNumber')}
            </span>
            <span className="font-medium font-mono text-foreground">
              {application.license_number}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t('applicationCard.professionalQualifications_institution')}
            </span>
            <span className="font-medium text-right text-foreground">
              {application.institution || t('applicationCard.notSpecified')}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t('applicationCard.documents_title')} (
          {application.documents?.length || 0})
        </h3>

        {application.documents && application.documents.length > 0 ? (
          <div className="space-y-2">
            {application.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-medical-blue" />
                  <span className="text-sm text-foreground">
                    {t('applicationCard.documents_label')} {index + 1}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(doc, '_blank')}
                  className="h-6 px-2 text-xs"
                >
                  {t('applicationCard.button_view')}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground bg-muted/30 rounded border-2 border-dashed border-border">
            <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm">{t('applicationCard.noDocument')}</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="text-xs text-muted-foreground text-center">
        <div className="flex items-center justify-center gap-1">
          <Calendar className="h-3 w-3" />
          {t('applicationCard.application_submitted_on')}{' '}
          {new Date(application.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </Card>
  );
};
