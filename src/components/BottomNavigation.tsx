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

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  // Assign colors for each tab to create a flowing gradient palette
  const tabs = [
    { id: "home", label: t("nav.home"), icon: Home, color: "blue" }, // light blue
    // { id: "doses", label: t("nav.doses"), icon: Pill, color: "teal" },
    { id: "journal", label: t("nav.journal"), icon: FileText, color: "coral" },
    { id: "charts", label: t("nav.charts"), icon: BarChart3, color: "orange" },
    {
      id: "consultation-request",
      label: t("nav.teleconsultation"),
      icon: Stethoscope,
      color: "blue",
    },
    { id: "family", label: t("nav.family"), icon: Users, color: "teal" },
    { id: "chat", label: t("nav.chat"), icon: MessageCircle, color: "coral" },
    { id: "blog", label: t("nav.blog"), icon: BookOpen, color: "orange" },
    { id: "profile", label: t("nav.profile"), icon: User, color: "blue" },
  ];

  // Map color to Tailwind classes
  const colorVariants = {
    blue: {
      base: "text-blue-500",
      active: "bg-blue-100 text-blue-600",
      hover: "hover:bg-blue-50 hover:text-blue-600",
    },
    teal: {
      base: "text-teal-500",
      active: "bg-teal-100 text-teal-600",
      hover: "hover:bg-teal-50 hover:text-teal-600",
    },
    coral: {
      base: "text-rose-400",
      active: "bg-rose-100 text-rose-500",
      hover: "hover:bg-rose-50 hover:text-rose-500",
    },
    orange: {
      base: "text-orange-500",
      active: "bg-orange-100 text-orange-600",
      hover: "hover:bg-orange-50 hover:text-orange-600",
    },
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area-inset-bottom backdrop-blur-md z-50 shadow-lg">
      <div className="px-2 sm:px-4 py-1 sm:py-2">
        <div className="flex justify-between md:justify-around items-center gap-1 sm:gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colors = colorVariants[tab.color];

            return (
             <button
  key={tab.id}
  onClick={() => onTabChange(tab.id)}
  className={`flex flex-col items-center justify-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
    isActive
      ? colors.active
      : `${colors.base} ${colors.hover}`
  }`}
  style={{ minWidth: "56px" }}
>
  <Icon
    className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 sm:mb-1 flex-shrink-0 transition-transform duration-300 ${
      isActive ? "scale-110" : "scale-100"
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
