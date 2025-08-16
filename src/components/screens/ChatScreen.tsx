import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, Heart, Users2, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  user: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'support' | 'milestone';
  reactions?: { emoji: string; count: number }[];
}

interface ChatScreenProps {
  onBack?: () => void;
}

const ChatScreen = ({ onBack }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Marie D.",
      message: "Bonjour à tous ! J'ai réussi à maintenir ma glycémie dans la zone cible toute la semaine 🎉",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: 'milestone',
      reactions: [{ emoji: "👏", count: 8 }, { emoji: "💚", count: 5 }]
    },
    {
      id: "2",
      user: "Dr. Konaté",
      message: "Félicitations Marie ! C'est exactement le type de progrès que nous aimons voir. Continuez ainsi !",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      type: 'support'
    },
    {
      id: "3",
      user: "Ahmed S.",
      message: "J'ai une question sur l'insuline rapide avant les repas. Quelqu'un peut-il partager son expérience ?",
      timestamp: new Date(Date.now() - 30 * 1000),
      type: 'message'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: "Vous",
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    
    toast({
      title: "Message envoyé",
      description: "Votre message a été partagé avec la communauté DARE",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          return {
            ...msg,
            reactions: reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const getMessageStyle = (type: Message['type']) => {
    switch (type) {
      case 'support':
        return "bg-medical-green-light border-l-4 border-medical-green";
      case 'milestone':
        return "bg-gradient-to-r from-medical-teal-light to-medical-blue-light border-l-4 border-medical-teal";
      default:
        return "bg-card";
    }
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'support':
        return <Stethoscope className="w-4 h-4 text-medical-green" />;
      case 'milestone':
        return <Heart className="w-4 h-4 text-medical-teal" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-medical-teal to-medical-green rounded-full flex items-center justify-center">
                <Users2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-active rounded-full border-2 border-card"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">DARE Chat</h2>
              <p className="text-sm text-muted-foreground">127 membres connectés</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Community Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <Badge variant="secondary" className="text-xs">
            💚 142 succès cette semaine
          </Badge>
          <Badge variant="secondary" className="text-xs">
            🎯 89% dans la zone cible
          </Badge>
          <Badge variant="secondary" className="text-xs">
            👥 12 nouveaux membres
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in">
              <div className={`rounded-lg p-4 ${getMessageStyle(message.type)}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.avatar} alt={message.user} />
                    <AvatarFallback className="bg-medical-teal text-white text-xs">
                      {message.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {message.user}
                      </span>
                      {getMessageIcon(message.type)}
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    
                    <p className="text-foreground text-sm leading-relaxed">
                      {message.message}
                    </p>
                    
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent hover:bg-accent/80 transition-colors text-xs"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-accent-foreground">{reaction.count}</span>
                          </button>
                        ))}
                        
                        <button 
                          onClick={() => addReaction(message.id, "👍")}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-muted hover:bg-accent transition-colors text-xs"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-medical-teal rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span>{isTyping.join(', ')} en train d'écrire...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message de soutien..."
              className="border-0 bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-medical-teal hover:bg-medical-teal/90 text-white h-10 w-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>💚 Bienveillance</span>
          <span>•</span>
          <span>🤝 Entraide</span>
          <span>•</span>
          <span>🎯 Motivation commune</span>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;