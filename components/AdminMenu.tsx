
import React, { useState } from 'react';
import { Product, Category, ThemeSettings } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AdminMenuProps {
  products: Product[];
  theme: ThemeSettings;
  isTvMode: boolean;
  zoomOffset: number;
  fitMode: 'contain' | 'stretch';
  scrollSpeed: number;
  onUpdateScrollSpeed: (speed: number) => void;
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
  onRotate90: () => void;
  onSpin360: () => void;
  currentRotation: number;
  isSpinning: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, 
  theme,
  isTvMode,
  zoomOffset,
  fitMode,
  scrollSpeed,
  onUpdateScrollSpeed,
  onUpdateFitMode,
  onUpdateZoom,
  isHortifrutiEnabled,
  onToggleHortifruti,
  onToggleTvMode,
  onUpdateTheme,
  onClose, 
  onUpdatePrice, 
  onUpdateImage, 
  onToggleOffer, 
  onBulkToggleOffers,
  onAddProduct,
  onRotate90,
  onSpin360,
  currentRotation,
  isSpinning
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'style' | 'remote'>('products');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('kg');
  const [newProductCategory, setNewProductCategory] = useState<Category>(Category.BOVINOS);
  const [newProductIsOffer, setNewProductIsOffer] = useState(false);
  const [autoGenerateImage, setAutoGenerateImage] = useState(true);

  const remoteUrl = `${window.location.origin}${window.location.pathname}?remote=true`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(remoteUrl)}&color=ffffff&bgcolor=000000`;

  const handleGenerateArt = async (product: Product, type: 'photo' | 'ad' = 'photo'): Promise<string | null> => {
    setGeneratingId(product.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const flavorFocus = product.category === Category.FRUTAS 
        ? "extremely juicy, glistening with freshness, vibrant colors, mouth-watering ripeness" 
        : "succulent high-quality meat, fresh cut, beautiful marbling, appetizing texture, natural vibrant colors";

      const prompt = type === 'photo' 
        ? `Ultra-realistic professional food photography of ${product.name}. ${flavorFocus}. Isolated on elegant clean background, cinematic gourmet lighting, high sensory appeal.`
        : `High-end premium digital signage advertisement for ${product.name}. Focus on extreme palate appeal, ${flavorFocus}, luxury mood, dramatic lighting, subtle particle effects, 8k detail. Most delicious presentation possible.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } },
      });

      let generatedImageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        onUpdateImage(product.id, generatedImageUrl);
        return generatedImageUrl;
      }
      return null;
    } catch (error: any) {
      console.error('API Error:', error);
      return null;
    } finally {
      setGeneratingId(null);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProductName.toUpperCase(),
      price: parseFloat(newProductPrice),
      unit: newProductUnit,
      category: newProductCategory,
      isOffer: newProductIsOffer,
      offerPrice: newProductIsOffer ? parseFloat(newProductPrice) * 0.85 : undefined,
    };

    onAddProduct(newProduct);
    setIsAddingProduct(false);
    
    if (autoGenerateImage) {
      setTimeout(() => handleGenerateArt(newProduct), 500);
    }

    setNewProductName('');
    setNewProductPrice('');
  };

  const updateColor = (key: keyof ThemeSettings, val: string) => {
    onUpdateTheme({ ...theme, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10">
      <div className="bg-zinc-900 w-full max-w-6xl h-[90vh] rounded-[3rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden">
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h2 className="text-4xl font-black text-white font-oswald uppercase tracking-tighter">CONTROLE DIGITAL</h2>
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
              <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Produtos</button>
              <button onClick={() => setActiveTab('style')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'style' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Painel</button>
              <button onClick={() => setActiveTab('remote')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'remote' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}>Controle Remoto</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={onToggleTvMode} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all ${isTvMode ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white/60'}`}>
               {isTvMode ? 'SAIR MODO TV' : 'ATIVAR MODO TV'}
             </button>
             <button onClick={onClose} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="px-8 py-6 bg-zinc-800/30 flex items-center justify-between border-b border-white/5 overflow-x-auto">
              <div className="flex gap-4 items-center whitespace-nowrap">
                <button onClick={onRotate90} className="px-5 py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl">Girar Tela ({currentRotation}°)</button>
                <button onClick={onToggleHortifruti} className={`px-5 py-3 font-black text-xs uppercase rounded-xl transition-all border ${isHortifrutiEnabled ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{isHortifrutiEnabled ? 'HORTIFRUTI: ON' : 'HORTIFRUTI: OFF'}</button>
                <button onClick={() => onBulkToggleOffers(true)} className="px-5 py-3 bg-red-600 text-white font-black text-xs uppercase rounded-xl">Ativar Todas Ofertas</button>
              </div>
              <button onClick={() => setIsAddingProduct(true)} className="ml-4 px-6 py-3 bg-yellow-500 text-black font-black text-xs uppercase rounded-xl">Novo Produto</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] relative group hover:border-white/20 transition-colors">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img src={product.imageUrl || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-2xl object-cover shadow-2xl" />
                        {generatingId === product.id && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-black font-oswald uppercase truncate">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[10px] font-bold text-zinc-500 uppercase">R$</span>
                           <input type="number" step="0.01" value={product.price} onChange={(e) => onUpdatePrice(product.id, parseFloat(e.target.value))} className="bg-black/50 text-white font-black px-2 py-1 rounded-lg w-full outline-none focus:ring-1 ring-yellow-500 transition-all" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                       <button onClick={() => handleGenerateArt(product, 'photo')} disabled={generatingId !== null} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black rounded-xl uppercase transition-all">Limpar Foto</button>
                       <button onClick={() => handleGenerateArt(product, 'ad')} disabled={generatingId !== null} className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white text-[9px] font-black rounded-xl uppercase shadow-lg shadow-red-900/20 active:scale-95 transition-all">Arte IA Premium</button>
                       <button onClick={() => onToggleOffer(product.id)} className={`w-full py-3 text-[10px] font-black rounded-xl uppercase transition-all ${product.isOffer ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-white/40'}`}>
                        {product.isOffer ? 'Oferta Ativa' : 'Promover à Oferta'}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === 'style' ? (
          <div className="flex-1 p-12 bg-black/30 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-8">
                <h3 className="text-white font-black font-oswald text-2xl uppercase tracking-widest border-l-4 border-yellow-500 pl-4">Ajuste de Tela</h3>
                <div className="p-8 bg-zinc-800/40 rounded-3xl border border-white/5 flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <span className="text-white font-bold uppercase text-[10px] tracking-widest opacity-60">Modo de Exibição</span>
                    <div className="flex bg-black p-1 rounded-xl">
                      <button onClick={() => onUpdateFitMode('contain')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${fitMode === 'contain' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>Contain</button>
                      <button onClick={() => onUpdateFitMode('stretch')} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${fitMode === 'stretch' ? 'bg-yellow-500 text-black' : 'text-zinc-500'}`}>Full Screen</button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold uppercase text-xs tracking-widest">Velocidade de Rolagem</span>
                      <span className="text-yellow-400 font-black font-oswald text-xl">{scrollSpeed}s</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-white/30 uppercase">Rápido</span>
                      <input 
                        type="range" 
                        min="5" 
                        max="120" 
                        step="1" 
                        value={scrollSpeed} 
                        onChange={(e) => onUpdateScrollSpeed(parseInt(e.target.value))} 
                        className="flex-1 accent-yellow-500" 
                      />
                      <span className="text-[10px] font-black text-white/30 uppercase">Lento</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => onUpdateScrollSpeed(15)} className="flex-1 py-2 bg-zinc-800 text-white text-[9px] font-black rounded-lg uppercase">Mto Rápido</button>
                       <button onClick={() => onUpdateScrollSpeed(30)} className="flex-1 py-2 bg-zinc-800 text-white text-[9px] font-black rounded-lg uppercase">Normal</button>
                       <button onClick={() => onUpdateScrollSpeed(60)} className="flex-1 py-2 bg-zinc-800 text-white text-[9px] font-black rounded-lg uppercase">Lento</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-white font-bold uppercase text-xs tracking-widest">Ajuste de Zoom</span>
                    <span className="text-yellow-400 font-black font-oswald text-xl">{(zoomOffset * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <button onClick={() => onUpdateZoom(Math.max(-0.2, zoomOffset - 0.005))} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                    <input type="range" min="-0.1" max="0.1" step="0.001" value={zoomOffset} onChange={(e) => onUpdateZoom(parseFloat(e.target.value))} className="flex-1 accent-yellow-500" />
                    <button onClick={() => onUpdateZoom(Math.min(0.2, zoomOffset + 0.005))} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                  </div>
                  <button onClick={() => onUpdateZoom(0)} className="w-full py-4 bg-zinc-900 text-white/40 font-black text-[10px] uppercase rounded-xl border border-white/5">Resetar Zoom</button>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-white font-black font-oswald text-2xl uppercase tracking-widest border-l-4 border-red-600 pl-4">Cores do Tema</h3>
                <div className="flex items-center justify-between p-6 bg-zinc-800/40 rounded-3xl border border-white/5">
                  <span className="text-white font-bold uppercase text-xs tracking-widest">Fundo</span>
                  <input type="color" value={theme.background} onChange={(e) => updateColor('background', e.target.value)} className="w-14 h-14 rounded-full bg-transparent cursor-pointer border-4 border-white/10" />
                </div>
                <div className="flex items-center justify-between p-6 bg-zinc-800/40 rounded-3xl border border-white/5">
                  <span className="text-white font-bold uppercase text-xs tracking-widest">Primária</span>
                  <input type="color" value={theme.primary} onChange={(e) => updateColor('primary', e.target.value)} className="w-14 h-14 rounded-full bg-transparent cursor-pointer border-4 border-white/10" />
                </div>
                <div className="flex items-center justify-between p-6 bg-zinc-800/40 rounded-3xl border border-white/5">
                  <span className="text-white font-bold uppercase text-xs tracking-widest">Acento</span>
                  <input type="color" value={theme.accent} onChange={(e) => updateColor('accent', e.target.value)} className="w-14 h-14 rounded-full bg-transparent cursor-pointer border-4 border-white/10" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-black/50 overflow-y-auto custom-scrollbar">
            <div className="max-w-xl w-full text-center space-y-12">
               <div className="space-y-4">
                 <h3 className="text-5xl font-black text-white font-oswald uppercase tracking-tighter">CONTROLE PELO CELULAR</h3>
                 <p className="text-zinc-500 text-lg">Acesse e altere preços em tempo real de qualquer lugar da loja usando seu smartphone.</p>
               </div>
               
               <div className="relative group mx-auto w-fit">
                  <div className="absolute -inset-10 bg-indigo-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                  <div className="relative bg-white p-8 rounded-[3rem] shadow-3xl transform transition-transform duration-700 group-hover:scale-105">
                    <img src={qrCodeUrl} alt="QR Code Acesso Remoto" className="w-64 h-64 grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
               </div>

               <div className="space-y-6">
                 <div className="flex items-center justify-center gap-6">
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-black text-xl">1</div>
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Abra a câmera do seu celular</p>
                 </div>
                 <div className="flex items-center justify-center gap-6">
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-white font-black text-xl">2</div>
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Escaneie o QR Code acima</p>
                 </div>
                 <div className="flex items-center justify-center gap-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">3</div>
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Pronto! Controle sua mídia ao vivo</p>
                 </div>
               </div>

               <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] text-zinc-600 uppercase font-black tracking-[0.3em]">URL DE ACESSO DIRETO:</p>
                  <code className="text-indigo-400 text-xs break-all mt-2 block font-mono bg-black/50 p-4 rounded-xl">{remoteUrl}</code>
               </div>
            </div>
          </div>
        )}

        {isAddingProduct && (
          <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-zinc-900 border border-white/10 p-12 rounded-[3.5rem] w-full max-w-xl shadow-3xl">
              <h3 className="text-4xl font-black text-white font-oswald uppercase mb-10 tracking-tighter">Novo Produto</h3>
              <form onSubmit={handleAddProductSubmit} className="space-y-6">
                <input value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold text-xl uppercase" placeholder="NOME DO PRODUTO" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" step="0.01" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} className="bg-black border border-white/10 rounded-2xl p-5 text-white font-bold" placeholder="PREÇO" />
                  <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value as Category)} className="bg-black border border-white/10 rounded-2xl p-5 text-white font-bold">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-5 bg-white/5 text-white font-black uppercase rounded-2xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-5 bg-red-600 text-white font-black uppercase rounded-2xl shadow-lg shadow-red-900/40">Cadastrar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
