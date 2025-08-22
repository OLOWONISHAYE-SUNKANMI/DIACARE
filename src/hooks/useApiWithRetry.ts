import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseApiWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
}

export const useApiWithRetry = (options: UseApiWithRetryOptions = {}) => {
  const { maxRetries = 3, retryDelay = 1000, onError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const executeWithRetry = async <T>(
    apiCall: () => Promise<T>,
    retryCount = 0
  ): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setIsLoading(false);
      return result;
    } catch (err: any) {
      if (retryCount < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay * (retryCount + 1)));
        return executeWithRetry(apiCall, retryCount + 1);
      } else {
        // Max retries reached
        setError(err);
        setIsLoading(false);
        
        if (onError) {
          onError(err);
        } else {
          toast({
            title: "Erreur de connexion",
            description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
            variant: "destructive",
          });
        }
        
        throw err;
      }
    }
  };

  const retry = (apiCall: () => Promise<any>) => {
    return executeWithRetry(apiCall, 0);
  };

  return {
    isLoading,
    error,
    retry,
    executeWithRetry
  };
};