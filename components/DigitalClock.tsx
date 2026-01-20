import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedSeconds = time.toLocaleTimeString('pt-BR', { second: '2-digit' });
  const formattedDate = time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <div className="flex flex-col items-end text-white font-oswald group">
      <div className="flex items-end gap-3">
        <span className="text-[7.5rem] font-black leading-[0.8] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tighter tabular-nums">
          {formattedTime}
        </span>
        <span className="text-4xl font-bold text-amber-500 mb-2 tabular-nums opacity-80 drop-shadow-lg">
          {formattedSeconds}
        </span>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="w-12 h-[2px] bg-red-600 rounded-full opacity-50"></div>
        <span className="text-xl uppercase font-black tracking-[0.4em] text-white/60 group-hover:text-white transition-colors duration-500">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default DigitalClock;