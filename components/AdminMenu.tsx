
import React, { useState, useRef, useMemo } from 'react';
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
  mediaConfig: MediaConfig;
  onUpdateMedia: (config: MediaConfig) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, partners, onUpdatePartners, theme, onClose, 
  onUpdatePrice, onToggleOffer, onAddProduct, onDeleteProduct, onRotate90, onUpdateImage, onUpdateName,
  mediaConfig, onUpdateMedia
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'partners' | 'media' | 'remote'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'TODOS'>('TODOS');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>(Category.BOVINOS);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const listFileInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const [mediaUploadType, setMediaUploadType] = useState<'logo' | 'bg' | null>(null);
  const [targetUpdateId, setTargetUpdateId] = useState<string | null>(null);

  const remoteUrl = `${window.location.origin}${window.location.pathname}?mode=remote`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(remoteUrl)}`;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'TODOS' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewProduct: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isNewProduct) {
          setNewProdImageUrl(base64);
        } else if (targetUpdateId) {
          onUpdateImage(targetUpdateId, base64);
          setTargetUpdateId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && mediaUploadType) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (mediaUploadType === 'logo') {
          onUpdateMedia({ ...mediaConfig, logoUrl: base64 });
        } else {
          onUpdateMedia({ ...mediaConfig, bgImageUrl: base64 });
        }
        setMediaUploadType(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIImage = async (productName: string, targetId?: string) => {
    if (!productName) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High quality studio photograph of ${productName} for butcher shop menu, professional lighting, realistic, 4k.` }],
        },
      });

      let base64Image = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (base64Image) {
        if (targetId) onUpdateImage(targetId, base64Image);
        else setNewProdImageUrl(base64Image);
      }
    } catch (error) {
      console.error(error);
      alert("Erro na IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProdPrice);
    if (!newProdName || isNaN(price)) return;
    const newP: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.toUpperCase(),
      price: price,
      category: newProdCategory,
      unit: newProdUnit,
      isOffer: false,
      imageUrl: newProdImageUrl || undefined
    };
    onAddProduct(newP);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdImageUrl('');
    setIsAddingProduct(false);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-7xl h-[90vh] rounded-[3rem] border border-white/10 shadow-4xl flex flex-col overflow-hidden animate-fade-in relative">
        
        <input type="file" ref={listFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
        <input type="file" ref={mediaFileInputRef} className="hidden" accept="image/*" onChange={handleMediaUpload} />

        {isGenerating && (
          <div className="absolute inset-0 z-[600] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h3 className="text-4xl font-black text-white font-oswald uppercase italic">IA Gerando...</h3>
          </div>
        )}

        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h2 className="text-4xl font-black text-white font-oswald tracking-tighter uppercase leading-none italic">Ajustes Mídia</h2>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Smart Painel V2</span>
            </div>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
              {(['products', 'partners', 'media', 'remote'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
                >
                  {tab === 'products' ? 'Produtos' : tab === 'partners' ? 'Marcas' : tab === 'media' ? 'Mídia' : 'Remoto'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-zinc-800 rounded-full text-white hover:bg-red-600 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'products' ? (
            <div className="space-y-8">
              {/* Product list UI (existing) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md pb-6 border-b border-white/5">
                <div className="md:col-span-6 relative">
                  <input type="text" placeholder="BUSCAR ITEM..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-bold uppercase outline-none focus:border-yellow-500 pl-14" />
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <button onClick={() => setIsAddingProduct(true)} className="md:col-span-3 bg-yellow-500 text-black font-black text-xs uppercase rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2">
                  + Novo Item
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden">
                        {p.imageUrl && <img src={p.imageUrl} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-white font-black uppercase text-xs truncate">{p.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <input type="number" step="0.01" value={p.price} onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value) || 0)} className="bg-black text-white p-3 rounded-xl w-full text-center font-bold" />
                      <button onClick={() => onToggleOffer(p.id)} className={`px-4 rounded-xl ${p.isOffer ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/40'}`}>🌟</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'media' ? (
            <div className="space-y-12 animate-fade-in max-w-4xl mx-auto pb-20">
              
              {/* NOVO: Ajuste de Rolagem */}
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-white font-oswald uppercase tracking-widest italic">Ajuste de Rolagem</h3>
                   <span className="text-yellow-500 font-black text-3xl font-oswald">{mediaConfig.listScrollSpeed}s</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => onUpdateMedia({ ...mediaConfig, listScrollSpeed: 60 })}
                    className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${mediaConfig.listScrollSpeed === 60 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black border-white/10 text-white hover:border-white/30'}`}
                  >
                    <span className="text-2xl">🐢</span>
                    <span className="font-black text-[10px] uppercase">Lenta (60s)</span>
                  </button>
                  <button 
                    onClick={() => onUpdateMedia({ ...mediaConfig, listScrollSpeed: 30 })}
                    className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${mediaConfig.listScrollSpeed === 30 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black border-white/10 text-white hover:border-white/30'}`}
                  >
                    <span className="text-2xl">🚶</span>
                    <span className="font-black text-[10px] uppercase">Normal (30s)</span>
                  </button>
                  <button 
                    onClick={() => onUpdateMedia({ ...mediaConfig, listScrollSpeed: 15 })}
                    className={`p-6 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${mediaConfig.listScrollSpeed === 15 ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black border-white/10 text-white hover:border-white/30'}`}
                  >
                    <span className="text-2xl">🐆</span>
                    <span className="font-black text-[10px] uppercase">Rápida (15s)</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block text-center">Ajuste Fino</span>
                  <input 
                    type="range" min="5" max="120" step="1" 
                    value={mediaConfig.listScrollSpeed} 
                    onChange={(e) => onUpdateMedia({ ...mediaConfig, listScrollSpeed: parseInt(e.target.value) })}
                    className="w-full h-4 bg-black rounded-full appearance-none accent-yellow-500"
                  />
                  <p className="text-zinc-600 text-[10px] font-bold text-center uppercase">Quanto maior o valor, mais lenta é a rolagem</p>
                </div>
              </div>

              {/* Resto das configurações de mídia */}
              <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
                <h3 className="text-2xl font-black text-white font-oswald uppercase tracking-widest italic">Letreiro Rodapé</h3>
                <textarea 
                  value={mediaConfig.marqueeText} 
                  onChange={(e) => onUpdateMedia({ ...mediaConfig, marqueeText: e.target.value })} 
                  className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-bold uppercase outline-none focus:border-red-600 min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6">
                  <h3 className="text-2xl font-black text-white font-oswald uppercase tracking-widest italic text-center">Logo Loja</h3>
                  <button 
                    onClick={() => { setMediaUploadType('logo'); mediaFileInputRef.current?.click(); }}
                    className="w-full aspect-square bg-black rounded-3xl border border-dashed border-white/20 flex items-center justify-center p-8 overflow-hidden group hover:border-yellow-500/50 transition-all"
                  >
                    {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <span className="text-white/20 font-black uppercase text-xs">Upload Logo</span>}
                  </button>
                </div>
                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6">
                  <h3 className="text-2xl font-black text-white font-oswald uppercase tracking-widest italic text-center">Tempo Slide Oferta</h3>
                  <div className="flex flex-col items-center justify-center h-full gap-8">
                    <span className="text-6xl font-black text-red-600 font-oswald">{mediaConfig.slideDuration}s</span>
                    <input 
                      type="range" min="3" max="60" 
                      value={mediaConfig.slideDuration} 
                      onChange={(e) => onUpdateMedia({ ...mediaConfig, slideDuration: parseInt(e.target.value) })}
                      className="w-full h-4 bg-black rounded-full appearance-none accent-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'partners' ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
               {partners.map(p => (
                 <div key={p.id} className="bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col items-center">
                    <div className="w-full aspect-square bg-white rounded-2xl p-2 mb-2 flex items-center justify-center">
                      <img src={p.imageUrl} className="max-h-full" />
                    </div>
                    <button onClick={() => onUpdatePartners(partners.filter(item => item.id !== p.id))} className="text-[10px] font-black text-red-600 uppercase">Remover</button>
                 </div>
               ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
               <div className="bg-white p-10 rounded-[4rem] mb-10 border-[12px] border-zinc-800"><img src={qrCodeUrl} className="w-64 h-64" /></div>
               <h3 className="text-4xl font-black text-white font-oswald uppercase">Controle Via Celular</h3>
               <p className="text-zinc-500 text-xs mt-4">Acesse: {remoteUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
