
import React from 'react';
import { Product, Category } from '../types';

interface PriceListProps {
  products: Product[];
  currentCategory: Category;
  scrollSpeed?: number;
  isJsMode?: boolean;
}

const PriceList: React.FC<PriceListProps> = ({ products, currentCategory, scrollSpeed = 30, isJsMode = false }) => {
  const filteredProducts = products.filter(p => p.category === currentCategory);
  const displayProducts = [...filteredProducts, ...filteredProducts];
  const isCold = currentCategory === Category.BEBIDAS;

  if (isJsMode) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
        {/* J.S Mode Header */}
        <div className="p-8 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b-4 border-yellow-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20">
          <h2 className="text-7xl font-black text-yellow-500 italic tracking-tighter uppercase font-oswald flex items-center justify-between">
            <span className="flex items-center gap-4">
              <span className="w-4 h-14 bg-red-600"></span>
              {currentCategory}
            </span>
            <span className="text-xl bg-red-600 text-white px-4 py-1 rounded-md animate-pulse">MODO J.S ATIVO</span>
          </h2>
        </div>

        {/* J.S Mode Grid Layout */}
        <div className="flex-1 p-6 overflow-hidden">
          <div 
            className="animate-scroll-vertical flex flex-col gap-4"
            style={{ animationDuration: `${scrollSpeed}s` }}
          >
            <div className="grid grid-cols-2 gap-4">
              {displayProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`}
                  className="bg-zinc-900/80 border-2 border-zinc-800 p-6 rounded-3xl flex flex-col justify-between h-56 relative overflow-hidden group animate-gold-pulse"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl font-black text-white uppercase font-oswald leading-none group-hover:text-yellow-400 transition-colors">
                      {product.name}
                    </span>
                    <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded-lg">PREÇO J.S</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                       <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{product.unit}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-yellow-500">R$</span>
                      <span className="text-7xl font-black text-white font-oswald tracking-tighter shadow-yellow-500/20">
                        {Math.floor(product.price)}
                      </span>
                      <span className="text-3xl font-bold text-yellow-500">
                        ,{(product.price % 1).toFixed(2).substring(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Gloss Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal Mode (Original List)
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: 'var(--panel-color)' }}>
      <div 
        className="p-10 shadow-2xl z-20 border-b-4 border-black/20 relative overflow-hidden" 
        style={{ backgroundColor: isCold ? '#1d4ed8' : 'var(--primary-color)' }}
      >
        {isCold && (
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/ice-age.png')] bg-repeat"></div>
        )}
        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase font-oswald flex items-center gap-4 relative z-10">
          <span className="w-4 h-12 block" style={{ backgroundColor: isCold ? '#60a5fa' : 'var(--accent-color)' }}></span>
          {currentCategory}
          {isCold && <span className="text-2xl animate-pulse ml-auto">❄️</span>}
        </h2>
      </div>

      <div className="flex-1 relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />
        
        <div 
          className="animate-scroll-vertical flex flex-col gap-6 p-10"
          style={{ animationDuration: `${scrollSpeed}s` }}
        >
          {displayProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`}
              className={`flex items-center justify-between bg-black/40 p-8 rounded-3xl border-l-[16px] shadow-2xl transform transition-all duration-300 ${isCold ? 'hover:bg-blue-900/40' : ''}`}
              style={{ borderLeftColor: isCold ? '#3b82f6' : 'var(--primary-color)' }}
            >
              <div className="flex flex-col">
                <span className="text-5xl font-black uppercase font-oswald tracking-wide leading-tight" style={{ color: 'var(--text-color)' }}>
                  {product.name}
                </span>
                <span className="text-xl font-black tracking-[0.2em] uppercase mt-2 opacity-70" style={{ color: isCold ? '#60a5fa' : 'var(--primary-color)' }}>
                  {isCold ? 'TRINCANDO DE GELADA' : currentCategory === Category.FRUTAS ? 'SELECIONADAS' : 'QUALIDADE SELECIONADA'}
                </span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-black uppercase leading-none mb-1" style={{ color: isCold ? '#60a5fa' : 'var(--primary-color)' }}>R$</span>
                  <div className="flex items-start">
                    <span className="text-8xl font-black font-oswald leading-none tracking-tighter" style={{ color: 'var(--text-color)' }}>
                      {Math.floor(product.price)}
                    </span>
                    <span className="text-4xl font-bold leading-tight mt-1" style={{ color: 'var(--text-color)' }}>
                      ,{(product.price % 1).toFixed(2).substring(2)}
                    </span>
                  </div>
                </div>
                <span className="text-3xl font-black ml-3 uppercase italic opacity-40" style={{ color: 'var(--text-color)' }}>{product.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default PriceList;
