
import React from 'react';
import { Product, Category } from '../types';

interface PriceListProps {
  products: Product[];
  currentCategory: Category;
  scrollSpeed?: number;
}

const PriceList: React.FC<PriceListProps> = ({ products, currentCategory, scrollSpeed = 30 }) => {
  const filteredProducts = products.filter(p => p.category === currentCategory);
  // Dobramos a lista para permitir rolagem infinita contínua
  const displayProducts = [...filteredProducts, ...filteredProducts];
  const isCold = currentCategory === Category.BEBIDAS;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: 'var(--panel-color)' }}>
      {/* Category Header */}
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

      {/* List Container */}
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
