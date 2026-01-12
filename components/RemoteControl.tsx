
import React from 'react';
import { Product, Category } from '../types';

interface RemoteControlProps {
  products: Product[];
  onUpdatePrice: (id: string, price: number) => void;
  onToggleOffer: (id: string) => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ products, onUpdatePrice, onToggleOffer }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-inter">
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black font-oswald tracking-tighter text-indigo-400">REMOTE PANEL</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Controle Smart Pague Menos</p>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
      </header>

      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-zinc-900 rounded-3xl p-5 border border-white/5 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <img src={product.imageUrl || 'https://via.placeholder.com/100'} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-black font-oswald uppercase text-lg truncate leading-none">{product.name}</h3>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">{product.category}</span>
              </div>
              <button 
                onClick={() => onToggleOffer(product.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${product.isOffer ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs">R$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  value={product.price}
                  onChange={(e) => onUpdatePrice(product.id, parseFloat(e.target.value))}
                  className="w-full bg-black rounded-2xl py-4 pl-10 pr-4 font-black text-xl outline-none focus:ring-2 ring-indigo-500 transition-all"
                />
              </div>
              <div className="px-4 py-4 bg-zinc-800 rounded-2xl font-black text-xs uppercase text-zinc-400">
                {product.unit}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
        Conectado ao Monitor Principal
      </footer>
    </div>
  );
};

export default RemoteControl;
