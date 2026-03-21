
const Loader = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 bg-[#05070A]  p-20">
      <div className="relative flex items-center justify-center">
        
        {/* Outer Glowing Ring - Rotating */}
        <div className="absolute w-24 h-24 rounded-full border-t-2 border-l-2 border-purple-500 animate-spin shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
        
        {/* Middle Pulse Ring */}
        <div className="absolute w-16 h-16 rounded-full border border-blue-500/30 animate-ping"></div>
        
        {/* Inner Core - Breathing Gradient */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)]">
          {/* Center Point */}
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        </div>

        {/* Floating Particles Simulation */}
        <div className="absolute top-[-20px] left-[-20px] w-1 h-1 bg-purple-400 rounded-full animate-pulse blur-[1px]"></div>
        <div className="absolute bottom-[-15px] right-[-10px] w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce blur-[1px]"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-2">
        Loading
        </p>
        <div className="flex gap-1 justify-center">
          <span className="w-1 h-1 bg-purple-500 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
          <span className="w-1 h-1 bg-purple-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
          <span className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_300ms]"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;