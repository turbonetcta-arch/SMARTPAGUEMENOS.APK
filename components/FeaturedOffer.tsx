
import React from 'react';
import { Product } from '../types';

interface FeaturedOfferProps {
  offer: Product;
}

const FeaturedOffer: React.FC<FeaturedOfferProps> = ({ offer }) => {
  if (!offer) return null;

  const isSale = !!offer.isOffer;
  const displayPrice = offer.offerPrice || offer.price;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-20 bg-black overflow-hidden group animate-flash">
      {/* AMBIENT MEDIA SHADER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-red-600/15 rounded-full blur-[180px] animate-pulse opacity-50"></div>
        <div className="absolute top-1/3 left-1/3 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-[150px] animate-float opacity-40"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[150px] animate-pulse opacity-30"></div>
        {/* Camada de partículas ou textura */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* BROADCAST DECOR */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute top-24 left-24 w-80 h-[2px] bg-gradient-to-r from-red-600 to-transparent shadow-[0_0_20px_#dc2626]"></div>
      <div className="absolute bottom-24 right-24 w-80 h-[2px] bg-gradient-to-l from-amber-600 to-transparent shadow-[0_0_20px_#fbbf24]"></div>

      {/* URGENCY STAMP */}
      <div className="z-20 mb-20 transform -rotate-3 hover:rotate-0 transition-all duration-1000 scale-110">
        <div className="relative">
          <div className="absolute -inset-4 bg-amber-500 blur-3xl opacity-30 animate-pulse"></div>
          <div className="bg-amber-500 text-black px-20 py-7 rounded-[2.5rem] shadow-[0_30px_80px_rgba(251,191,36,0.5)] border-b-[8px] border-amber-700 relative overflow-hidden ring-4 ring-black/10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
            <span className="text-6xl font-black font-oswald uppercase tracking-tighter italic block drop-shadow-lg">
              {isSale ? 'MEGA OFERTA DO DIA' : 'O MELHOR DA SEMANA'}
            </span>
          </div>
        </div>
      </div>

      {/* HERO PRODUCT STAGE */}
      <div className="relative z-10 w-full max-w-3xl aspect-square mb-20 animate-float">
        {/* Glow halo */}
        <div className="absolute -inset-16 bg-gradient-to-tr from-red-600/50 via-amber-500/30 to-blue-600/20 blur-[130px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-[2000ms]"></div>
        
        {/* Product Frame */}
        <div className="relative w-full h-full overflow-hidden rounded-[6rem] border-2 border-white/20 shadow-[0_60px_150px_rgba(0,0,0,1)] glass-panel bg-zinc-950/40 p-1">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
          <img 
            src={offer.imageUrl || `https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800`} 
            alt={offer.name}
            className="w-full h-full object-cover transform scale-115 group-hover:scale-110 transition-transform duration-[4000ms] ease-out opacity-95 group-hover:opacity-100 filter brightness-110 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/30 to-transparent"></div>
          
          {/* Shine Sweep */}
          <div className="absolute inset-0 shine-effect pointer-events-none opacity-40"></div>
        </div>
        
        {/* FLOATING PRICE ENGINE */}
        <div className="absolute -bottom-16 -right-16 z-20 flex flex-col items-center justify-center min-w-[450px] bg-red-600 p-14 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(220,38,38,0.8)] border-[8px] border-white transform rotate-2 hover:rotate-0 transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275)">
          <div className="absolute -top-10 bg-white text-red-600 px-14 py-3 rounded-full text-lg font-black uppercase tracking-[0.4em] shadow-2xl border-[3px] border-red-600 animate-bounce">
            APROVEITE JÁ
          </div>
          <div className="flex items-start gap-2">
            <span className="text-6xl font-black font-oswald mt-8 neon-text-red drop-shadow-lg">R$</span>
            <span className="text-[18rem] font-black font-oswald leading-[0.7] tracking-tighter text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              {Math.floor(displayPrice)}
            </span>
            <div className="flex flex-col mt-8">
              <span className="text-8xl font-black font-oswald text-white/98 tabular-nums tracking-tighter leading-none">
                ,{(displayPrice % 1).toFixed(2).substring(2)}
              </span>
              <span className="text-5xl font-bold uppercase opacity-80 mt-4 tracking-[0.2em] font-oswald">{offer.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT TITLE CONSOLE */}
      <div className="z-10 text-center space-y-8 max-w-4xl">
        <h2 className="text-[7.5rem] font-black font-oswald uppercase tracking-tighter leading-[0.85] text-white italic drop-shadow-[0_20px_40px_rgba(0,0,0,1)] transition-transform group-hover:scale-105 duration-700">
          {offer.name}
        </h2>
        <div className="inline-flex items-center gap-10 px-14 py-5 bg-white/5 rounded-full border-2 border-white/15 backdrop-blur-3xl group-hover:bg-white/15 transition-all duration-500 shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></div>
             <span className="text-lg font-black uppercase tracking-[0.8em] text-white/60">PROCEDÊNCIA_SMART</span>
          </div>
          <div className="w-[2px] h-6 bg-white/20"></div>
          <span className="text-lg font-black uppercase tracking-[0.8em] text-amber-500 font-mono">CODE_4002</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedOffer;
