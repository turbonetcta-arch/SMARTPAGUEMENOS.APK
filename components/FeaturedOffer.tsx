
import React from 'react';
import { Product } from '../types';

interface FeaturedOfferProps {
  offer: Product;
}

const FeaturedOffer: React.FC<FeaturedOfferProps> = ({ offer }) => {
  if (!offer) return null;
  const displayPrice = offer.offerPrice !== undefined ? offer.offerPrice : offer.price;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-zinc-950 via-[#1a0000] to-zinc-950 animate-fade-in relative overflow-hidden">
      
      <div className="absolute top-10 left-10 px-8 py-3 bg-yellow-500 text-black rounded-2xl font-black text-xl shadow-2xl uppercase font-oswald transform -rotate-2 z-30">
        OFERTA ESPECIAL
      </div>

      <div className="relative z-10 w-full max-w-2xl aspect-square mb-10 flex items-center justify-center">
        <div className="absolute -inset-10 bg-red-600/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="relative w-[85%] h-[85%] rounded-[4rem] border-[10px] border-white shadow-3xl overflow-hidden bg-zinc-900 ring-1 ring-white/20">
           <img 
            src={offer.imageUrl || 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800&auto=format&fit=crop'} 
            className="w-full h-full object-cover transform scale-110"
            alt={offer.name}
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
        </div>

        {/* Price Tag UHD */}
        <div className="absolute -bottom-6 -right-6 z-20 bg-red-600 text-white px-10 py-10 rounded-[3.5rem] border-[8px] border-white shadow-4xl animate-zoom-price flex flex-col items-center justify-center">
          <div className="flex items-start">
            <span className="text-3xl font-black mt-4 mr-1">R$</span>
            <span className="text-[11rem] font-black font-oswald leading-none tracking-tighter">
              {Math.floor(displayPrice)}
            </span>
            <div className="flex flex-col ml-1 mt-4">
               <span className="text-6xl font-black">,{(displayPrice % 1).toFixed(2).substring(2)}</span>
               <span className="text-xl font-bold uppercase opacity-60 italic">{offer.unit}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center px-6">
        <h1 className="text-8xl font-black text-white uppercase font-oswald tracking-tighter leading-none mb-4 drop-shadow-2xl">
          {offer.name}
        </h1>
        <div className="h-1.5 w-32 bg-yellow-500 rounded-full mb-4"></div>
        <p className="text-zinc-500 text-2xl font-bold uppercase tracking-[0.5em] italic">QUALIDADE SELECIONADA</p>
      </div>
    </div>
  );
};

export default FeaturedOffer;
