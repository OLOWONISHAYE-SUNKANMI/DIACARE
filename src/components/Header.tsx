import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full rounded-3xl m-4 mb-0 shadow-2xl overflow-hidden" style={{background: 'var(--gradient-header)'}}>
      <div className="flex items-center justify-center space-x-4 py-8 px-6">
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full shadow-lg backdrop-blur-sm">
          <span className="text-3xl">💪</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-wider text-white drop-shadow-lg">DARE</h1>
          <p className="text-sm text-white/85 tracking-wide font-light mt-1">
            Diabetes Awareness, Routine & Empowerment
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;