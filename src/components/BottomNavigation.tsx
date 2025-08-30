import {
  Home,
  BarChart3,
  Pill,
  BookOpen,
  User,
  Users,
  FileText,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { t } = useTranslation();

  const tabs = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "doses", label: t("nav.doses"), icon: Pill },
    { id: "journal", label: t("nav.journal"), icon: FileText },
    { id: "charts", label: t("nav.charts"), icon: BarChart3 },
    {
      id: "consultation-request",
      label: t("nav.teleconsultation"),
      icon: Stethoscope,
    },
    { id: "family", label: t("nav.family"), icon: Users },
    { id: "chat", label: t("nav.chat"), icon: MessageCircle },
    { id: "blog", label: t("nav.blog"), icon: BookOpen },
    { id: "profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-safe-area-inset-bottom backdrop-blur-sm z-50">
      <div className="px-2 sm:px-4 py-1 sm:py-2">
        {/* Scrollable row for small screens, evenly spaced for larger */}
        <div className="flex justify-between md:justify-around items-center gap-1 sm:gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "bg-medical-green-light text-medical-green"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                style={{ minWidth: "56px" }} // touch target (44px is too tight)
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 flex-shrink-0 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium truncate max-w-[70px] text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
