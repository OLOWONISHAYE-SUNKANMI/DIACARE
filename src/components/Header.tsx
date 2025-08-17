import { Heart } from "lucide-react";

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
  isProfessional?: boolean;
  professionalData?: any;
}

const Header = ({ user, onLogout, isProfessional, professionalData }: HeaderProps) => {
  return (
    <header className="w-full mx-4 my-4 mb-0 rounded-lg shadow-lg overflow-hidden bg-card border border-border">
      <div className="flex items-center justify-center py-6 px-6 bg-gradient-to-r from-medical-green to-medical-teal">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide text-white">DARE</h1>
          <p className="text-sm text-white/90 tracking-wide font-medium">
            Diabetes Awareness, Routine & Empowerment
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;