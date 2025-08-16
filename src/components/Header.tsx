import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-primary to-medical-teal text-primary-foreground p-4 shadow-lg">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wide">DARE</h1>
          <p className="text-xs text-white/90 tracking-wide">
            Diabetes Awareness, Routine & Empowerment
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;