import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { ApplicationCard, ApplicationDetails } from '@/components/ApplicationCard';
import { AlertCircle, RefreshCw } from 'lucide-react';

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

export const AdminApplicationReview: React.FC = () => {
  const { toast } = useToast();
  const { showAdminNotification } = useAdminNotifications(true);
  
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState<string | null>(null);

  useEffect(() => {
    loadPendingApplications();
    setupRealtimeUpdates();
  }, []);

  const loadPendingApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('professional_applications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure documents is an array
      const transformedData = (data || []).map(app => ({
        ...app,
        documents: Array.isArray(app.documents) ? app.documents : []
      })) as Application[];
      
      setPendingApplications(transformedData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeUpdates = () => {
    const subscription = supabase
      .channel('admin-pending-applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'professional_applications',
          filter: 'status=eq.pending'
        },
        (payload) => {
          console.log('Realtime update:', payload);
          loadPendingApplications(); // Refresh the list
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendNotificationEmail = async (type: string, applicationData: any, additionalData?: any) => {
    try {
      await supabase.functions.invoke('send-professional-emails', {
        body: {
          type,
          to: applicationData.email,
          applicationData: {
            id: applicationData.id,
            name: `${applicationData.first_name} ${applicationData.last_name}`,
            professionalType: applicationData.professional_type,
            country: applicationData.country,
            email: applicationData.email,
            institution: applicationData.institution
          },
          ...additionalData
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const approveApplication = async (application: Application) => {
    setIsProcessing(true);
    try {
      // Use the database function to approve and generate code
      const { data, error } = await supabase.rpc('approve_professional_application', {
        application_id: application.id,
        reviewer_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      // Get the updated application with the generated code
      const { data: updatedApp, error: fetchError } = await supabase
        .from('professional_applications')
        .select('*')
        .eq('id', application.id)
        .single();

      if (fetchError) throw fetchError;

      // Send approval email with the professional code
      await sendNotificationEmail('approval', updatedApp, {
        professionalCode: updatedApp.professional_code
      });

      // Remove from pending list
      setPendingApplications(prev => prev.filter(app => app.id !== application.id));
      
      // Clear selection if it was the approved application
      if (selectedApplication?.id === application.id) {
        setSelectedApplication(null);
      }

      toast({
        title: "Candidature approuvée !",
        description: `${application.first_name} ${application.last_name} a été approuvé(e)`,
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver la candidature",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectApplication = async (application: Application) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motif requis",
        description: "Veuillez indiquer le motif du rejet",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('professional_applications')
        .update({
          status: 'rejected',
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: rejectionReason
        })
        .eq('id', application.id);

      if (error) throw error;

      // Send rejection email
      await sendNotificationEmail('rejection', application, {
        rejectionReason
      });

      // Remove from pending list
      setPendingApplications(prev => prev.filter(app => app.id !== application.id));
      
      // Clear selection if it was the rejected application
      if (selectedApplication?.id === application.id) {
        setSelectedApplication(null);
      }

      // Reset rejection form
      setRejectionReason('');
      setShowRejectionForm(null);

      toast({
        title: "Candidature rejetée",
        description: `${application.first_name} ${application.last_name} a été rejeté(e)`,
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter la candidature",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (application: Application) => {
    setShowRejectionForm(application.id);
    setRejectionReason('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600">Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header admin */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🔧 DARE Admin - Candidatures</h1>
            <p className="text-indigo-200 mt-1">
              {pendingApplications.length} candidature(s) en attente d'examen
            </p>
          </div>
          
          <Button
            onClick={loadPendingApplications}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {pendingApplications.length === 0 ? (
        <div className="p-6">
          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Aucune candidature en attente
            </h2>
            <p className="text-gray-500">
              Toutes les candidatures ont été traitées. 
              Les nouvelles candidatures apparaîtront ici automatiquement.
            </p>
            <Button
              onClick={loadPendingApplications}
              variant="outline"
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Vérifier les nouvelles candidatures
            </Button>
          </Card>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste candidatures */}
          <div className="lg:col-span-2 space-y-4">
            {pendingApplications.map(application => (
              <div key={application.id}>
                <ApplicationCard
                  application={application}
                  onSelect={setSelectedApplication}
                  onApprove={approveApplication}
                  onReject={handleRejectClick}
                />
                
                {/* Formulaire de rejet */}
                {showRejectionForm === application.id && (
                  <Card className="mt-2 p-4 border-red-200 bg-red-50">
                    <div className="space-y-3">
                      <h4 className="font-medium text-red-800 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Motif du rejet
                      </h4>
                      <Textarea
                        placeholder="Expliquez pourquoi cette candidature est rejetée..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-20 border-red-200 focus:border-red-400"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowRejectionForm(null);
                            setRejectionReason('');
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectApplication(application)}
                          disabled={isProcessing || !rejectionReason.trim()}
                        >
                          Confirmer le rejet
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
          
          {/* Détails candidature sélectionnée */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <ApplicationDetails application={selectedApplication} />
            ) : (
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h3 className="font-medium text-gray-700 mb-1">Aucune sélection</h3>
                <p className="text-sm text-gray-500">
                  Cliquez sur "Examiner" pour voir les détails d'une candidature
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};