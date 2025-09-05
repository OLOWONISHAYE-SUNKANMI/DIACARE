import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useTranslation } from 'react-i18next';
import { Title } from '@radix-ui/react-dialog';

export function Toaster() {
  const { toasts } = useToast();
  const { t } = useTranslation();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{t('toastMessage.title')}</ToastTitle>}
              {description && (
                <ToastDescription>
                  {t('toastMessage.description')}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      {/* {toasts.length > 0 && <ToastViewport />} */}
      
      <ToastViewport />
    </ToastProvider>
  );
}
