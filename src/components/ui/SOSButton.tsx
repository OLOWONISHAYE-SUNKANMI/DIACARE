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
import { useTranslation } from 'react-i18next';

const SOSButton = () => {
  const { t } = useTranslation();
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
          {t('SOSButton.emergency.sosButton')}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {t('SOSButton.emergency.dialogTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('SOSButton.emergency.dialogDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
              <Phone className="w-4 h-4" />
              {t('SOSButton.emergency.contactNumbers')}
            </div>
            <div className="space-y-1 text-sm text-orange-700">
              <div>
                {t('SOSButton.emergency.samu')}: <strong>15</strong>
              </div>
              <div>
                {t('SOSButton.emergency.sosDoctors')}: <strong>3624</strong>
              </div>
              <div>
                {t('SOSButton.emergency.poisonCenter')}:{' '}
                <strong>01 40 05 48 48</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergency-message">
              {t('SOSButton.emergency.messageLabel')}
            </Label>
            <Textarea
              id="emergency-message"
              placeholder={t('SOSButton.emergency.messagePlaceholder')}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {onlineExperts.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 font-medium mb-1">
                <MessageCircle className="w-4 h-4" />
                {t('SOSButton.emergency.onlineExperts')}
              </div>
              <p className="text-sm text-green-700">
                {t('SOSButton.emergency.expertCount', {
                  count: onlineExperts.length,
                })}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('SOSButton.emergency.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSOS}
            disabled={isTriggering}
            className="bg-red-600 hover:bg-red-700"
          >
            {isTriggering
              ? t('SOSButton.emergency.sending')
              : t('SOSButton.emergency.sendRequest')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SOSButton;
