import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full mx-4 my-4 mb-0 rounded-lg shadow-lg overflow-hidden bg-card border border-border">
      <div className="flex items-center justify-center space-x-4 py-6 px-6 bg-gradient-to-r from-medical-green to-medical-teal">
        <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-white/20">
          <span className="text-2xl">💪</span>
        </div>
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