import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AdminNotificationCenter } from '@/components/AdminNotificationCenter';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  FileText,
  Mail,
  Eye,
  MoreHorizontal,
  Download,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProfessionalApplication {
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
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  professional_code?: string;
}

export const AdminDashboardScreen: React.FC = () => {
  const { toast } = useToast();
  const { showAdminNotification } = useAdminNotifications(true);
  
  const [applications, setApplications] = useState<ProfessionalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<ProfessionalApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Load applications
  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(app => ({
        ...app,
        documents: Array.isArray(app.documents) ? app.documents : []
      })) as ProfessionalApplication[];
      
      setApplications(transformedData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les candidatures",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.professional_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Send notification email
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

  // Approve application
  const approveApplication = async (application: ProfessionalApplication) => {
    setIsProcessing(true);
    try {
      // Use the database function to approve and generate code
      const { data, error } = await supabase.rpc('approve_professional_application', {
        application_id: application.id,
        reviewer_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      // Send approval email
      const updatedApp = { ...application, status: 'approved' as const };
      await sendNotificationEmail('approval', updatedApp, {
        professionalCode: 'DR' + Math.random().toString(36).substr(2, 6).toUpperCase()
      });

      // Refresh list
      await loadApplications();
      setSelectedApplication(null);

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

  // Reject application
  const rejectApplication = async (application: ProfessionalApplication) => {
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
      const updatedApp = { ...application, status: 'rejected' as const };
      await sendNotificationEmail('rejection', updatedApp, {
        rejectionReason
      });

      // Refresh list
      await loadApplications();
      setSelectedApplication(null);
      setRejectionReason('');

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

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ En attente</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">❌ Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🏥 Administration DARE</h1>
            <p className="text-gray-600 mt-1">Gestion des candidatures professionnelles</p>
          </div>
          <AdminNotificationCenter isAdmin={true} />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total candidatures</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email, ou spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Applications List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Candidatures ({filteredApplications.length})</h2>
            
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredApplications.map((application) => (
                  <Card 
                    key={application.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedApplication?.id === application.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">
                            {application.first_name} {application.last_name}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <p className="text-sm text-gray-600">{application.professional_type}</p>
                        <p className="text-sm text-gray-500">{application.institution || application.city}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(application.created_at), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                      
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </Card>
                ))}
                
                {filteredApplications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune candidature trouvée</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Details */}
          <Card className="p-6">
            {selectedApplication ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedApplication.first_name} {selectedApplication.last_name}
                    </h2>
                    <p className="text-gray-600">{selectedApplication.professional_type}</p>
                  </div>
                  {getStatusBadge(selectedApplication.status)}
                </div>

                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Détails</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Email</p>
                        <p className="text-gray-600">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Téléphone</p>
                        <p className="text-gray-600">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Licence</p>
                        <p className="text-gray-600">{selectedApplication.license_number}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Pays</p>
                        <p className="text-gray-600">{selectedApplication.country}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Ville</p>
                        <p className="text-gray-600">{selectedApplication.city}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Institution</p>
                        <p className="text-gray-600">{selectedApplication.institution || 'Non spécifiée'}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="space-y-3">
                    {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                      selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Document {index + 1}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(doc, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun document</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    {selectedApplication.status === 'pending' ? (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => approveApplication(selectedApplication)}
                            disabled={isProcessing}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approuver
                          </Button>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Motif du rejet (requis)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-20"
                          />
                          <Button 
                            onClick={() => rejectApplication(selectedApplication)}
                            disabled={isProcessing || !rejectionReason.trim()}
                            variant="destructive"
                            className="w-full"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <p>Candidature déjà traitée</p>
                        {selectedApplication.reviewed_at && (
                          <p className="text-xs mt-1">
                            Traitée le {new Date(selectedApplication.reviewed_at).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Sélectionnez une candidature</p>
                <p className="text-sm text-gray-400 mt-1">pour voir les détails</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};