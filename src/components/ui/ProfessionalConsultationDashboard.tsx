import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, DollarSign, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTeleconsultations } from '@/hooks/useTeleconsultations';
import { ConsultationChat } from '@/components/ui/ConsultationChat';

interface ProfessionalConsultationDashboardProps {
  professionalId: string;
}

export const ProfessionalConsultationDashboard: React.FC<ProfessionalConsultationDashboardProps> = ({
  professionalId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { consultations, loading } = useTeleconsultations();
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  // Filtrer les consultations selon le filtre sélectionné
  const filteredConsultations = consultations.filter(consultation => {
    if (filter === 'all') return true;
    return consultation.status === filter;
  });

  const openConsultationChat = (consultationId: string) => {
    setSelectedConsultation(consultationId);
  };

  const closeConsultationChat = () => {
    setSelectedConsultation(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Programmée', variant: 'outline' as const, color: 'text-blue-600' },
      confirmed: { label: 'Confirmée', variant: 'default' as const, color: 'text-green-600' },
      in_progress: { label: 'En cours', variant: 'default' as const, color: 'text-orange-600' },
      completed: { label: 'Terminée', variant: 'secondary' as const, color: 'text-gray-600' },
      cancelled: { label: 'Annulée', variant: 'destructive' as const, color: 'text-red-600' },
      no_show: { label: 'Absent', variant: 'destructive' as const, color: 'text-red-600' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedConsultation) {
    const consultation = consultations.find(c => c.id === selectedConsultation);
    if (consultation) {
      return (
        <div className="h-full">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" onClick={closeConsultationChat}>
              ← Retour aux consultations
            </Button>
            <Badge variant="outline">
              Consultation #{consultation.id.slice(-6)}
            </Badge>
          </div>
          <ConsultationChat
            consultationId={consultation.id}
            patientId={consultation.patient_id}
            professionalId={professionalId}
            onEndConsultation={closeConsultationChat}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mes consultations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {filteredConsultations.length} consultation{filteredConsultations.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Liste des consultations */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p>Chargement des consultations...</p>
            </CardContent>
          </Card>
        ) : filteredConsultations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p>Aucune consultation trouvée</p>
              <p className="text-sm">Les consultations apparaîtront ici une fois créées</p>
            </CardContent>
          </Card>
        ) : (
          filteredConsultations.map((consultation) => {
            const status = getStatusBadge(consultation.status);
            return (
              <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">
                            Patient #{consultation.patient_id.slice(-6)}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(consultation.scheduled_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {consultation.amount_charged} F CFA
                            </span>
                          </div>
                        </div>
                      </div>

                      {consultation.consultation_notes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {consultation.consultation_notes}
                        </p>
                      )}

                      {consultation.duration_minutes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Durée:</strong> {consultation.duration_minutes} minutes
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={status.variant} className={status.color}>
                        {status.label}
                      </Badge>

                      {(consultation.status === 'confirmed' || consultation.status === 'in_progress') && (
                        <Button
                          size="sm"
                          onClick={() => openConsultationChat(consultation.id)}
                        >
                          {consultation.status === 'in_progress' ? 'Reprendre' : 'Démarrer'}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};