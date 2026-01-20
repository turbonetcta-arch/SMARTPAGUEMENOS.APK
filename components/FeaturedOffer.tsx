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
      {/* SHADERS DE FUNDO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-red-600/15 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      {/* STAMP DE URGÊNCIA */}
      <div className="z-20 mb-12 transform -rotate-2 hover:rotate-0 transition-transform duration-1000">
        <div className="bg-amber-500 text-black px-16 py-6 rounded-[2rem] shadow-[0_25px_60px_rgba(251,191,36,0.4)] border-b-8 border-amber-700 relative overflow-hidden">
          <span className="text-5xl font-black font-oswald uppercase tracking-tighter italic block">
            {isSale ? 'SUPER OFERTA' : 'DESTAQUE'}
          </span>
        </div>
      </div>

      {/* IMAGEM DO PRODUTO ORGANIZADA */}
      <div className="relative z-10 w-full max-w-2xl aspect-square mb-12 animate-float">
        <div className="absolute -inset-10 bg-gradient-to-tr from-red-600/40 via-amber-500/20 to-transparent blur-[100px] rounded-full opacity-40 transition-opacity duration-[2000ms]"></div>
        
        <div className="relative w-full h-full overflow-hidden rounded-[5rem] border-4 border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.9)] bg-zinc-950/50 p-1">
          <img 
            src={offer.imageUrl || `https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800`} 
            alt={offer.name}
            className="w-full h-full object-cover transform scale-105 group-hover:scale-115 transition-transform duration-[5000ms] ease-out filter brightness-110 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
        </div>
        
        {/* PREÇO FLUTUANTE */}
        <div className="absolute -bottom-10 -right-10 z-20 flex flex-col items-center justify-center min-w-[380px] bg-red-600 p-10 rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(220,38,38,0.8)] border-[6px] border-white transform rotate-3">
          <div className="flex items-start gap-1">
            <span className="text-5xl font-black font-oswald mt-6 text-white/80">R$</span>
            <span className="text-[14rem] font-black font-oswald leading-[0.7] tracking-tighter text-white drop-shadow-2xl">
              {Math.floor(displayPrice)}
            </span>
            <div className="flex flex-col mt-6 ml-2">
              <span className="text-7xl font-black font-oswald text-white leading-none">
                ,{(displayPrice % 1).toFixed(2).substring(2)}
              </span>
              <span className="text-4xl font-bold uppercase opacity-60 mt-3 font-oswald">{offer.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TÍTULO DO PRODUTO */}
      <div className="z-10 text-center space-y-6 max-w-2xl">
        <h2 className="text-[6rem] font-black font-oswald uppercase tracking-tighter leading-[0.85] text-white italic drop-shadow-2xl transition-transform group-hover:scale-105 duration-700">
          {offer.name}
        </h2>
        <div className="inline-flex items-center gap-6 px-10 py-4 bg-white/5 rounded-full border-2 border-white/10 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-sm font-black uppercase tracking-[0.5em] text-white/50">QUALIDADE_TOTAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedOffer;
