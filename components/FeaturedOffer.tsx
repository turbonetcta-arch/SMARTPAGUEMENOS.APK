
import React from 'react';
import { Product } from '../types';

interface FeaturedOfferProps {
  offer: Product;
  isGenerating?: boolean;
  onGenerateArt?: () => void;
  showControls?: boolean;
}

const FeaturedOffer: React.FC<FeaturedOfferProps> = ({ offer, isGenerating, onGenerateArt, showControls }) => {
  if (!offer) return null;

  const isSale = !!offer.isOffer;
  const stampText = isSale ? "OFERTA DO DIA" : "DESTAQUE";
  const badgeText = isSale ? "SÓ HOJE" : "PREÇO DO DIA";
  const displayPrice = offer.offerPrice || offer.price;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-zinc-950 via-red-950 to-zinc-950 overflow-hidden">
      {/* Luzes de Fundo Dinâmicas */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-red-800 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Botão de Geração IA (Apenas em modo não-TV) */}
      {showControls && onGenerateArt && (
        <button 
          onClick={onGenerateArt}
          disabled={isGenerating}
          className="absolute top-10 left-10 z-[100] group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <div className={`w-6 h-6 flex items-center justify-center ${isGenerating ? 'animate-spin' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {isGenerating ? 'GERANDO ARTE...' : 'IA: NOVA ARTE'}
          </span>
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-red-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
        </button>
      )}

      {/* Anéis de Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[120%] h-[120%] border-[2px] border-white rounded-full animate-pulse-slow" />
        <div className="absolute w-[85%] h-[85%] border-[1px] border-white rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Selo de Oferta com Brilho */}
      <div className={`z-10 px-16 py-4 rounded-full font-black text-5xl mb-10 shadow-2xl transform -rotate-2 uppercase tracking-tighter font-oswald animate-bounce border-4 border-black/10 ${isSale ? 'bg-yellow-400 text-black shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 'bg-white text-red-600'}`}>
        {stampText}
      </div>

      {/* Container de Imagem com Bloom e Shimmer */}
      <div className="relative z-10 w-full max-w-2xl aspect-square mb-12 animate-bloom">
        <div className="absolute -inset-4 bg-red-600/20 blur-3xl rounded-full"></div>
        
        <div className="relative w-full h-full overflow-hidden rounded-[4rem] border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
          {isGenerating ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30">
               <div className="w-16 h-16 border-4 border-white border-t-yellow-400 rounded-full animate-spin mb-4"></div>
               <span className="text-white font-black text-xs uppercase tracking-widest animate-pulse">Criando Arte Publicitária...</span>
            </div>
          ) : null}
          <img 
            src={offer.imageUrl || 'https://picsum.photos/800/800?meat'} 
            alt={offer.name}
            className={`w-full h-full object-cover transform scale-105 transition-all duration-1000 ${isGenerating ? 'blur-sm grayscale' : ''}`}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full animate-shine pointer-events-none"></div>
        </div>
        
        {/* Selo de Preço Flutuante */}
        <div className="absolute -bottom-10 -right-10 z-20 bg-red-600 text-white p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(220,38,38,0.5)] border-4 border-white animate-float">
          <span className="block text-2xl font-bold uppercase leading-none mb-1 opacity-90">{badgeText}</span>
          <div className="flex items-start">
            <span className="text-3xl font-bold mt-2 mr-1">R$</span>
            <span className="text-9xl font-black font-oswald leading-none tracking-tighter">
              {Math.floor(displayPrice)}
            </span>
            <div className="flex flex-col ml-1">
               <span className="text-4xl font-black mt-1">,{(displayPrice % 1).toFixed(2).substring(2)}</span>
               <span className="text-2xl font-black uppercase opacity-60 italic leading-none">{offer.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nome do Produto */}
      <div className="z-10 relative">
        <h1 className="text-8xl font-black text-white uppercase text-center font-oswald tracking-tighter leading-none mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
           <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
             {offer.name}
           </span>
        </h1>
      </div>
      
      <p className="z-10 text-red-500 text-3xl font-bold uppercase tracking-[0.3em] text-center italic drop-shadow-md">
        {isSale ? 'QUALIDADE PREMIUM' : 'QUALIDADE GARANTIDA'}
      </p>
    </div>
  );
};

export default FeaturedOffer;
