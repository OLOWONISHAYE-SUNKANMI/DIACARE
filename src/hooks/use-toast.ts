import { toast as sonnerToast } from 'sonner';

type LegacyToastOptions = {
  title: string;
  description?: string;
  duration?: number;
  variant?: 'destructive' | 'success' | 'error' | 'default';
};

export function useToast() {
  return {
    toast: (options: LegacyToastOptions) => {
      const { title, description, duration } = options;

      // Check if title or description contains "error" or "erreur"
      const isError =
        (title && title.toLowerCase().includes('error')) ||
        (title && title.toLowerCase().includes('erreur')) ||
        (description && description.toLowerCase().includes('error')) ||
        (description && description.toLowerCase().includes('erreur'));

      if (isError) {
        // Show error toast
        sonnerToast.error(title, { description, duration });
      } else {
        // Show success toast
        sonnerToast.success(title, { description, duration });
      }
    },
  };
}
