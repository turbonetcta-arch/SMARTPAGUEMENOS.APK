
import React from 'react';
import { Product } from '../types';

interface FeaturedOfferProps {
  offer: Product;
}

const FeaturedOffer: React.FC<FeaturedOfferProps> = ({ offer }) => {
  if (!offer) return null;

  // Fix: Better price fallback logic
  const displayPrice = offer.offerPrice !== undefined ? offer.offerPrice : offer.price;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-10 bg-gradient-to-br from-zinc-950 via-red-950 to-zinc-950 animate-fade-in overflow-hidden">
      
      <div className="z-10 px-16 py-4 bg-yellow-400 text-black rounded-full font-black text-5xl mb-12 shadow-2xl transform -rotate-2 uppercase font-oswald animate-bounce">
        OFERTA DO DIA
      </div>

      <div className="relative z-10 w-full max-w-2xl aspect-square mb-16">
        <div className="absolute -inset-6 bg-red-600/30 blur-3xl rounded-full"></div>
        <div className="relative w-full h-full rounded-[4rem] border-[12px] border-white shadow-3xl overflow-hidden bg-zinc-900">
           <img 
            src={offer.imageUrl || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop'} 
            className="w-full h-full object-cover transform scale-105"
            alt={offer.name}
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
        </div>

        {/* Selo de Preço com Zoom Animado */}
        <div className="absolute -bottom-10 -right-10 z-20 bg-red-600 text-white p-12 rounded-[3.5rem] border-[6px] border-white shadow-3xl animate-zoom-price flex flex-col items-center justify-center">
          <span className="text-2xl font-black uppercase tracking-widest text-yellow-400 mb-2">SÓ HOJE</span>
          <div className="flex items-start">
            <span className="text-4xl font-bold mt-4 mr-1">R$</span>
            <span className="text-[10rem] font-black font-oswald leading-none tracking-tighter">
              {Math.floor(displayPrice)}
            </span>
            <div className="flex flex-col ml-1 mt-4">
               <span className="text-5xl font-black">,{(displayPrice % 1).toFixed(2).substring(2)}</span>
               <span className="text-2xl font-black uppercase opacity-60 italic">{offer.unit}</span>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-8xl font-black text-white uppercase text-center font-oswald tracking-tighter leading-none mb-6 drop-shadow-2xl">
        {offer.name}
      </h1>
      <p className="text-red-500 text-3xl font-bold uppercase tracking-[0.4em] italic">QUALIDADE PREMIUM SELECIONADA</p>
    </div>
  );
};

export default FeaturedOffer;
