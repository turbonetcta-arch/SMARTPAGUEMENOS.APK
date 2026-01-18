
import React, { useState } from 'react';
import { Product } from '../types';

interface FeaturedOfferProps {
  offer: Product;
  isGenerating?: boolean;
  onGenerateArt?: (style: 'photo' | 'ad') => void;
  showControls?: boolean;
  isPartnersEnabled?: boolean;
}

const FeaturedOffer: React.FC<FeaturedOfferProps> = ({ 
  offer, 
  isGenerating, 
  onGenerateArt, 
  showControls,
  isPartnersEnabled 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!offer) return null;

  const isSale = !!offer.isOffer;
  const stampText = isSale ? "OFERTA DO DIA" : "DESTAQUE";
  const badgeText = isSale ? "SÓ HOJE" : "PREÇO DO DIA";
  const displayPrice = offer.offerPrice || offer.price;

  const handleSelectStyle = (style: 'photo' | 'ad') => {
    if (onGenerateArt) onGenerateArt(style);
    setShowMenu(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-zinc-950 via-red-950 to-zinc-950 overflow-hidden">
      {/* Luzes de Fundo Dinâmicas */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-red-600 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-red-800 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Botão de Geração IA com Menu de Seleção */}
      {showControls && onGenerateArt && (
        <div className="absolute top-10 left-10 z-[110] flex flex-col items-start gap-2">
          <button 
            onClick={() => !isGenerating && setShowMenu(!showMenu)}
            disabled={isGenerating}
            className={`group flex items-center gap-4 px-8 py-4 rounded-2xl border transition-all active:scale-95 disabled:opacity-80 shadow-2xl ${isGenerating ? 'bg-indigo-600 border-indigo-400' : 'bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-xl'}`}
          >
            <div className="relative">
              {isGenerating && (
                <div className="absolute -inset-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2.5" 
                className={isGenerating ? 'opacity-50' : 'group-hover:rotate-12 transition-transform'}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-none">
                {isGenerating ? 'IA: REIMAGINANDO...' : 'IA: NOVA ARTE'}
              </span>
              {!isGenerating && <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest mt-1">Escolher Estilo</span>}
            </div>
          </button>

          {/* Menu de Seleção de Estilo */}
          {showMenu && !isGenerating && (
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 flex flex-col gap-2 w-72 shadow-3xl animate-title-slide">
               <button 
                onClick={() => handleSelectStyle('ad')}
                className="flex items-center gap-4 p-4 hover:bg-white/10 rounded-2xl transition-all text-left"
               >
                 <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest">Anúncio Gourmet</span>
                    <span className="text-white/40 text-[8px] font-bold">Cenário e iluminação premium</span>
                 </div>
               </button>

               <button 
                onClick={() => handleSelectStyle('photo')}
                className="flex items-center gap-4 p-4 hover:bg-white/10 rounded-2xl transition-all text-left"
               >
                 <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-white font-black text-[10px] uppercase tracking-widest">Foto Realista</span>
                    <span className="text-white/40 text-[8px] font-bold">Fundo limpo e foco no produto</span>
                 </div>
               </button>
            </div>
          )}
        </div>
      )}

      {/* Selo Grande Superior */}
      {!isPartnersEnabled && (
        <div 
          key={`stamp-${offer.id}`}
          className={`z-10 px-16 py-4 rounded-full font-black text-5xl mb-10 shadow-2xl transform -rotate-2 uppercase tracking-tighter font-oswald border-4 border-black/10 transition-all duration-500 animate-stamp-pop ${isSale ? 'bg-yellow-400 text-black shadow-[0_0_40px_rgba(250,204,21,0.4)]' : 'bg-white text-red-600'}`}
        >
          {stampText}
        </div>
      )}

      {/* Container de Imagem */}
      <div className={`relative z-10 w-full max-w-2xl aspect-square animate-bloom transition-all duration-500 ${isPartnersEnabled ? 'mb-4' : 'mb-12'}`}>
        <div className="absolute -inset-4 bg-red-600/20 blur-3xl rounded-full"></div>
        
        <div className="relative w-full h-full overflow-hidden rounded-[4rem] border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30 transition-all duration-500">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
               </div>
               <span className="text-white font-black text-sm uppercase tracking-[0.3em] mt-8 animate-pulse text-center px-10">
                  Refinando Detalhes<br/>da sua Oferta
               </span>
            </div>
          )}
          <img 
            key={`img-${offer.id}`}
            src={offer.imageUrl || 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop'} 
            alt={offer.name}
            className={`w-full h-full object-cover transform scale-105 transition-all duration-1000 ${isGenerating ? 'blur-sm scale-110 opacity-50' : 'opacity-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full animate-shine pointer-events-none"></div>
        </div>
        
        {/* Selo de Preço Flutuante com Animação de IMPACTO */}
        <div 
          key={`price-tag-${offer.id}`}
          className="absolute -bottom-10 -right-10 z-20 bg-red-600 text-white p-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(220,38,38,0.5)] border-4 border-white min-w-[320px] animate-price-impact"
        >
          <div className="flex justify-between items-start mb-2 overflow-hidden">
             <span className="text-2xl font-bold uppercase leading-none opacity-90 animate-title-slide">{badgeText}</span>
             
             {isPartnersEnabled && (
                <span 
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter border-2 border-black/10 shadow-sm animate-stamp-pop ${isSale ? 'bg-yellow-400 text-black' : 'bg-white text-red-600'}`}
                >
                   {stampText}
                </span>
             )}
          </div>
          
          <div className="flex items-start">
            <span className="text-3xl font-bold mt-2 mr-1">R$</span>
            <div className="flex flex-row items-baseline">
              <span className="text-9xl font-black font-oswald leading-none tracking-tighter drop-shadow-xl">
                {Math.floor(displayPrice)}
              </span>
              <div className="flex flex-col ml-1">
                 <span className="text-4xl font-black mt-1">,{(displayPrice % 1).toFixed(2).substring(2)}</span>
                 <span className="text-2xl font-black uppercase opacity-60 italic leading-none">{offer.unit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nome do Produto com Animação de Título */}
      <div 
        key={`product-name-${offer.id}`}
        className={`z-10 relative transition-all duration-500 animate-title-slide ${isPartnersEnabled ? 'mt-8' : ''}`}
      >
        <h1 className="text-8xl font-black text-white uppercase text-center font-oswald tracking-tighter leading-none mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
           <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
             {offer.name}
           </span>
        </h1>
      </div>
      
      <p 
        key={`product-desc-${offer.id}`}
        className="z-10 text-red-500 text-3xl font-bold uppercase tracking-[0.3em] text-center italic drop-shadow-md animate-title-slide" 
        style={{ animationDelay: '0.15s' }}
      >
        {isSale ? 'QUALIDADE PREMIUM' : 'QUALIDADE GARANTIDA'}
      </p>
    </div>
  );
};

export default FeaturedOffer;
