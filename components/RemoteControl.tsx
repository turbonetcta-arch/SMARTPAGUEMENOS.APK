
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
    onUpdateProducts(products.map(p => p.id === id ? { ...p, isOffer: !p.isOffer } : p));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black font-oswald text-red-600 uppercase italic">Controle Remoto</h1>
        <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">Smart Pague Menos</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <button onClick={onToggleCategory} className="bg-white text-black p-8 rounded-3xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all flex flex-col items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
          Próxima Categoria
        </button>
        <button onClick={onRotate} className="bg-indigo-600 text-white p-8 rounded-3xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all flex flex-col items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Girar Painel
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-black font-oswald uppercase text-zinc-400">Atalhos de Ofertas</h3>
        <div className="grid grid-cols-1 gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-zinc-900 p-6 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-2xl">
              <div className="flex flex-col">
                <span className="font-black uppercase text-sm truncate max-w-[150px]">{p.name}</span>
                <span className="text-zinc-500 font-bold text-xs italic">R$ {p.price.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => toggleOffer(p.id)}
                className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all ${p.isOffer ? 'bg-yellow-500 text-black' : 'bg-white/5 text-zinc-600'}`}
              >
                {p.isOffer ? 'Em Oferta' : 'Ativar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-20 text-center opacity-20 py-10">
        <p className="text-xs font-black uppercase tracking-[0.4em]">Sincronizado Localmente</p>
      </footer>
    </div>
  );
};

export default RemoteControl;
