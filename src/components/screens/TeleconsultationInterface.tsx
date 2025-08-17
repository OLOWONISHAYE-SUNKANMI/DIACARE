import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PatientDataPanel from '@/components/ui/PatientDataPanel';
import ChatInterface from '@/components/ui/ChatInterface';
import { Phone, Video, FileText, Clock, DollarSign } from 'lucide-react';

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

interface ConsultationData {
  id: string;
  patient: PatientData;
  startedAt: string;
  amount: number;
}

interface TeleconsultationInterfaceProps {
  consultation: ConsultationData;
}

const TeleconsultationInterface = ({ consultation }: TeleconsultationInterfaceProps) => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [prescription, setPrescription] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [consultationDuration, setConsultationDuration] = useState('0 min');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);

  useEffect(() => {
    const startTime = new Date(consultation.startedAt);
    const updateDuration = () => {
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      setConsultationDuration(`${diffMinutes} min`);
    };

    updateDuration();
    const interval = setInterval(updateDuration, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [consultation.startedAt]);

  const sendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'doctor',
      message,
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setChatMessages(prev => [...prev, newMessage]);

    // Simulate patient response after a delay
    setTimeout(() => {
      const patientResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'patient',
        message: "Merci docteur, je me sens mieux aujourd'hui.",
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setChatMessages(prev => [...prev, patientResponse]);
    }, 2000);
  };

  const endConsultation = () => {
    toast({
      title: "Consultation terminée",
      description: `${consultation.amount} F CFA ajoutés à vos revenus`,
    });
    
    // TODO: Implement actual consultation ending logic
    console.log('Ending consultation with notes:', consultationNotes);
    console.log('Prescription:', prescription);
  };

  const extendConsultation = () => {
    toast({
      title: "Consultation prolongée",
      description: "15 minutes supplémentaires ajoutées (+250 F CFA)",
    });
  };

  const toggleAudio = () => {
    setIsAudioActive(!isAudioActive);
    toast({
      title: isAudioActive ? "Audio désactivé" : "Audio activé",
    });
  };

  const toggleVideo = () => {
    setIsVideoActive(!isVideoActive);
    toast({
      title: isVideoActive ? "Vidéo désactivée" : "Vidéo activée",
    });
  };

  const openPrescriptionModal = () => {
    toast({
      title: "Prescription",
      description: "Module de prescription en cours de développement",
    });
  };

  return (
    <div className="h-screen flex">
      {/* Panel données patient (gauche) */}
      <div className="w-1/3 bg-card border-r overflow-y-auto">
        <PatientDataPanel patient={consultation.patient} />
      </div>
      
      {/* Zone consultation principale */}
      <div className="flex-1 flex flex-col">
        {/* Header consultation */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                Consultation avec {consultation.patient.firstName}
              </h3>
              <p className="text-primary-foreground/80 text-sm flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Démarrée il y a {consultationDuration}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {consultation.amount} F CFA
                </span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={toggleAudio}
                variant={isAudioActive ? "secondary" : "outline"}
                size="sm"
                className={isAudioActive ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <Phone className="w-4 h-4 mr-2" />
                Audio
              </Button>
              <Button
                onClick={toggleVideo}
                variant={isVideoActive ? "secondary" : "outline"}
                size="sm"
                className={isVideoActive ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <Video className="w-4 h-4 mr-2" />
                Vidéo
              </Button>
              <Button
                onClick={openPrescriptionModal}
                variant="outline"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                Prescrire
              </Button>
            </div>
          </div>
        </div>
        
        {/* Zone chat */}
        <div className="flex-1 bg-muted/30 p-4 overflow-hidden">
          <ChatInterface 
            messages={chatMessages}
            onSendMessage={sendMessage}
            patientData={consultation.patient}
          />
        </div>
        
        {/* Zone notes consultation */}
        <div className="bg-card border-t p-4">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            📝 Notes de consultation
          </h4>
          <Textarea
            value={consultationNotes}
            onChange={(e) => setConsultationNotes(e.target.value)}
            placeholder="Notez vos observations, diagnostics, recommandations..."
            className="w-full h-24 resize-none"
          />
        </div>
        
        {/* Actions fin consultation */}
        <div className="bg-muted p-4 flex gap-3">
          <Button 
            onClick={endConsultation}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            ✅ Terminer Consultation ({consultation.amount} F CFA ajouté)
          </Button>
          <Button 
            onClick={extendConsultation}
            variant="outline"
            size="lg"
            className="px-8"
          >
            <Clock className="w-4 h-4 mr-2" />
            Prolonger (+250 F)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeleconsultationInterface;