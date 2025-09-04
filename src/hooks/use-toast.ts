// import { toast as sonnerToast } from "sonner";

// type LegacyToastOptions = {
//   title: string;
//   description?: string;
//   variant?: "destructive" | "success" | "error" | "default";
//   duration?: number;
// };

// export function useToast() {
//   return {
//     toast: (options: LegacyToastOptions) => {
//       const { title, description, variant, duration } = options;
//       const isError =
//         variant === "destructive" ||
//         variant === "error" ||
//         (title && title.toLowerCase().includes("erreur")) ||
//         (description && description.toLowerCase().includes("erreur")) ||
//         (title && title.toLowerCase().includes("error")) ||
//         (description && description.toLowerCase().includes("error"));

//       if (isError) {
//         sonnerToast.error(title, { description, duration });
//       } else if (variant === "success") {
//         sonnerToast.success(title, { description, duration });
//       } else {
//         sonnerToast(title, { description, duration });
//       }
//     },
//   };
// }

// import { toast as sonnerToast } from "sonner";

// type LegacyToastOptions = {
//   title: string;
//   description?: string;
//   duration?: number;
// };

// export function useToast() {
//   return {
//     toast: (options: LegacyToastOptions) => {
//       const { title, description, duration } = options;

//       // Check if title or description contains "error" or "erreur"
//       const isError =
//         (title && title.toLowerCase().includes("error")) ||
//         (title && title.toLowerCase().includes("erreur")) ||
//         (description && description.toLowerCase().includes("error")) ||
//         (description && description.toLowerCase().includes("erreur"));

//       if (isError) {
//         // Show error toast
//         sonnerToast.error(title, { description, duration });
//       } else {
//         // Show success toast
//         sonnerToast.success(title, { description, duration });
//       }
//     },
//   };
// }

import { toast as sonnerToast } from 'sonner';
import { useTranslation } from 'react-i18next';

type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
};

export function useToast() {
  const { t } = useTranslation();

  return {
    toast: (options: ToastOptions) => {
      const { title, description, duration, type } = options;

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
