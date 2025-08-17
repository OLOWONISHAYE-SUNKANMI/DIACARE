import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MessageCircle } from 'lucide-react';
import { useSupportFeatures } from '@/hooks/useSupportFeatures';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const SOSButton = () => {
  const { triggerSOSButton, onlineExperts } = useSupportFeatures();
  const [message, setMessage] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  const handleSOS = async () => {
    setIsTriggering(true);
    try {
      const emergencyContacts = await triggerSOSButton(message);
      setMessage('');
    } catch (err) {
      console.error('Error triggering SOS:', err);
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="lg"
          className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 animate-pulse"
        >
          <AlertTriangle className="w-5 h-5" />
          🆘 Besoin d'aide urgente
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Demande d'aide d'urgence
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ceci enverra une notification prioritaire aux experts en ligne. 
            Si c'est une urgence médicale immédiate, appelez le 15 (SAMU).
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
              <Phone className="w-4 h-4" />
              Numéros d'urgence
            </div>
            <div className="space-y-1 text-sm text-orange-700">
              <div>SAMU: <strong>15</strong></div>
              <div>SOS Médecins: <strong>3624</strong></div>
              <div>Centre antipoison: <strong>01 40 05 48 48</strong></div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency-message">
              Décrivez brièvement votre situation (optionnel)
            </Label>
            <Textarea
              id="emergency-message"
              placeholder="Ex: Hypoglycémie sévère, besoin de conseil urgent..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {onlineExperts.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                <MessageCircle className="w-4 h-4" />
                Experts disponibles
              </div>
              <p className="text-sm text-green-700">
                {onlineExperts.length} expert(s) en ligne · Temps de réponse moyen: &lt; 5 min
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSOS}
            disabled={isTriggering}
            className="bg-red-600 hover:bg-red-700"
          >
            {isTriggering ? 'Envoi...' : 'Envoyer la demande d\'urgence'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SOSButton;