// import { Heart, TestTube } from "lucide-react";
// import { useTranslation } from 'react-i18next';
// import LanguageToggle from './ui/LanguageToggle';
// import { Button } from './ui/button';
// import { useAuth } from '@/contexts/AuthContext';

// interface HeaderProps {
//   user?: any;
//   onLogout?: () => void;
//   isProfessional?: boolean;
//   professionalData?: any;
// }

// const Header = ({ user, onLogout, isProfessional, professionalData }: HeaderProps) => {
//   const { t } = useTranslation();
//   const { isTestMode, toggleTestMode } = useAuth();
  
//   return (
//     <header className="w-full bg-gradient-to-r from-medical-green to-medical-teal border-b border-border/20 pt-safe-area-inset-top">
//       <div className="flex items-center justify-between py-4 px-4 pb-3">
//         <div className="text-center flex-1">
//           <h1 className="text-2xl font-bold tracking-wide text-white">{t('appName')}</h1>
//         </div>
//         <div className="ml-4 flex items-center space-x-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleTestMode}
//             className={`text-white hover:text-white hover:bg-white/20 ${
//               isTestMode ? 'bg-white/30' : ''
//             }`}
//           >
//             <TestTube className="w-4 h-4" />
//           </Button>
//           <LanguageToggle />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useState } from "react";
import {
  Home,
  Pill,
  FileText,
  BarChart3,
  Stethoscope,
  Users,
  MessageCircle,
  BookOpen,
  User,
  TestTube,
  Menu,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./ui/LanguageToggle";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
  isProfessional?: boolean;
  professionalData?: any;
  onTabChange?: (tab: string) => void;
}

const Header = ({ user, onLogout, isProfessional, professionalData, onTabChange, activeTab, }: HeaderProps) => {
  const { t } = useTranslation();
  const { isTestMode, toggleTestMode } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleClick = (id: number) => {
    setMenuOpen(false)

    onTabChange(id)
  }
  return (
    <header className="w-full bg-gradient-to-r from-medical-green to-medical-teal border-b border-border/20 pt-safe-area-inset-top relative">
      <div className="flex items-center justify-between py-4 px-4">
        {/* App Name */}
        <h1 className="text-2xl font-bold tracking-wide text-white">{t("appName")}</h1>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTestMode}
            className={`text-white hover:text-white hover:bg-white/20 ${
              isTestMode ? "bg-white/30" : ""
            }`}
          >
            <TestTube className="w-4 h-4" />
          </Button>
          <LanguageToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/20 rounded-md"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? " opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col divide-y divide-gray-200 absolute">
          {tabs.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
              onClick={() => handleClick(id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
              >
                <Icon className="w-5 h-5 text-medical-teal" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
