
import React, { useState, useRef, useMemo } from 'react';
import { Product, Category, ThemeSettings, Partner, MediaConfig } from '../types';

interface AdminMenuProps {
  products: Product[];
  theme: ThemeSettings;
  partners: Partner[];
  onUpdatePartners: (partners: Partner[]) => void;
  isTvMode: boolean;
  zoomOffset: number;
  fitMode: 'contain' | 'stretch';
  onUpdateFitMode: (mode: 'contain' | 'stretch') => void;
  onUpdateZoom: (zoom: number) => void;
  isHortifrutiEnabled: boolean;
  onToggleHortifruti: () => void;
  onToggleTvMode: () => void;
  onUpdateTheme: (theme: ThemeSettings) => void;
  onClose: () => void;
  onUpdatePrice: (id: string, newPrice: number) => void;
  onUpdateImage: (id: string, newImageUrl: string) => void;
  onToggleOffer: (id: string) => void;
  onBulkToggleOffers: (isOffer: boolean) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (id: string) => void;
  onRotate90: () => void;
  onSpin360: () => void;
  currentRotation: number;
  isSpinning: boolean;
  onUpdateName?: (id: string, name: string) => void;
  mediaConfig: MediaConfig;
  onUpdateMedia: (config: MediaConfig | ((prev: MediaConfig) => MediaConfig)) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, onClose, onUpdatePrice, onToggleOffer, onAddProduct, onUpdateImage, mediaConfig, onUpdateMedia, onRotate90, currentRotation
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'media' | 'hardware' | 'remote'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [mediaUploadType, setMediaUploadType] = useState<'logo' | 'bg' | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && mediaUploadType) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onUpdateMedia(prev => ({
          ...prev,
          [mediaUploadType === 'logo' ? 'logoUrl' : 'bgImageUrl']: dataUrl
        }));
      };
      reader.readAsDataURL(file);
      setMediaUploadType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[700] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-2xl">
      <div className="bg-zinc-950 w-full max-w-7xl h-[94vh] rounded-[4rem] border-2 border-white/5 shadow-4xl flex flex-col overflow-hidden animate-fade-in relative ring-1 ring-white/10">
        <input type="file" ref={mediaFileInputRef} className="hidden" accept="image/*" onChange={handleMediaUpload} />

        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <h2 className="text-4xl font-black text-white font-oswald uppercase italic tracking-tighter leading-none">UHD BROADCAST STATION</h2>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] mt-2">Painel de Sincronização v5.5</span>
            </div>
            <div className="flex bg-zinc-900/50 p-2 rounded-[2.5rem] border border-white/5">
              {(['products', 'media', 'hardware', 'remote'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-10 py-3.5 rounded-3xl text-[11px] font-black uppercase transition-all duration-500 ${activeTab === tab ? 'bg-white text-black shadow-2xl scale-105' : 'text-zinc-500 hover:text-white'}`}
                >
                  {tab === 'products' ? 'Produtos' : tab === 'media' ? 'Mídia' : tab === 'hardware' ? 'Hardware' : 'Mobile'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-6 bg-zinc-900 rounded-full text-white hover:bg-red-600 transition-all shadow-xl active:scale-90 border border-white/5">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent)]">
          
          {activeTab === 'hardware' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/[0.03] p-10 rounded-[4rem] border border-white/5 flex flex-col gap-8 group hover:border-green-500/30 transition-all shadow-2xl">
                     <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-black text-white font-oswald uppercase italic">Rotação 360° UHD</h3>
                        <span className="bg-green-500/10 text-green-400 px-6 py-1 rounded-full text-xs font-black tracking-widest">{currentRotation}° ATIVO</span>
                     </div>
                     <p className="text-zinc-500 text-xs font-medium leading-relaxed">Gire o sinal de vídeo para se ajustar à posição física da sua TV ou monitor de LED.</p>
                     <button 
                        onClick={onRotate90}
                        className="w-full py-10 bg-green-600 hover:bg-white hover:text-green-600 text-white rounded-[3rem] font-black uppercase text-sm transition-all flex items-center justify-center gap-6 shadow-2xl border-[6px] border-black active:scale-95"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                        Girar 90 Graus
                     </button>
                  </div>

                  <div className="bg-white/[0.03] p-10 rounded-[4rem] border border-white/5 flex flex-col gap-8 group hover:border-amber-500/30 transition-all shadow-2xl">
                     <div className="flex justify-between items-center">
                        <h3 className="text-3xl font-black text-white font-oswald uppercase italic">Logs de Sinal</h3>
                        <div className={`w-4 h-4 rounded-full ${mediaConfig.isNodeMode ? 'bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]' : 'bg-zinc-800'}`}></div>
                     </div>
                     <p className="text-zinc-500 text-xs font-medium leading-relaxed">Visualize o console de processamento em tempo real diretamente na tela principal.</p>
                     <button 
                        onClick={() => onUpdateMedia(prev => ({ ...prev, isNodeMode: !prev.isNodeMode }))}
                        className={`w-full py-10 rounded-[3rem] font-black uppercase text-sm transition-all flex items-center justify-center gap-6 shadow-2xl border-[6px] border-black active:scale-95 ${mediaConfig.isNodeMode ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}
                     >
                        {mediaConfig.isNodeMode ? 'Desativar Monitor' : 'Ativar Monitor'}
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8">
               <div className="bg-white/[0.03] p-12 rounded-[4rem] border border-white/5 space-y-10">
                <h3 className="text-4xl font-black text-white font-oswald uppercase italic">Letreiro de Rodapé</h3>
                <textarea 
                  value={mediaConfig.marqueeText} 
                  onChange={(e) => onUpdateMedia(prev => ({ ...prev, marqueeText: e.target.value }))} 
                  className="w-full bg-black/40 border-4 border-white/5 p-10 rounded-[3rem] text-white font-black uppercase min-h-[220px] resize-none focus:border-amber-500 outline-none transition-all text-2xl tracking-tighter" 
                  placeholder="INSIRA AS MENSAGENS DE OFERTA..."
                />
              </div>

              <div className="grid grid-cols-2 gap-10">
                <button onClick={() => { setMediaUploadType('logo'); mediaFileInputRef.current?.click(); }} className="bg-white/[0.02] p-14 rounded-[4rem] border-4 border-dashed border-white/5 aspect-video flex flex-col items-center justify-center gap-8 hover:bg-white/5 hover:border-white/20 transition-all overflow-hidden">
                  {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-h-full object-contain drop-shadow-4xl" /> : <span className="text-zinc-600 font-black uppercase text-xs tracking-[0.4em]">Trocar Logotipo</span>}
                </button>
                <button onClick={() => { setMediaUploadType('bg'); mediaFileInputRef.current?.click(); }} className="bg-white/[0.02] p-14 rounded-[4rem] border-4 border-dashed border-white/5 aspect-video flex flex-col items-center justify-center gap-8 hover:bg-white/5 hover:border-white/20 transition-all overflow-hidden">
                  {mediaConfig.bgImageUrl ? <div className="text-amber-500 text-xs font-black uppercase">Fundo Personalizado Ativo</div> : <span className="text-zinc-600 font-black uppercase text-xs tracking-[0.4em]">Fundo Broadcast</span>}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="LOCALIZAR ITEM NO ESTOQUE..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-black border-4 border-white/5 p-10 pl-16 rounded-[3rem] text-white font-black uppercase outline-none focus:border-amber-500 transition-all text-2xl tracking-tighter" 
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-amber-500 transition-colors"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-40">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-zinc-900/60 p-8 rounded-[3.5rem] border border-white/5 flex flex-col gap-6 hover:scale-105 transition-all hover:bg-zinc-900 shadow-3xl">
                    <div className="flex flex-col">
                      <span className="text-white font-black uppercase text-base truncate tracking-tighter">{p.name}</span>
                      <span className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest mt-1">{p.category}</span>
                    </div>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-600">R$</span>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={p.price} 
                          onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)} 
                          className="bg-black text-white pl-12 pr-4 py-5 rounded-[2rem] w-full text-center font-black text-2xl border-2 border-white/5 focus:border-amber-500 outline-none" 
                        />
                      </div>
                      <button 
                        onClick={() => onToggleOffer(p.id)} 
                        className={`w-24 rounded-[2rem] flex items-center justify-center text-3xl transition-all shadow-2xl border-2 ${p.isOffer ? 'bg-amber-500 border-amber-600 text-black scale-110 rotate-3' : 'bg-zinc-800 border-white/5 text-zinc-700'}`}
                      >
                        🌟
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'remote' && (
            <div className="flex flex-col items-center justify-center py-24 animate-in fade-in slide-in-from-bottom-8">
                <div className="bg-white p-14 rounded-[5rem] shadow-4xl border-[25px] border-zinc-900 mb-12">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?mode=remote')}`} className="w-72 h-72" />
                </div>
                <h3 className="text-5xl font-black text-white font-oswald uppercase italic tracking-tighter">Terminal de Controle</h3>
                <p className="text-zinc-600 font-bold text-sm uppercase tracking-[0.5em] mt-6 text-center max-w-xl leading-relaxed">Sincronize seu celular com a TV da loja para atualizar preços de qualquer corredor em tempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
