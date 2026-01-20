
import React from 'react';
import { Product, Category } from '../types';

interface RemoteControlProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onRotate: () => void;
  onToggleCategory: () => void;
}

const RemoteControl: React.FC<RemoteControlProps> = ({ products, onUpdateProducts, onRotate, onToggleCategory }) => {
  const toggleOffer = (id: string) => {
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    onUpdateProducts(products.map(p => p.id === id ? { ...p, isOffer: !p.isOffer } : p));
  };

  const handleAction = (fn: () => void) => {
    if (window.navigator.vibrate) window.navigator.vibrate(100);
    fn();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans select-none overflow-x-hidden">
      <header className="mb-8 flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black font-oswald text-red-600 uppercase italic leading-none">Smart Control</h1>
          <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-1">Remote Link Active</span>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <button 
          onClick={() => handleAction(onToggleCategory)} 
          className="bg-white text-black p-10 rounded-[2.5rem] font-black text-[11px] uppercase shadow-2xl active:scale-90 transition-all flex flex-col items-center justify-center gap-4 border-b-8 border-zinc-300"
        >
          <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
          Avançar Categoria
        </button>
        <button 
          onClick={() => handleAction(onRotate)} 
          className="bg-indigo-600 text-white p-10 rounded-[2.5rem] font-black text-[11px] uppercase shadow-2xl active:scale-90 transition-all flex flex-col items-center justify-center gap-4 border-b-8 border-indigo-800"
        >
          <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Girar Painel
        </button>
      </div>

      <div className="space-y-6 pb-20">
        <div className="flex items-center justify-between border-l-4 border-yellow-500 pl-4">
          <h3 className="text-xl font-black font-oswald uppercase text-white tracking-tighter">Ofertão Rápido</h3>
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{products.length} ITENS</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {products.map(p => (
            <div 
              key={p.id} 
              className={`bg-zinc-900/50 p-6 rounded-[2rem] flex items-center justify-between border transition-all ${p.isOffer ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' : 'border-white/5'}`}
            >
              <div className="flex flex-col min-w-0 pr-4">
                <span className="font-black uppercase text-sm truncate leading-tight">{p.name}</span>
                <span className="text-zinc-500 font-black text-[10px] tracking-widest mt-0.5 uppercase italic">R$ {p.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => toggleOffer(p.id)}
                className={`flex-shrink-0 w-24 py-4 rounded-2xl font-black text-[9px] uppercase transition-all shadow-xl active:scale-95 ${p.isOffer ? 'bg-yellow-500 text-black' : 'bg-white/5 text-zinc-600 border border-white/5'}`}
              >
                {p.isOffer ? 'Ativo 🌟' : 'Oferta'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-lg border-t border-white/5 p-6 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600">Smart Pague Menos • Digital Media Control</p>
      </footer>
    </div>
  );
};

export default RemoteControl;
