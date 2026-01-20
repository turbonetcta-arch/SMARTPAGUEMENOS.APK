
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
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-inter pb-40">
      <header className="flex flex-col mb-10 pb-8 border-b border-white/10">
        <h1 className="text-4xl font-black font-oswald tracking-tighter text-red-600 italic">SMART REMOTE</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] mt-1">SISTEMA DE MÍDIA DIGITAL</p>
        <div className="mt-4 flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[9px] font-black uppercase text-green-500/80">Conectado em tempo real</span>
        </div>
      </header>

      <section className="mb-12 space-y-8">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
          <header className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Velocidade da Tela</h3>
            <span className="text-red-500 font-black font-oswald text-xl">{scrollSpeed}s</span>
          </header>
          
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => onUpdateScrollSpeed(10)} className={`py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${scrollSpeed <= 15 ? 'bg-red-600 shadow-lg' : 'bg-black text-zinc-600'}`}>Rápido</button>
            <button onClick={() => onUpdateScrollSpeed(30)} className={`py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${scrollSpeed > 15 && scrollSpeed <= 45 ? 'bg-yellow-500 text-black shadow-lg' : 'bg-black text-zinc-600'}`}>Normal</button>
            <button onClick={() => onUpdateScrollSpeed(60)} className={`py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${scrollSpeed > 45 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black text-zinc-600'}`}>Lento</button>
          </div>

          <input 
            type="range" 
            min="5" 
            max="120" 
            step="1" 
            value={scrollSpeed} 
            onChange={(e) => onUpdateScrollSpeed(parseInt(e.target.value))} 
            className="w-full h-2 bg-zinc-800 rounded-full appearance-none accent-red-600" 
          />
        </div>

        <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
           <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Marcas Parceiras</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase mt-1">Banner rotativo inferior</span>
           </div>
           <button 
              onClick={onTogglePartners}
              className={`w-16 h-8 rounded-full relative transition-all duration-500 ${isPartnersEnabled ? 'bg-green-600' : 'bg-zinc-800'}`}
           >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${isPartnersEnabled ? 'left-9 shadow-lg' : 'left-1'}`}></div>
           </button>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 pl-2">Lista de Produtos</h3>
        {products.map(product => (
          <div key={product.id} className={`bg-zinc-900 rounded-[2.5rem] p-6 border transition-all duration-500 ${product.isOffer ? 'border-yellow-500/20 shadow-[0_15px_30px_rgba(234,179,8,0.05)]' : 'border-white/5'}`}>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/5 shadow-inner">
                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-800" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black font-oswald uppercase text-xl truncate leading-none text-white">{product.name}</h4>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{product.category}</p>
              </div>
              <button 
                onClick={() => onToggleOffer(product.id)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${product.isOffer ? 'bg-yellow-500 text-black shadow-lg scale-110' : 'bg-zinc-800 text-zinc-600'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={product.isOffer ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-xs">R$</span>
                <input 
                  type="number" 
                  step="0.01" 
                  value={product.price || ''}
                  onChange={(e) => onUpdatePrice(product.id, parseFloat(e.target.value))}
                  className="w-full bg-black rounded-[1.5rem] py-5 pl-12 pr-4 font-black text-2xl outline-none focus:ring-2 ring-red-600 transition-all font-oswald"
                />
              </div>
              <div className="px-6 py-5 bg-zinc-800 rounded-[1.5rem] font-black text-xs uppercase text-zinc-500">
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
