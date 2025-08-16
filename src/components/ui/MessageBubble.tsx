import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Camera, 
  TrendingUp, 
  MessageCircle, 
  Clock,
  Droplet,
  Utensils
} from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  age: number;
  diabetesType: 'type1' | 'type2' | 'gestational';
  avatar?: string;
}

interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

interface BaseMessage {
  id: string;
  userId: string;
  user: User;
  timestamp: Date;
  reactions?: MessageReaction[];
}

interface TextMessage extends BaseMessage {
  type: 'text';
  text: string;
}

interface GlucoseShareMessage extends BaseMessage {
  type: 'glucose_share';
  data: {
    value: number;
    unit: 'mg/dL' | 'mmol/L';
    context: string;
    trend?: 'rising' | 'falling' | 'stable';
  };
}

interface MealPhotoMessage extends BaseMessage {
  type: 'meal_photo';
  data: {
    imageUrl: string;
    description: string;
    carbs?: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  };
}

interface ProgressMessage extends BaseMessage {
  type: 'progress_celebration';
  data: {
    achievement: string;
    metric: string;
    value: string;
    duration: string;
  };
}

interface QuestionMessage extends BaseMessage {
  type: 'question';
  data: {
    question: string;
    category: 'medication' | 'diet' | 'exercise' | 'general';
  };
}

type Message = TextMessage | GlucoseShareMessage | MealPhotoMessage | ProgressMessage | QuestionMessage;

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
  onReaction?: (messageId: string, emoji: string) => void;
}

const UserAvatar = ({ user, size = "default" }: { user: User; size?: "small" | "default" }) => {
  const sizeClass = size === "small" ? "w-6 h-6" : "w-8 h-8";
  
  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={user.avatar} alt={`${user.firstName}`} />
      <AvatarFallback className="bg-medical-teal text-white text-xs">
        {user.firstName[0]}{user.lastName?.[0] || ''}
      </AvatarFallback>
    </Avatar>
  );
};

const UserBadge = ({ type }: { type: User['diabetesType'] }) => {
  const getBadgeVariant = () => {
    switch (type) {
      case 'type1':
        return { variant: "default" as const, text: "T1", color: "bg-medical-blue text-white" };
      case 'type2':
        return { variant: "secondary" as const, text: "T2", color: "bg-medical-green text-white" };
      case 'gestational':
        return { variant: "outline" as const, text: "GD", color: "bg-medical-purple text-white" };
    }
  };
  
  const badge = getBadgeVariant();
  
  return (
    <Badge variant={badge.variant} className={`text-xs ${badge.color}`}>
      {badge.text}
    </Badge>
  );
};

const GlucoseShareMessage = ({ data }: { data: GlucoseShareMessage['data'] }) => {
  const getGlucoseColor = (value: number) => {
    if (value < 70) return "text-glucose-low";
    if (value > 180) return "text-glucose-high";
    return "text-glucose-normal";
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-glucose-high" />;
      case 'falling': return <TrendingUp className="w-4 h-4 text-glucose-low rotate-180" />;
      default: return <div className="w-2 h-2 bg-glucose-normal rounded-full" />;
    }
  };

  return (
    <Card className="p-3 bg-gradient-to-r from-glucose-normal-light to-medical-teal-light border-l-4 border-medical-teal">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-medical-teal rounded-full">
          <Droplet className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getGlucoseColor(data.value)}`}>
              {data.value}
            </span>
            <span className="text-sm text-muted-foreground">{data.unit}</span>
            {getTrendIcon()}
          </div>
          <p className="text-sm text-muted-foreground">{data.context}</p>
        </div>
      </div>
    </Card>
  );
};

const MealPhotoMessage = ({ data }: { data: MealPhotoMessage['data'] }) => {
  const getMealIcon = () => {
    switch (data.mealType) {
      case 'breakfast': return "🌅";
      case 'lunch': return "☀️";
      case 'dinner': return "🌙";
      case 'snack': return "🍎";
    }
  };

  return (
    <Card className="p-3 bg-card">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-medical-green" />
          <span className="text-sm font-medium">
            {getMealIcon()} {data.mealType.charAt(0).toUpperCase() + data.mealType.slice(1)}
          </span>
          {data.carbs && (
            <Badge variant="secondary" className="text-xs">
              {data.carbs}g glucides
            </Badge>
          )}
        </div>
        
        <div className="relative">
          <img 
            src={data.imageUrl} 
            alt={data.description}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {data.description && (
          <p className="text-sm text-foreground">{data.description}</p>
        )}
      </div>
    </Card>
  );
};

const ProgressMessage = ({ data }: { data: ProgressMessage['data'] }) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-medical-green-light to-medical-teal-light border-l-4 border-medical-green">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-medical-green rounded-full">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-medical-green mb-1">🎉 {data.achievement}</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{data.metric}:</span>
              <span className="text-medical-green font-bold">{data.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">Période: {data.duration}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const QuestionMessage = ({ data }: { data: QuestionMessage['data'] }) => {
  const getCategoryIcon = () => {
    switch (data.category) {
      case 'medication': return "💊";
      case 'diet': return "🥗";
      case 'exercise': return "🏃‍♂️";
      default: return "❓";
    }
  };

  const getCategoryColor = () => {
    switch (data.category) {
      case 'medication': return "border-medical-blue";
      case 'diet': return "border-medical-green";
      case 'exercise': return "border-medical-purple";
      default: return "border-medical-teal";
    }
  };

  return (
    <Card className={`p-3 bg-card border-l-4 ${getCategoryColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full">
          <MessageCircle className="w-4 h-4 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{getCategoryIcon()}</span>
            <Badge variant="outline" className="text-xs capitalize">
              {data.category}
            </Badge>
          </div>
          <p className="text-sm text-foreground">{data.question}</p>
        </div>
      </div>
    </Card>
  );
};

const TextMessage = ({ text }: { text: string }) => {
  return (
    <p className="text-sm text-foreground leading-relaxed">{text}</p>
  );
};

const MessageFooter = ({ message, onReaction }: { 
  message: Message; 
  onReaction?: (messageId: string, emoji: string) => void;
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const quickReactions = ["❤️", "👍", "💪", "🎉", "👏", "🤗"];

  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>
          {message.timestamp.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-1">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => onReaction?.(message.id, reaction.emoji)}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent hover:bg-accent/80 transition-colors text-xs"
              >
                <span>{reaction.emoji}</span>
                <span className="text-accent-foreground">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
          >
            +
          </Button>
          
          {showReactionPicker && (
            <div className="absolute bottom-full right-0 mb-2 p-2 bg-popover border border-border rounded-lg shadow-lg z-10">
              <div className="flex gap-1">
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReaction?.(message.id, emoji);
                      setShowReactionPicker(false);
                    }}
                    className="p-1 hover:bg-accent rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, currentUserId, onReaction }: MessageBubbleProps) => {
  const isCurrentUser = message.userId === currentUserId;
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${
        isCurrentUser 
          ? 'bg-medical-teal text-white rounded-2xl rounded-br-md p-4' 
          : 'bg-card shadow-sm rounded-2xl rounded-bl-md p-4'
      }`}>
        
        {/* User info pour messages des autres */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-3">
            <UserAvatar user={message.user} size="small" />
            <span className="text-sm font-medium text-foreground">
              {message.user.firstName} {message.user.age}ans
            </span>
            <UserBadge type={message.user.diabetesType} />
          </div>
        )}
        
        {/* Contenu selon le type */}
        <div className={isCurrentUser ? 'space-y-2' : 'space-y-3'}>
          {message.type === 'glucose_share' && (
            <GlucoseShareMessage data={message.data} />
          )}
          
          {message.type === 'meal_photo' && (
            <MealPhotoMessage data={message.data} />
          )}
          
          {message.type === 'progress_celebration' && (
            <ProgressMessage data={message.data} />
          )}
          
          {message.type === 'question' && (
            <QuestionMessage data={message.data} />
          )}
          
          {message.type === 'text' && (
            <TextMessage text={message.text} />
          )}
        </div>
        
        {/* Timestamp et réactions */}
        <MessageFooter message={message} onReaction={onReaction} />
      </div>
    </div>
  );
};

export default MessageBubble;
export type { Message, User, MessageBubbleProps };