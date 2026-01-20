
import React, { useState, useMemo, useRef } from 'react';
import { Product, Category, ThemeSettings, Partner, MediaConfig } from '../types';
import { GoogleGenAI } from "@google/genai";

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
  mediaConfig?: MediaConfig;
  onUpdateMedia?: (config: MediaConfig) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, partners, onUpdatePartners, onClose, onUpdatePrice, onToggleOffer, onAddProduct, onDeleteProduct, onUpdateImage, onUpdateName, mediaConfig, onUpdateMedia
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'media' | 'remote'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const generateAIImage = async (productName: string, targetId: string) => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High resolution professional photo of ${productName} for supermarket display, white background, studio lighting.` }] },
      });
      let base64 = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) base64 = `data:image/png;base64,${part.inlineData.data}`;
      }
      if (base64) onUpdateImage(targetId, base64);
    } catch (e) {
      alert("Erro ao gerar imagem com IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-7xl h-[90vh] rounded-[3rem] border border-white/10 shadow-4xl flex flex-col overflow-hidden animate-fade-in relative">
        
        {isGenerating && (
          <div className="absolute inset-0 z-[600] bg-black/80 flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-black text-white uppercase italic">IA Processando...</h3>
          </div>
        )}

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-10">
            <h2 className="text-3xl font-black text-white font-oswald uppercase italic">Painel Broadcast</h2>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
              {(['products', 'media', 'remote'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  {tab === 'products' ? 'Produtos' : tab === 'media' ? 'Mídia UHD' : 'Acesso Móvel'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-zinc-800 rounded-full text-white hover:bg-red-600 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'media' && mediaConfig && onUpdateMedia ? (
            <div className="space-y-12 max-w-4xl mx-auto py-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-white uppercase font-oswald italic">Letreiro Marquee</h3>
                    <textarea 
                      value={mediaConfig.marqueeText} 
                      onChange={e => onUpdateMedia({...mediaConfig, marqueeText: e.target.value})}
                      className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-4 text-white font-bold"
                    />
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-white uppercase font-oswald italic">Logs de Sistema</h3>
                    <div className="flex items-center justify-between bg-black p-5 rounded-2xl">
                       <span className="text-zinc-500 font-bold uppercase text-xs">Ativar Terminal Node.js</span>
                       <button 
                        onClick={() => onUpdateMedia({...mediaConfig, isNodeMode: !mediaConfig.isNodeMode})}
                        className={`w-14 h-8 rounded-full transition-all p-1 ${mediaConfig.isNodeMode ? 'bg-green-500' : 'bg-zinc-800'}`}
                       >
                         <div className={`w-6 h-6 bg-white rounded-full transition-all ${mediaConfig.isNodeMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                       </button>
                    </div>
                  </div>
               </div>
               
               <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                  <h3 className="text-xl font-black text-white uppercase font-oswald italic">Velocidade de Transição</h3>
                  <div className="grid grid-cols-3 gap-4">
                     {[10, 20, 30].map(s => (
                       <button 
                        key={s}
                        onClick={() => onUpdateMedia({...mediaConfig, slideDuration: s})}
                        className={`p-6 rounded-2xl font-black transition-all ${mediaConfig.slideDuration === s ? 'bg-white text-black' : 'bg-black text-zinc-500'}`}
                       >
                         {s} Segundos
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          ) : activeTab === 'products' ? (
            <div className="space-y-8">
              <input 
                type="text" 
                placeholder="BUSCAR PRODUTO..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-bold uppercase outline-none focus:border-yellow-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex flex-col gap-4 group">
                    <div className="h-40 bg-black/40 rounded-3xl flex items-center justify-center relative overflow-hidden">
                       {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <span className="text-zinc-700 font-black">SEM IMAGEM</span>}
                       <button 
                        onClick={() => generateAIImage(p.name, p.id)}
                        className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                       </button>
                    </div>
                    <div className="flex flex-col gap-1 px-2">
                       <span className="text-white font-black uppercase text-sm truncate">{p.name}</span>
                       <span className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">{p.category}</span>
                    </div>
                    <div className="flex gap-2">
                       <input 
                        type="number" 
                        value={p.price} 
                        onChange={e => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)}
                        className="bg-black text-white p-4 rounded-2xl w-full text-center font-bold"
                       />
                       <button 
                        onClick={() => onToggleOffer(p.id)}
                        className={`p-4 rounded-2xl transition-all ${p.isOffer ? 'bg-yellow-500 text-black' : 'bg-white/5 text-zinc-600'}`}
                       >
                         🌟
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-8 py-10">
               <div className="bg-white p-10 rounded-[4rem] shadow-4xl border-[15px] border-zinc-800">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?mode=remote')}`} className="w-64 h-64" />
               </div>
               <h3 className="text-4xl font-black text-white uppercase italic font-oswald tracking-tighter">Controle Móvel</h3>
               <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em]">Sincronização em tempo real via Cloud</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
