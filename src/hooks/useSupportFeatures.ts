import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SupportFeatures, { 
  type SupportSession, 
  type CommunityChallenge, 
  type EmergencyRequest,
  type EmergencyResponder,
  type PeerSupportPair,
  type EmergencyPriority 
} from '@/utils/SupportFeatures';

export const useSupportFeatures = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [supportSessions, setSupportSessions] = useState<SupportSession[]>([]);
  const [communityChallenge, setCommunityChallenge] = useState<CommunityChallenge[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [onlineExperts, setOnlineExperts] = useState<EmergencyResponder[]>([]);
  const [peerSupportPairs, setPeerSupportPairs] = useState<PeerSupportPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSupportData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const loadSupportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [sessions, challenges, experts, pairs] = await Promise.all([
        SupportFeatures.getSupportSessions(),
        SupportFeatures.getCommunityChallenge(),
        SupportFeatures.getOnlineExperts(),
        user ? SupportFeatures.getPeerSupportPairs(user.id) : []
      ]);

      setSupportSessions(sessions);
      setCommunityChallenge(challenges);
      setOnlineExperts(experts);
      setPeerSupportPairs(pairs);
    } catch (err) {
      console.error('Error loading support data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to emergency requests
    const emergencyChannel = supabase
      .channel('emergency-support')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emergency_support_requests'
        },
        (payload) => {
          const newRequest = payload.new as EmergencyRequest;
          setEmergencyRequests(prev => [newRequest, ...prev]);
          
          // Notify if user is an emergency responder
          if (onlineExperts.some(expert => expert.user_id === user?.id)) {
            toast({
              title: '🆘 Nouvelle demande d\'urgence',
              description: `Priorité: ${newRequest.priority}`,
              variant: 'destructive',
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'emergency_responders'
        },
        () => {
          // Reload online experts when availability changes
          SupportFeatures.getOnlineExperts().then(setOnlineExperts);
        }
      )
      .subscribe();

    // Subscribe to session participants
    const sessionsChannel = supabase
      .channel('session-participants')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants'
        },
        () => {
          // Reload sessions to get updated participant counts
          SupportFeatures.getSupportSessions().then(setSupportSessions);
        }
      )
      .subscribe();

    // Subscribe to challenge participants
    const challengesChannel = supabase
      .channel('challenge-participants')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenge_participants'
        },
        () => {
          // Reload challenges to get updated participant counts
          SupportFeatures.getCommunityChallenge().then(setCommunityChallenge);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(challengesChannel);
    };
  };

  // Session management
  const joinSession = async (sessionId: string): Promise<boolean> => {
    try {
      const success = await SupportFeatures.joinSession(sessionId);
      if (success) {
        toast({
          title: 'Session rejointe',
          description: 'Vous avez rejoint la session de support avec succès',
        });
        await loadSupportData();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de rejoindre la session',
          variant: 'destructive',
        });
      }
      return success;
    } catch (err) {
      console.error('Error joining session:', err);
      return false;
    }
  };

  const leaveSession = async (sessionId: string): Promise<boolean> => {
    try {
      const success = await SupportFeatures.leaveSession(sessionId);
      if (success) {
        toast({
          title: 'Session quittée',
          description: 'Vous avez quitté la session de support',
        });
        await loadSupportData();
      }
      return success;
    } catch (err) {
      console.error('Error leaving session:', err);
      return false;
    }
  };

  // Challenge management
  const joinChallenge = async (challengeId: string): Promise<boolean> => {
    try {
      const success = await SupportFeatures.joinChallenge(challengeId);
      if (success) {
        toast({
          title: 'Défi rejoint',
          description: 'Vous participez maintenant à ce défi communautaire !',
        });
        await loadSupportData();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de rejoindre le défi',
          variant: 'destructive',
        });
      }
      return success;
    } catch (err) {
      console.error('Error joining challenge:', err);
      return false;
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number): Promise<boolean> => {
    try {
      const success = await SupportFeatures.updateChallengeProgress(challengeId, progress);
      if (success) {
        if (progress >= 100) {
          toast({
            title: '🏆 Défi terminé !',
            description: 'Félicitations ! Vous avez terminé le défi !',
          });
        }
        await loadSupportData();
      }
      return success;
    } catch (err) {
      console.error('Error updating challenge progress:', err);
      return false;
    }
  };

  // Emergency support
  const createEmergencyRequest = async (message: string, priority: EmergencyPriority = 'medium'): Promise<boolean> => {
    try {
      const requestId = await SupportFeatures.createEmergencyRequest(message, priority);
      if (requestId) {
        // Notify online moderators
        await SupportFeatures.notifyOnlineModerators(requestId);
        
        // Prioritize user messages
        if (user) {
          await SupportFeatures.prioritizeUserMessages(user.id);
        }

        toast({
          title: '🆘 Demande d\'urgence envoyée',
          description: 'Les experts en ligne ont été notifiés. Vous recevrez une réponse rapidement.',
        });

        return true;
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible d\'envoyer la demande d\'urgence',
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      console.error('Error creating emergency request:', err);
      return false;
    }
  };

  const triggerSOSButton = async (message?: string) => {
    await createEmergencyRequest(
      message || "Besoin d'aide urgente - situation critique", 
      'critical'
    );
    
    // Show emergency contacts
    const emergencyContacts = await SupportFeatures.suggestEmergencyContacts();
    
    toast({
      title: '🆘 Mode d\'urgence activé',
      description: 'Experts notifiés. Si c\'est une urgence médicale, appelez le 15.',
      variant: 'destructive',
    });

    return emergencyContacts;
  };

  // Peer support
  const createPeerSupportPair = async (mentorId: string, menteeId: string, notes?: string): Promise<boolean> => {
    try {
      const success = await SupportFeatures.createPeerSupportPair(mentorId, menteeId, notes);
      if (success) {
        toast({
          title: 'Binôme créé',
          description: 'La relation de mentorat a été établie avec succès',
        });
        await loadSupportData();
      }
      return success;
    } catch (err) {
      console.error('Error creating peer support pair:', err);
      return false;
    }
  };

  return {
    // Data
    supportSessions,
    communityChallenge,
    emergencyRequests,
    onlineExperts,
    peerSupportPairs,
    loading,
    error,

    // Session actions
    joinSession,
    leaveSession,

    // Challenge actions
    joinChallenge,
    updateChallengeProgress,

    // Emergency actions
    createEmergencyRequest,
    triggerSOSButton,

    // Peer support actions
    createPeerSupportPair,

    // Utility
    reload: loadSupportData
  };
};