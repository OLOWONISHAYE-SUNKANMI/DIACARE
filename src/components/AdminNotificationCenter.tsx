import React, { useState, useEffect } from 'react';
import { Bell, X, Eye, Trash2, CheckCircle, AlertCircle, User, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAdminNotifications, AdminNotification } from '@/hooks/useAdminNotifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface AdminNotificationCenterProps {
  isAdmin: boolean;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({ isAdmin }) => {
  const { t } = useTranslation();
  const {
    markNotificationAsRead,
    getUnreadCount,
    getAllNotifications,
    clearAllNotifications
  } = useAdminNotifications(isAdmin);

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const refreshNotifications = () => {
    setNotifications(getAllNotifications());
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    if (!isAdmin) return;

    refreshNotifications();

    // Listen for new notifications
    const handleNewNotification = () => {
      refreshNotifications();
    };

    const handleNotificationsCleared = () => {
      refreshNotifications();
    };

    window.addEventListener('admin-notification', handleNewNotification);
    window.addEventListener('admin-notifications-cleared', handleNotificationsCleared);

    // Refresh every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);

    return () => {
      window.removeEventListener('admin-notification', handleNewNotification);
      window.removeEventListener('admin-notifications-cleared', handleNotificationsCleared);
      clearInterval(interval);
    };
  }, [isAdmin]);

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    refreshNotifications();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    refreshNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_application':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'status_change':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'consultation_request':
        return <Stethoscope className="h-4 w-4 text-purple-500" />;
      case 'patient_response':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50';
    
    switch (type) {
      case 'new_application':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'status_change':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'consultation_request':
        return 'bg-purple-50 border-l-4 border-l-purple-500';
      case 'patient_response':
        return 'bg-orange-50 border-l-4 border-l-orange-500';
      default:
        return 'bg-gray-50';
    }
  };

  if (!isAdmin) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{t('admin.notifications')}</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t('admin.clearAll')}
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">{t('admin.noNotifications')}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t('admin.newActivities')}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification: any, index) => (
                <Card 
                  key={notification.id} 
                  className={`p-3 mb-2 cursor-pointer transition-all hover:shadow-md ${getNotificationBgColor(notification.type, notification.read)}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.timestamp), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </p>
                        
                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex gap-1">
                            {notification.actions.map((action, actionIndex) => (
                              <Button 
                                key={actionIndex}
                                variant="outline" 
                                size="sm"
                                className="text-xs h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle action click
                                  console.log(`Action clicked: ${action}`, notification.data);
                                }}
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                {t('common.close')}
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};