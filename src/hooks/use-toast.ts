import { useTranslation } from 'react-i18next';
import { toast as sonnerToast } from 'sonner';

type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
  variant?: 'destructive' | 'success' | 'error' | 'default';
  type?: 'success' | 'error' | 'info';
};

export function useToast() {
  const { t } = useTranslation();

  return {
    toast: (options: ToastOptions) => {
      const { title, description, duration, type } = options;

      // Check if title or description contains "error" or "erreur"
      const isError =
        (title && title.toLowerCase().includes('error')) ||
        (title && title.toLowerCase().includes('erreur')) ||
        (description && description.toLowerCase().includes('error')) ||
        (description && description.toLowerCase().includes('erreur'));
      const translatedTitle = t(title);
      const translatedDescription = description ? t(description) : undefined;

      switch (type) {
        case 'error':
          sonnerToast.error(translatedTitle, {
            description: translatedDescription,
            duration,
          });
          break;
        case 'success':
          sonnerToast.success(translatedTitle, {
            description: translatedDescription,
            duration,
          });
          break;
        default:
          sonnerToast(translatedTitle, {
            description: translatedDescription,
            duration,
          });
      }
    },
  };
}
