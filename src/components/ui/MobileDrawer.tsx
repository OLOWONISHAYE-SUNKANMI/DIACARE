import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Home, Pill, FileText, BarChart3, Stethoscope, Users, MessageCircle, BookOpen, User, LucideIcon } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: { id: string; label: string; icon: LucideIcon; color: string }[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

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

const MobileDrawer = ({ isOpen, onClose, tabs, activeTab, onTabChange }: MobileDrawerProps) => {
  return (
<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerCloseButton />
    <DrawerHeader className="font-bold">Menu</DrawerHeader>

    <DrawerBody p={0} className="p-0"> {/* ✅ remove padding */}
      <ul className="w-full flex flex-col divide-y divide-gray-200">
        {tabs.map(({ id, label, icon: Icon, color }) => {
          const isActive = activeTab === id;
          const colors = colorVariants[color];

          return (
            <li key={id}>
              <button
                onClick={() => {
                  onTabChange?.(id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition ${
                  isActive ? colors.active : `${colors.base} ${colors.hover}`
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </DrawerBody>
  </DrawerContent>
</Drawer>

  );
};

export default MobileDrawer;
