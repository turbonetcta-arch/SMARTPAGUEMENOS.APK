
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
  onUpdateMedia: (config: MediaConfig) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, onClose, onUpdatePrice, onToggleOffer, onAddProduct, onUpdateImage, mediaConfig, onUpdateMedia
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'media' | 'remote'>('products');
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
        if (mediaUploadType === 'logo') onUpdateMedia({ ...mediaConfig, logoUrl: reader.result as string });
        else onUpdateMedia({ ...mediaConfig, bgImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
      setMediaUploadType(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-7xl h-[90vh] rounded-[3rem] border border-white/10 shadow-4xl flex flex-col overflow-hidden animate-fade-in relative">
        <input type="file" ref={mediaFileInputRef} className="hidden" accept="image/*" onChange={handleMediaUpload} />

        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h2 className="text-4xl font-black text-white font-oswald uppercase italic">Painel Admin</h2>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
              {(['products', 'media', 'remote'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-600'}`}>
                  {tab === 'products' ? 'Produtos' : tab === 'media' ? 'Mídia' : 'Remoto'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-zinc-800 rounded-full text-white hover:bg-red-600 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'media' ? (
            <div className="space-y-12 max-w-4xl mx-auto">
              {/* Novo: Grid de Toggles de Sistema */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-500/10 p-8 rounded-[2.5rem] border-2 border-yellow-500/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-yellow-500 font-oswald uppercase italic">MODO J.S</h3>
                    <p className="text-zinc-500 font-bold text-[10px] uppercase">Grade de Alto Impacto</p>
                  </div>
                  <button onClick={() => onUpdateMedia({ ...mediaConfig, isJsMode: !mediaConfig.isJsMode })} className={`w-16 h-8 rounded-full p-1 transition-all ${mediaConfig.isJsMode ? 'bg-yellow-500' : 'bg-zinc-800'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${mediaConfig.isJsMode ? 'translate-x-8' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="bg-green-500/10 p-8 rounded-[2.5rem] border-2 border-green-500/20 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-green-500 font-oswald uppercase italic">SISTEMA NODE.JS</h3>
                    <p className="text-zinc-500 font-bold text-[10px] uppercase">Monitor de Servidor Live</p>
                  </div>
                  <button onClick={() => onUpdateMedia({ ...mediaConfig, isNodeMode: !mediaConfig.isNodeMode })} className={`w-16 h-8 rounded-full p-1 transition-all ${mediaConfig.isNodeMode ? 'bg-green-500' : 'bg-zinc-800'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full transition-transform ${mediaConfig.isNodeMode ? 'translate-x-8' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>

              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-white font-oswald uppercase italic">Ajuste de Rolagem</h3>
                   <span className="text-yellow-500 font-black text-3xl font-oswald">{mediaConfig.listScrollSpeed}s</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => onUpdateMedia({ ...mediaConfig, listScrollSpeed: 60 })} className={`p-6 rounded-2xl border-2 transition-all ${mediaConfig.listScrollSpeed === 60 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black border-white/10 text-white'}`}>🐢 Lenta</button>
                  <button onClick={() => onUpdateMedia({ ...mediaConfig, listScrollSpeed: 30 })} className={`p-6 rounded-2xl border-2 transition-all ${mediaConfig.listScrollSpeed === 30 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black border-white/10 text-white'}`}>🚶 Normal</button>
                  <button onClick={() => onUpdateMedia({ ...mediaConfig, listScrollSpeed: 15 })} className={`p-6 rounded-2xl border-2 transition-all ${mediaConfig.listScrollSpeed === 15 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black border-white/10 text-white'}`}>🐆 Rápida</button>
                </div>
              </div>

              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
                <h3 className="text-2xl font-black text-white font-oswald uppercase italic">Letreiro Rodapé</h3>
                <textarea value={mediaConfig.marqueeText} onChange={(e) => onUpdateMedia({ ...mediaConfig, marqueeText: e.target.value })} className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-bold uppercase min-h-[100px] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <button onClick={() => { setMediaUploadType('logo'); mediaFileInputRef.current?.click(); }} className="bg-white/5 p-10 rounded-[3rem] border border-white/10 aspect-video flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-all">
                  {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-h-full" /> : <span className="text-white font-black uppercase text-xs">Alterar Logo Loja</span>}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <input type="text" placeholder="BUSCAR ITEM..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-bold uppercase outline-none focus:border-yellow-500" />
              <div className="grid grid-cols-4 gap-6 pb-20">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-col gap-4">
                    <span className="text-white font-black uppercase text-xs truncate">{p.name}</span>
                    <div className="flex gap-2">
                      <input type="number" step="0.01" value={p.price} onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)} className="bg-black text-white p-3 rounded-xl w-full text-center font-bold" />
                      <button onClick={() => onToggleOffer(p.id)} className={`px-4 rounded-xl ${p.isOffer ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/40'}`}>🌟</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
