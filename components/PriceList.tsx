
import React from 'react';
import { Product, Category } from '../types';

interface PriceListProps {
  products: Product[];
  currentCategory: Category;
  scrollSpeed?: number;
}

const PriceList: React.FC<PriceListProps> = ({ products, currentCategory, scrollSpeed = 45 }) => {
  const filteredProducts = products.filter(p => p.category === currentCategory);
  
  // Lista triplicada para scroll infinito perfeito
  const displayProducts = [...filteredProducts, ...filteredProducts, ...filteredProducts];
  const isCold = currentCategory === Category.BEBIDAS;

  return (
    <div className="h-full flex flex-col relative animate-flash" key={currentCategory}>
      {/* HEADER DINÂMICO DA LISTA */}
      <div className={`p-16 relative overflow-hidden z-20 border-b-2 border-white/10 ${isCold ? 'bg-blue-900/90 backdrop-blur-3xl' : 'bg-black/90 backdrop-blur-3xl'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.06] to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-12">
            <div className={`w-4 h-28 rounded-full ${isCold ? 'bg-blue-400 shadow-[0_0_50px_rgba(96,165,250,1)]' : 'bg-red-600 shadow-[0_0_50px_rgba(220,38,38,1)]'}`}></div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[7.5rem] font-black font-oswald italic uppercase tracking-tighter leading-[0.8] text-white drop-shadow-2xl">
                {currentCategory}
              </h2>
              <p className="text-xl font-bold uppercase tracking-[0.9em] text-white/40 mt-4 font-mono">
                {isCold ? 'REFRIGERAÇÃO_MÁXIMA' : 'SELEÇÃO_DIÁRIA_PREMIUM'}
              </p>
            </div>
          </div>
          {isCold && (
            <div className="p-8 rounded-[2rem] bg-blue-500/10 text-blue-400 border-2 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.2)] animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>
            </div>
          )}
        </div>
      </div>

      {/* MOTOR DE SCROLL DA LISTA */}
      <div className="flex-1 relative overflow-hidden bg-black/40">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>

        <div 
          className="animate-scroll-vertical flex flex-col gap-8 p-14"
          style={{ animationDuration: `${scrollSpeed}s` }}
        >
          {displayProducts.map((product, index) => {
            const hasBadge = (index % 3 === 0);
            const badgeText = index % 2 === 0 ? "FRESCO" : "SELECIONADO";

            return (
              <div 
                key={`${product.id}-${index}`}
                className={`group flex items-center justify-between p-14 rounded-[4rem] border-[3px] transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) hover:scale-[0.985] ${product.isOffer ? 'bg-red-600/25 border-red-600/60 shadow-[0_0_80px_rgba(220,38,38,0.2)] ring-2 ring-red-600/20' : 'bg-white/[0.05] border-white/5 hover:bg-white/[0.1] hover:border-white/10 shadow-2xl'}`}
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-8">
                    {product.isOffer ? (
                      <span className="bg-red-600 text-[13px] font-black px-6 py-2 rounded-2xl text-white uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(220,38,38,0.4)] animate-pulse ring-2 ring-white/20">PREÇO_BAIXO</span>
                    ) : hasBadge ? (
                      <span className="bg-amber-500 text-[11px] font-black px-5 py-1.5 rounded-xl text-black uppercase tracking-[0.3em] shadow-lg font-mono">{badgeText}</span>
                    ) : null}
                    <span className="text-[5.5rem] font-black font-oswald uppercase tracking-tighter text-white group-hover:text-amber-500 transition-colors duration-700 leading-none">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold text-white/20 uppercase tracking-[0.7em] font-mono">UID:</span>
                      <span className="text-[13px] font-black text-white/50 uppercase tracking-[0.5em] font-mono">{product.id}</span>
                    </div>
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full opacity-40 shadow-[0_0_10px_#dc2626]"></div>
                    <span className="text-[13px] font-bold text-white/40 uppercase tracking-[0.6em] font-medium">QUALIDADE_SMART_PAGUE_MENOS</span>
                  </div>
                </div>

                <div className="flex items-center gap-14">
                  <div className="flex flex-col items-end -space-y-6">
                    <span className="text-4xl font-black text-red-600 font-oswald uppercase tracking-widest drop-shadow-[0_6px_15px_rgba(220,38,38,0.5)]">R$</span>
                    <div className="flex items-start">
                      <span className="text-[11.5rem] font-black font-oswald leading-none tracking-tighter text-white tabular-nums drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                        {Math.floor(product.isOffer ? product.offerPrice! : product.price)}
                      </span>
                      <div className="flex flex-col ml-2 pt-6">
                        <span className="text-7xl font-black font-oswald text-white/95 tabular-nums leading-none tracking-tighter">
                          ,{( (product.isOffer ? product.offerPrice! : product.price) % 1).toFixed(2).substring(2) }
                        </span>
                        <span className="text-4xl font-black text-white/25 uppercase italic mt-3 tracking-[0.2em]">{product.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceList;
