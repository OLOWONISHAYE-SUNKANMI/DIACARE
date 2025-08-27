import { Home, BarChart3, Pill, BookOpen, User, Users, FileText, MessageCircle, Stethoscope } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  const navigationItems = [
    { id: "home", label: t('nav.home'), icon: Home },
    { id: "charts", label: t('nav.charts'), icon: BarChart3 },
    { id: "doses", label: t('nav.doses'), icon: Pill },
    { id: "consultation-request", label: t('nav.teleconsultation'), icon: Stethoscope },
    { id: "chat", label: t('nav.chat'), icon: MessageCircle },
    { id: "journal", label: t('nav.journal'), icon: FileText },
    { id: "blog", label: t('nav.blog'), icon: BookOpen },
    { id: "family", label: t('nav.family'), icon: Users },
    { id: "profile", label: t('nav.profile'), icon: User },
  ];

  const getNavClassName = (isActive: boolean) =>
    isActive 
      ? "bg-medical-green-light text-medical-green font-medium" 
      : "text-muted-foreground hover:text-foreground hover:bg-accent";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-foreground">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => onTabChange(item.id)}
                      className={getNavClassName(isActive)}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "scale-110" : ""}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}