import React from 'react';
import { Product, Category } from '../types';

interface PriceListProps {
  products: Product[];
  currentCategory: Category;
  scrollSpeed?: number;
}

const PriceList: React.FC<PriceListProps> = ({ products, currentCategory, scrollSpeed = 45 }) => {
  const filteredProducts = products.filter(p => p.category === currentCategory);
  const displayProducts = [...filteredProducts, ...filteredProducts, ...filteredProducts];
  const isCold = currentCategory === Category.BEBIDAS;

  return (
    <div className="h-full flex flex-col relative animate-flash" key={currentCategory}>
      {/* HEADER DA LISTA */}
      <div className={`p-12 px-16 relative overflow-hidden z-20 border-b-4 border-white/10 ${isCold ? 'bg-blue-900/95' : 'bg-black/95'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-12">
            <div className={`w-3 h-28 rounded-full ${isCold ? 'bg-blue-400 shadow-[0_0_40px_rgba(96,165,250,1)]' : 'bg-red-600 shadow-[0_0_40px_rgba(220,38,38,1)]'}`}></div>
            <div className="flex flex-col">
              <h2 className="text-[7rem] font-black font-oswald italic uppercase tracking-tighter leading-none text-white drop-shadow-2xl">
                {currentCategory}
              </h2>
              <p className="text-lg font-bold uppercase tracking-[0.8em] text-white/30 mt-3 font-mono">
                {isCold ? 'SYSTEM_COLD_UNIT' : 'QUALITY_PROCESSED'}
              </p>
            </div>
          </div>
          {isCold && (
            <div className="p-8 rounded-[2rem] bg-blue-500/10 text-blue-400 border-2 border-blue-500/30 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>
            </div>
          )}
        </div>
      </div>

      {/* MOTOR DE SCROLL */}
      <div className="flex-1 relative overflow-hidden bg-black/60">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black z-10 pointer-events-none"></div>

        <div 
          className="animate-scroll-vertical flex flex-col gap-8 p-12 px-16"
          style={{ animationDuration: `${scrollSpeed}s` }}
        >
          {displayProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`}
              className={`group flex items-center justify-between p-12 rounded-[3.5rem] border-[4px] transition-all duration-700 ${product.isOffer ? 'bg-red-600/30 border-red-600/70 shadow-[0_0_60px_rgba(220,38,38,0.25)]' : 'bg-white/[0.04] border-white/5 shadow-2xl hover:bg-white/[0.08]'}`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-8">
                  {product.isOffer && (
                    <span className="bg-red-600 text-[11px] font-black px-5 py-1.5 rounded-xl text-white uppercase tracking-[0.3em] shadow-lg animate-pulse">OFERTA</span>
                  )}
                  <span className="text-[5.5rem] font-black font-oswald uppercase tracking-tighter text-white leading-none">
                    {product.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-bold text-white/30 tracking-[0.6em] font-mono">
                  <span>REF_{product.id}</span>
                  <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                  <span>QUALIDADE_EXTRA</span>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="flex flex-col items-end -space-y-4">
                  <span className="text-3xl font-black text-red-600 font-oswald italic">R$</span>
                  <div className="flex items-start">
                    <span className="text-[11rem] font-black font-oswald leading-none tracking-tighter text-white tabular-nums">
                      {Math.floor(product.isOffer ? product.offerPrice! : product.price)}
                    </span>
                    <div className="flex flex-col ml-1.5 pt-4">
                      <span className="text-7xl font-black font-oswald text-white/90 tabular-nums leading-none tracking-tighter">
                        ,{( (product.isOffer ? product.offerPrice! : product.price) % 1).toFixed(2).substring(2) }
                      </span>
                      <span className="text-3xl font-black text-white/20 uppercase italic mt-2 font-oswald">{product.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceList;
