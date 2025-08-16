import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full mx-4 my-6 mb-0 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/30" style={{background: 'rgba(255, 255, 255, 0.2)'}}>
      <div className="flex items-center justify-center space-x-5 py-12 px-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full shadow-xl backdrop-blur-sm border border-white/40" style={{background: 'rgba(255, 255, 255, 0.15)'}}>
          <span className="text-4xl filter drop-shadow-lg">💪</span>
        </div>
        <div className="text-center">
          <h1 className="text-6xl font-black tracking-wider text-white drop-shadow-2xl filter">DARE</h1>
          <p className="text-lg text-white/80 tracking-wide font-light mt-3 drop-shadow-lg">
            Diabetes Awareness, Routine & Empowerment
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;