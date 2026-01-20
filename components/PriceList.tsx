import React from 'react';
import { Product, Category } from '../types';

interface PriceListProps {
  products: Product[];
  currentCategory: Category;
  scrollSpeed?: number;
}

const PriceList: React.FC<PriceListProps> = ({ products, currentCategory, scrollSpeed = 45 }) => {
  const filteredProducts = products.filter(p => p.category === currentCategory);
  
  // Duplicate list to ensure seamless infinite scroll
  const displayProducts = [...filteredProducts, ...filteredProducts, ...filteredProducts];
  const isCold = currentCategory === Category.BEBIDAS;

  return (
    <div className="h-full flex flex-col relative animate-flash" key={currentCategory}>
      {/* Dynamic Header Overlay */}
      <div className={`p-16 relative overflow-hidden z-20 border-b border-white/10 ${isCold ? 'bg-blue-900/90 backdrop-blur-xl' : 'bg-black/90 backdrop-blur-xl'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.04] to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-10">
            <div className={`w-3.5 h-24 rounded-full ${isCold ? 'bg-blue-400 shadow-[0_0_40px_rgba(96,165,250,0.8)]' : 'bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.8)]'}`}></div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[6.5rem] font-black font-oswald italic uppercase tracking-tighter leading-[0.85] text-white">
                {currentCategory}
              </h2>
              <p className="text-lg font-bold uppercase tracking-[0.8em] text-white/40 mt-3">
                {isCold ? 'TEMPERATURA IDEAL' : 'SELEÇÃO PREMIUM'}
              </p>
            </div>
          </div>
          {isCold && (
            <div className="p-6 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12h10M9 4v16m3-8h10M15 4v16M12 2v20"/></svg>
            </div>
          )}
        </div>
      </div>

      {/* List Engine Container */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Cinematic Vignette Overlays */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black via-black/60 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>

        <div 
          className="animate-scroll-vertical flex flex-col gap-6 p-12"
          style={{ animationDuration: `${scrollSpeed}s` }}
        >
          {displayProducts.map((product, index) => {
            const hasBadge = (index % 4 === 0);
            const badgeText = index % 2 === 0 ? "FRESCO" : "SELEÇÃO";

            return (
              <div 
                key={`${product.id}-${index}`}
                className={`group flex items-center justify-between p-12 rounded-[3.5rem] border-2 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) hover:scale-[0.985] ${product.isOffer ? 'bg-red-600/20 border-red-600/50 shadow-[0_0_60px_rgba(220,38,38,0.15)] ring-1 ring-red-600/20' : 'bg-white/[0.04] border-white/5 hover:bg-white/[0.08]'}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-6">
                    {product.isOffer ? (
                      <span className="bg-red-600 text-[12px] font-black px-4 py-1.5 rounded-full text-white uppercase tracking-[0.3em] shadow-lg animate-pulse ring-1 ring-white/20">PREÇO BAIXO</span>
                    ) : hasBadge ? (
                      <span className="bg-amber-500 text-[10px] font-black px-3 py-1 rounded-full text-black uppercase tracking-[0.2em]">{badgeText}</span>
                    ) : null}
                    <span className="text-6xl font-black font-oswald uppercase tracking-tight text-white group-hover:text-red-500 transition-colors duration-700">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-white/20 uppercase tracking-[0.6em] font-mono">ID::</span>
                      <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] font-mono">{product.id}</span>
                    </div>
                    <div className="w-2 h-2 bg-red-600 rounded-full opacity-30"></div>
                    <span className="text-[12px] font-bold text-white/30 uppercase tracking-[0.5em]">QUALIDADE GARANTIDA SMART</span>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="flex flex-col items-end -space-y-4">
                    <span className="text-3xl font-black text-red-600 font-oswald uppercase tracking-widest drop-shadow-[0_4px_10px_rgba(220,38,38,0.4)]">R$</span>
                    <div className="flex items-start">
                      <span className="text-[9.5rem] font-black font-oswald leading-none tracking-tighter text-white tabular-nums drop-shadow-2xl">
                        {Math.floor(product.isOffer ? product.offerPrice! : product.price)}
                      </span>
                      <div className="flex flex-col ml-1.5 pt-5">
                        <span className="text-6xl font-black font-oswald text-white/95 tabular-nums leading-none">
                          ,{( (product.isOffer ? product.offerPrice! : product.price) % 1).toFixed(2).substring(2) }
                        </span>
                        <span className="text-3xl font-black text-white/20 uppercase italic mt-2 tracking-widest">{product.unit}</span>
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