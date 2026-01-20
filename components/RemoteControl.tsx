
import React from 'react';
import { Product, Category } from '../types';

interface RemoteControlProps {
  products: Product[];
  scrollSpeed: number;
  isPartnersEnabled: boolean;
  onTogglePartners: () => void;
  onUpdateScrollSpeed: (speed: number) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onToggleOffer: (id: string) => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ 
  products, 
  scrollSpeed, 
  isPartnersEnabled,
  onTogglePartners,
  onUpdateScrollSpeed, 
  onUpdatePrice, 
  onToggleOffer 
}) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-inter pb-32">
      <header className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black font-oswald tracking-tighter text-indigo-400">PAINEL REMOTO</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Controle Smart Pague Menos</p>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
      </header>

      {/* Seção de Ajustes de Painel */}
      <div className="mb-10 bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-6 space-y-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">Velocidade da Lista</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button onClick={() => onUpdateScrollSpeed(10)} className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all ${scrollSpeed <= 15 ? 'bg-red-600' : 'bg-black text-zinc-600'}`}>Rápido</button>
            <button onClick={() => onUpdateScrollSpeed(30)} className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all ${scrollSpeed > 15 && scrollSpeed <= 45 ? 'bg-yellow-500 text-black' : 'bg-black text-zinc-600'}`}>Normal</button>
            <button onClick={() => onUpdateScrollSpeed(60)} className={`py-3 rounded-xl font-black text-[10px] uppercase transition-all ${scrollSpeed > 45 ? 'bg-indigo-600' : 'bg-black text-zinc-600'}`}>Lento</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[8px] font-black uppercase text-zinc-500">Ajuste Fino</span>
               <span className="text-indigo-400 font-black">{scrollSpeed}s</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="120" 
              step="1" 
              value={scrollSpeed} 
              onChange={(e) => onUpdateScrollSpeed(parseInt(e.target.value))} 
              className="w-full accent-indigo-500" 
            />
          </div>
        </div>

        {/* Controle de Marcas Parceiras */}
        <div className="pt-4 border-t border-white/5">
           <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Marcas Parceiras</span>
              <button 
                onClick={onTogglePartners}
                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${isPartnersEnabled ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
              >
                {isPartnersEnabled ? 'VISÍVEL' : 'OCULTO'}
              </button>
           </div>
        </div>
      </div>

      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Gerenciar Produtos</h3>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-zinc-900 rounded-3xl p-5 border border-white/5 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
              </div>
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
                  value={product.price || ''}
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
    </div>
  );
};

export default RemoteControl;
