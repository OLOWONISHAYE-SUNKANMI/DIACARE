import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full rounded-2xl m-4 mb-0 shadow-2xl overflow-hidden" style={{background: 'var(--gradient-header)'}}>
      <div className="flex items-center justify-center space-x-4 py-10 px-6">
        <div className="flex items-center justify-center w-20 h-20 bg-black/20 rounded-full shadow-xl backdrop-blur-xl border border-white/20">
          <span className="text-4xl filter drop-shadow-lg">💪</span>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-black tracking-wider text-white drop-shadow-2xl">DARE</h1>
          <p className="text-base text-white/80 tracking-wide font-medium mt-2 drop-shadow-lg">
            Diabetes Awareness, Routine & Empowerment
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;