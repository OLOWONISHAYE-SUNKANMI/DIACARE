import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  onQuickAdd: () => void;
}

export function TopBar({ onQuickAdd }: TopBarProps) {
  return (
    <header className="h-16 border-b border-border bg-card/95 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-8 w-8" />
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-foreground">DiabCare</h1>
        </div>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-background/50 border-muted"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <LanguageToggle />
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>

        {/* Quick Add */}
        <Button 
          onClick={onQuickAdd}
          size="sm"
          className="bg-medical-teal hover:bg-medical-teal/90 text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
    </header>
  );
}