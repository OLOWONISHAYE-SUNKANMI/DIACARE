import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GlucoseProvider } from '@/contexts/GlucoseContext';
import Modal, {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Modal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const { toast } = useToast();
  const { user, signOut, isProfessional, professionalData } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleQuickAdd = () => {
    toast({
      title: 'Nouvelle entrée',
      description: 'Fonctionnalité disponible prochainement',
    });
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <GlucoseProvider>
      <div className="h-screen w-full bg-background flex flex-col relative">
        {/* ✅ Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header
            user={user}
            onLogout={handleLogout}
            isProfessional={isProfessional}
            professionalData={professionalData}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </div>
        {/* ✅ Main content */}
        <div
          className={`flex-1 overflow-auto relative ${
            activeTab !== 'payment' ? 'pb-16' : ''
          }`}
        >
          <div className="relative h-full">{children}</div>
        </div>

      

        {/* ✅ Floating Button
        <Button
          onClick={handleQuickAdd}
          className="fixed bottom-24 right-0 w-14 h-14 rounded-full bg-medical-teal hover:bg-medical-teal/90 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 z-50 ring-4 ring-medical-teal/20"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button> */}
        {/* ✅ Fixed Bottom Navigation */}
        {activeTab !== 'payment' && (
          <div className="fixed bottom-0 left-0 right-0 z-40 hidden md:block">
            <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        )}
      </div>
    </GlucoseProvider>
  );
};

export default Layout;
