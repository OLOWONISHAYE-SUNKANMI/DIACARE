import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Send, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AutoMessaging, { type MessageType } from '@/utils/AutoMessaging';
import { useTranslation } from 'react-i18next';

interface AutoMessageCardProps {
  id: string;
  type: MessageType;
  content: string;
  reactions: string[];
  sent_at: string;
  metadata?: Record<string, any>;
  onResend?: () => void;
  showActions?: boolean;
}

const AutoMessageCard = ({
  id,
  type,
  content,
  reactions,
  sent_at,
  metadata,
  onResend,
  showActions = false,
}: AutoMessageCardProps) => {
  const { t } = useTranslation();
  const timeAgo = formatDistanceToNow(new Date(sent_at), {
    addSuffix: true,
    locale: fr,
  });

  const getTypeColor = (type: MessageType) => {
    const colors = {
      daily_motivation:
        'bg-medical-green-light text-medical-green border-medical-green',
      educational:
        'bg-medical-blue-light text-medical-blue border-medical-blue',
      celebration:
        'bg-medical-purple-light text-medical-purple border-medical-purple',
      reminder:
        'bg-medical-orange-light text-medical-orange border-medical-orange',
      announcement:
        'bg-medical-teal-light text-medical-teal border-medical-teal',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {AutoMessaging.getMessageTypeIcon(type)}
            </span>
            <div>
              <CardTitle className="text-sm font-medium">
                {AutoMessaging.getMessageTypeLabel(type)}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={getTypeColor(type)}>
            <Send className="w-3 h-3 mr-1" />
            {t('autoMessageCard.Badge.sent')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-foreground leading-relaxed">{content}</div>

        {reactions && reactions.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-2">
              {t('autoMessageCard.Reactions.label')}:
            </span>
            {reactions.map((reaction, index) => (
              <span key={index} className="text-sm">
                {reaction}
              </span>
            ))}
          </div>
        )}

        {metadata && (
          <div className="text-xs text-muted-foreground">
            {metadata.source && (
              <div className="flex items-center gap-1">
                <Settings className="w-3 h-3" />
                {t('autoMessageCard.Metadata.source')}:{' '}
                {metadata.source === 'manual_trigger'
                  ? t('autoMessageCard.Metadata.manual')
                  : t('autoMessageCard.Metadata.automatic')}
              </div>
            )}
            {metadata.celebration_type && (
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {t('autoMessageCard.Metadata.type')}:{' '}
                {metadata.celebration_type}
              </div>
            )}
          </div>
        )}

        {showActions && onResend && (
          <div className="flex justify-end pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={onResend}
              className="gap-1"
            >
              <Send className="w-3 h-3" />
              {t('autoMessageCard.Actions.resend')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoMessageCard;
