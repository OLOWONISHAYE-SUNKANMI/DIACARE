import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminNotification {
  title: string;
  message: string;
  type: 'new_application' | 'status_change' | 'consultation_request' | 'patient_response';
  data: any;
  timestamp: Date;
  actions?: string[];
}

export const useAdminNotifications = (isAdmin: boolean = false) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Luu2dhEQSO2e/VgjMGHmnA7OGWSgcWY7Xl5ZUMDA0QUBA');
    }
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(console.error);
    }
  };

  const showAdminNotification = (notification: AdminNotification) => {
    if (!isAdmin) return;

    // Play sound
    playNotificationSound();

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: 10000, // 10 seconds for admin notifications
    });

    // Store in localStorage for persistence
    const existingNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    const newNotifications = [
      {
        ...notification,
        id: Date.now().toString(),
        read: false,
      },
      ...existingNotifications.slice(0, 49) // Keep last 50 notifications
    ];
    localStorage.setItem('admin_notifications', JSON.stringify(newNotifications));

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('admin-notification', { detail: notification }));
  };

  useEffect(() => {
    if (!isAdmin) return;

    console.log('Setting up realtime subscriptions for admin...');

    // Subscribe to new professional applications
    const applicationSubscription = supabase
      .channel('admin-professional-applications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'professional_applications'
        },
        (payload) => {
          const data = payload.new as any;
          showAdminNotification({
            title: '🆕 Nouvelle candidature professionnel',
            message: `${data.first_name} ${data.last_name} - ${data.professional_type}`,
            type: 'new_application',
            data: data,
            timestamp: new Date(),
            actions: ['Examiner', 'Plus tard']
          });
        }
      )
      .subscribe();

    // Subscribe to application status changes
    const statusSubscription = supabase
      .channel('admin-application-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'professional_applications'
        },
        (payload) => {
          const data = payload.new as any;
          const oldData = payload.old as any;
          
          if (data.status !== oldData.status) {
            showAdminNotification({
              title: '📝 Changement de statut',
              message: `${data.first_name} ${data.last_name}: ${oldData.status} → ${data.status}`,
              type: 'status_change',
              data: data,
              timestamp: new Date()
            });
          }
        }
      )
      .subscribe();

    // Subscribe to new consultation requests
    const consultationSubscription = supabase
      .channel('admin-consultation-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'professional_sessions'
        },
        (payload) => {
          const data = payload.new as any;
          showAdminNotification({
            title: '🏥 Nouvelle demande de consultation',
            message: `Professional: ${data.professional_code}, Patient: ${data.patient_name || data.patient_code}`,
            type: 'consultation_request',
            data: data,
            timestamp: new Date()
          });
        }
      )
      .subscribe();

    // Subscribe to patient responses
    const patientResponseSubscription = supabase
      .channel('admin-patient-responses')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'professional_sessions'
        },
        (payload) => {
          const data = payload.new as any;
          const oldData = payload.old as any;
          
          if (data.patient_approved_at && !oldData.patient_approved_at) {
            showAdminNotification({
              title: data.access_granted ? '✅ Accès patient approuvé' : '❌ Accès patient refusé',
              message: `Patient ${data.patient_name || data.patient_code} a ${data.access_granted ? 'approuvé' : 'refusé'} l'accès`,
              type: 'patient_response',
              data: data,
              timestamp: new Date()
            });
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log('Cleaning up admin subscriptions...');
      applicationSubscription.unsubscribe();
      statusSubscription.unsubscribe();
      consultationSubscription.unsubscribe();
      patientResponseSubscription.unsubscribe();
    };
  }, [isAdmin, toast]);

  const markNotificationAsRead = (notificationId: string) => {
    const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    const updatedNotifications = notifications.map((notif: any) => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
  };

  const getUnreadCount = (): number => {
    const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    return notifications.filter((notif: any) => !notif.read).length;
  };

  const getAllNotifications = () => {
    return JSON.parse(localStorage.getItem('admin_notifications') || '[]');
  };

  const clearAllNotifications = () => {
    localStorage.setItem('admin_notifications', JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('admin-notifications-cleared'));
  };

  return {
    showAdminNotification,
    markNotificationAsRead,
    getUnreadCount,
    getAllNotifications,
    clearAllNotifications,
    playNotificationSound
  };
};