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
    <div className="relative w-full h-full flex flex-col items-center justify-center p-16 bg-black overflow-hidden group animate-flash">
      {/* Advanced Light Engine */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-600/10 rounded-full blur-[160px] animate-pulse opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] animate-float opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] animate-pulse opacity-20"></div>
      </div>

      {/* Broadcast Graphics Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-16 left-16 w-64 h-[1px] bg-gradient-to-r from-red-600 to-transparent"></div>
      <div className="absolute bottom-16 right-16 w-64 h-[1px] bg-gradient-to-l from-amber-600 to-transparent"></div>

      {/* Premium Sale Stamp */}
      <div className="z-20 mb-16 transform -rotate-2 hover:rotate-0 transition-all duration-700">
        <div className="relative">
          <div className="absolute -inset-2 bg-amber-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="bg-amber-500 text-black px-16 py-5 rounded-[2rem] shadow-[0_20px_60px_rgba(251,191,36,0.4)] border-b-[6px] border-amber-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            <span className="text-5xl font-black font-oswald uppercase tracking-tighter italic block">
              {isSale ? 'MEGA OFERTA DO DIA' : 'O MELHOR DA SEMANA'}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Product Viewport */}
      <div className="relative z-10 w-full max-w-2xl aspect-square mb-16 animate-float">
        {/* Glow halo */}
        <div className="absolute -inset-10 bg-gradient-to-tr from-red-600/40 via-amber-500/20 to-blue-600/10 blur-[100px] rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
        
        {/* The Frame */}
        <div className="relative w-full h-full overflow-hidden rounded-[5rem] border-[1px] border-white/20 shadow-[0_50px_120px_rgba(0,0,0,1)] glass-panel bg-black/40">
          <img 
            src={offer.imageUrl || `https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800`} 
            alt={offer.name}
            className="w-full h-full object-cover transform scale-110 group-hover:scale-105 transition-transform duration-[3000ms] ease-out opacity-90 group-hover:opacity-100"
          />
          {/* Internal gradient shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
          
          {/* Sweeping Shine Overlay */}
          <div className="absolute inset-0 shine-effect pointer-events-none opacity-30"></div>
        </div>
        
        {/* Floating Price Badge Engine */}
        <div className="absolute -bottom-12 -right-12 z-20 flex flex-col items-center justify-center min-w-[380px] bg-red-600 p-12 rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(220,38,38,0.7)] border-[6px] border-white transform rotate-3 hover:rotate-0 transition-all duration-500">
          <div className="absolute -top-8 bg-white text-red-600 px-10 py-2 rounded-full text-sm font-black uppercase tracking-[0.3em] shadow-2xl border-2 border-red-600">
            ÚLTIMAS UNIDADES
          </div>
          <div className="flex items-start gap-1">
            <span className="text-5xl font-black font-oswald mt-6 neon-text-red">R$</span>
            <span className="text-[15rem] font-black font-oswald leading-[0.75] tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              {Math.floor(displayPrice)}
            </span>
            <div className="flex flex-col mt-6">
              <span className="text-6xl font-black font-oswald text-white/95">,{ (displayPrice % 1).toFixed(2).substring(2) }</span>
              <span className="text-4xl font-bold uppercase opacity-80 mt-2 tracking-widest">{offer.unit}</span>
            </div>
          </div>
          <div className="absolute -bottom-4 right-10 bg-black/40 text-[9px] font-black text-white/60 px-4 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
            Tributos Inclusos
          </div>
        </div>
      </div>

      {/* Product Title Console */}
      <div className="z-10 text-center space-y-6 max-w-3xl">
        <h2 className="text-[6rem] font-black font-oswald uppercase tracking-tighter leading-none text-white italic drop-shadow-2xl">
          {offer.name}
        </h2>
        <div className="inline-flex items-center gap-6 px-10 py-4 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl group-hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
             <span className="text-sm font-black uppercase tracking-[0.6em] text-white/50">QUALIDADE CERTIFICADA</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20"></div>
          <span className="text-sm font-black uppercase tracking-[0.6em] text-amber-500">PAGUE MENOS</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedOffer;