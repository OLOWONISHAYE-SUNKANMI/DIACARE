import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Video,
  User,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type: 'consultation' | 'appointment' | 'availability';
  status: string;
  patient_name?: string;
  amount?: number;
  notes?: string;
}

interface CalendarSchedulerProps {
  professionalId?: string;
  patientView?: boolean;
}

const CalendarScheduler: React.FC<CalendarSchedulerProps> = ({ 
  professionalId,
  patientView = false 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarEvents();
  }, [currentDate, professionalId, user]);

  const loadCalendarEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get start and end of current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      let query = supabase
        .from('teleconsultations')
        .select(`
          id,
          scheduled_at,
          status,
          amount_charged,
          professional_id,
          patient_id,
          consultation_notes
        `)
        .gte('scheduled_at', startOfMonth.toISOString())
        .lte('scheduled_at', endOfMonth.toISOString());

      // Filter based on user role
      if (patientView) {
        query = query.eq('patient_id', user.id);
      } else if (professionalId) {
        query = query.eq('professional_id', professionalId);
      }

      const { data, error } = await query.order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Transform data to calendar events
      const calendarEvents: CalendarEvent[] = (data || []).map(consultation => ({
        id: consultation.id,
        title: patientView 
          ? `Consultation - ${t('calendar.professional')}`
          : `Consultation - ${t('calendar.patient')}`,
        start_date: consultation.scheduled_at,
        end_date: new Date(new Date(consultation.scheduled_at).getTime() + 30 * 60000).toISOString(), // 30 min duration
        type: 'consultation',
        status: consultation.status,
        patient_name: t('calendar.patient'),
        amount: consultation.amount_charged,
        notes: consultation.consultation_notes
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      toast({
        title: t('errors.loadingError'),
        description: t('errors.calendarLoadError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.start_date.startsWith(dateStr)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      in_progress: 'bg-orange-100 text-orange-700 border-orange-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
      no_show: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: t('status.scheduled'),
      confirmed: t('status.confirmed'),
      in_progress: t('status.inProgress'),
      completed: t('status.completed'),
      cancelled: t('status.cancelled'),
      no_show: t('status.noShow')
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('calendar.title')}
              </CardTitle>
              <CardDescription>
                {patientView ? t('calendar.yourAppointments') : t('calendar.manageSchedule')}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-[180px] text-center font-semibold capitalize">
                {monthName}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Calendar Grid */}
          <div className="space-y-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-1 h-24"></div>;
                }
                
                const dayEvents = getEventsForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = selectedDate === day.toISOString().split('T')[0];
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day.toISOString().split('T')[0])}
                    className={`p-1 h-24 border rounded cursor-pointer transition-colors hover:bg-muted/50 ${
                      isToday ? 'bg-primary/10 border-primary' : 'border-border'
                    } ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-primary' : 'text-foreground'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    <div className="space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded truncate border ${getStatusColor(event.status)}`}
                          title={`${event.title} - ${formatTime(event.start_date)}`}
                        >
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{formatTime(event.start_date)}</span>
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - 2} {t('calendar.more')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedDayEvents = events.filter(event => 
                event.start_date.startsWith(selectedDate)
              );
              
              if (selectedDayEvents.length === 0) {
                return (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <p>{t('calendar.noEventsThisDay')}</p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {selectedDayEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {formatTime(event.start_date)} - {formatTime(event.end_date)}
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          {event.type === 'consultation' && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{t('calendar.consultation')}</span>
                              {event.amount && (
                                <>
                                  <DollarSign className="w-3 h-3" />
                                  <span>{event.amount} F CFA</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusLabel(event.status)}
                        </Badge>
                        
                        {event.status === 'confirmed' && (
                          <Button size="sm" variant="outline">
                            <Video className="w-3 h-3 mr-1" />
                            {t('buttons.join')}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('stats.thisMonth')}</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === 'scheduled' || e.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('stats.completed')}</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('stats.revenue')}</p>
                <p className="text-2xl font-bold">
                  {events
                    .filter(e => e.status === 'completed')
                    .reduce((sum, e) => sum + (e.amount || 0), 0)
                  } F CFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarScheduler;