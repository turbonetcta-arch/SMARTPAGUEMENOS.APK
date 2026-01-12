
import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });

  return (
    <div className="flex flex-col items-end text-white font-oswald">
      <span className="text-8xl font-black leading-none drop-shadow-lg">{formattedTime}</span>
      <span className="text-lg uppercase font-bold tracking-[0.2em] text-yellow-400 mt-1 opacity-95 drop-shadow-md">{formattedDate}</span>
    </div>
  );
};

export default DigitalClock;
