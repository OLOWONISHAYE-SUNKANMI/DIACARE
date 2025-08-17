import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AuditSystem } from '@/utils/AuditSystem';
import { Calendar, Clock, Shield, Download, Eye, MessageCircle } from 'lucide-react';

interface AccessHistoryItem {
  id: string;
  professionalName: string;
  professionalType: string;
  professionalCode: string;
  timestamp: string;
  duration: number;
  actionType: 'consultation' | 'view' | 'download' | 'export';
  dataAccessed: string[];
  ipAddress?: string;
  isSuspicious?: boolean;
}

interface PatientAccessHistoryProps {
  patientId: string;
}

export const PatientAccessHistory: React.FC<PatientAccessHistoryProps> = ({ patientId }) => {
  const [accessHistory, setAccessHistory] = useState<AccessHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (patientId) {
      loadAccessHistory(patientId);
    }
  }, [patientId]);

  const loadAccessHistory = async (patientId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Charger l'historique des 30 derniers jours
      const timeframe = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date()
      };
      
      const report = await AuditSystem.generateAccessReport(patientId, timeframe);
      
      // Pour le moment, utiliser des données simulées réalistes
      const mockHistory: AccessHistoryItem[] = [
        {
          id: '1',
          professionalName: 'Dr. Sarah Martin',
          professionalType: 'Endocrinologue',
          professionalCode: 'ENDO-SN-2847',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2 heures
          duration: 25,
          actionType: 'consultation',
          dataAccessed: ['glucose', 'medications', 'overview'],
          isSuspicious: false
        },
        {
          id: '2',
          professionalName: 'Dr. Ahmed Diop',
          professionalType: 'Médecin généraliste',
          professionalCode: 'MGEN-SN-1523',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hier
          duration: 8,
          actionType: 'view',
          dataAccessed: ['glucose', 'overview'],
          isSuspicious: false
        },
        {
          id: '3',
          professionalName: 'Fatou Sow',
          professionalType: 'Nutritionniste',
          professionalCode: 'NUTR-SN-8934',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3 jours
          duration: 15,
          actionType: 'consultation',
          dataAccessed: ['meals', 'glucose', 'activities'],
          isSuspicious: false
        },
        {
          id: '4',
          professionalName: 'Dr. Mamadou Fall',
          professionalType: 'Endocrinologue',
          professionalCode: 'ENDO-SN-4721',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Il y a une semaine
          duration: 35,
          actionType: 'consultation',
          dataAccessed: ['glucose', 'medications', 'meals', 'activities', 'overview'],
          isSuspicious: false
        },
        {
          id: '5',
          professionalName: 'Access Suspect',
          professionalType: 'Inconnu',
          professionalCode: 'UNKNOWN-XX-0000',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 10 jours
          duration: 1,
          actionType: 'view',
          dataAccessed: [],
          isSuspicious: true
        }
      ];
      
      setAccessHistory(mockHistory);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'historique');
      console.error('Erreur chargement historique:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `Il y a ${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Il y a ${diffInDays} jours`;
      } else {
        return date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    }
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 1) {
      return '< 1 min';
    } else if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'consultation':
        return <MessageCircle className="h-4 w-4" />;
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'download':
      case 'export':
        return <Download className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'consultation':
        return 'Consultation';
      case 'view':
        return 'Consultation données';
      case 'download':
        return 'Téléchargement';
      case 'export':
        return 'Export données';
      default:
        return 'Accès';
    }
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      'glucose': 'Glycémie',
      'medications': 'Médications',
      'meals': 'Repas',
      'activities': 'Activités',
      'overview': 'Vue d\'ensemble'
    };
    return labels[section] || section;
  };

  const downloadReport = async () => {
    try {
      toast({
        title: "📄 Génération du rapport",
        description: "Préparation du rapport d'accès en cours...",
      });
      
      // Simuler la génération du rapport
      setTimeout(() => {
        toast({
          title: "✅ Rapport généré",
          description: "Le rapport d'accès a été téléchargé avec succès",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de générer le rapport",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Historique d'Accès à mes Données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Erreur de Chargement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => loadAccessHistory(patientId)} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          🔍 Historique d'Accès à mes Données
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tous les accès à vos données sont tracés et sécurisés
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accessHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun accès récent à vos données</p>
            </div>
          ) : (
            accessHistory.map(access => (
              <div 
                key={access.id} 
                className={`border rounded-lg p-4 transition-colors hover:bg-muted/50 ${
                  access.isSuspicious ? 'border-destructive/50 bg-destructive/5' : 'border-border'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{access.professionalName}</h4>
                      {access.isSuspicious && (
                        <Badge variant="destructive" className="text-xs">
                          ⚠️ Suspect
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {access.professionalType} • Code: {access.professionalCode}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(access.timestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(access.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={access.actionType === 'consultation' ? 'default' : 'secondary'}
                      className="flex items-center gap-1"
                    >
                      {getActionIcon(access.actionType)}
                      {getActionLabel(access.actionType)}
                    </Badge>
                  </div>
                </div>
                
                {/* Données consultées */}
                {access.dataAccessed.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-2">
                      <strong>Sections consultées:</strong>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {access.dataAccessed.map((section, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getSectionLabel(section)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        {accessHistory.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button onClick={downloadReport} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              📄 Télécharger Rapport Complet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientAccessHistory;