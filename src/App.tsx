import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import PaymentSuccess from './components/screens/PaymentSuccess';
import PaymentScreen from './components/screens/PaymentScreen';
import { ProfessionalDashboard } from './components/screens/ProfessionalDashboard';
import { ProfessionalRegistrationScreen } from './components/screens/ProfessionalRegistrationScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent = () => {
  const { isOnline } = useOfflineDetection();

  return (
    <>
      {!isOnline && (
        <div className="offline-indicator show">
          📡 Mode hors ligne - Certaines fonctionnalités sont limitées
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/payment"
            element={
              <PaymentScreen
                onBack={() => window.history.back()}
                onPaymentSuccess={() =>
                  (window.location.href = '/payment-success')
                }
              />
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route
            path="/professional-registration"
            element={
              <ProtectedRoute>
                <ProfessionalRegistrationScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professional-dashboard"
            element={<ProfessionalDashboard />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route path="/professional" element={<ProfessionalDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
