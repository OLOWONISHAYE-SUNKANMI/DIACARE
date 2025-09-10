import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  message: string;
  timestamp: string;
  type?: 'text' | 'audio' | 'image';
}

interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  diabetesType: number;
  location: string;
  diagnosisDate: string;
  lastHbA1c: number;
  recentGlucose: Array<{ time: string; value: number }>;
  medications: Array<{ name: string; dose: string }>;
  alerts: string[];
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  patientData: PatientData;
}

const ChatInterface = ({
  messages,
  onSendMessage,
  patientData,
}: ChatInterfaceProps) => {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages de bienvenue */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {t('chatInterface.Consultation.title', {
                name: patientData.firstName,
              })}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('chatInterface.Consultation.startConversation')}
            </p>
            <div className="bg-card p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">
                {t('chatInterface.Consultation.suggestions')}
              </p>
              <div className="space-y-1 text-sm">
                <button
                  onClick={() =>
                    onSendMessage(t('chatInterface.Consultation.messages.feel'))
                  }
                  className="block w-full text-left hover:bg-muted p-2 rounded"
                >
                  {t('chatInterface.Consultation.messages.feel')}
                </button>
                <button
                  onClick={() =>
                    onSendMessage(
                      t('chatInterface.Consultation.messages.concerns')
                    )
                  }
                  className="block w-full text-left hover:bg-muted p-2 rounded"
                >
                  {t('chatInterface.Consultation.messages.concerns')}
                </button>
                <button
                  onClick={() =>
                    onSendMessage(
                      t('chatInterface.Consultation.messages.glycemia')
                    )
                  }
                  className="block w-full text-left hover:bg-muted p-2 rounded"
                >
                  {t('chatInterface.Consultation.messages.glycemia')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone des messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'doctor'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatInterface.Chat.inputPlaceholder')}
            className="flex-1 min-h-[60px]"
          />

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
