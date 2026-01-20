
import React, { useState, useMemo } from 'react';
import { Product, Category, ThemeSettings, Partner } from '../types';
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
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, partners, onUpdatePartners, theme, onClose, 
  onUpdatePrice, onToggleOffer, onAddProduct, onDeleteProduct, onRotate90, currentRotation, onUpdateImage 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'partners' | 'remote'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'TODOS'>('TODOS');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>(Category.BOVINOS);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  const remoteUrl = `${window.location.origin}${window.location.pathname}?mode=remote`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(remoteUrl)}`;

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'TODOS' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory]);

  const generateAIImage = async (productName: string, targetId?: string) => {
    if (!productName) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A high-quality, professional studio photograph of ${productName} for a luxury butcher shop menu, realistic, 4k, clean background.` }],
        },
      });

      let base64Image = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            base64Image = `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }

      if (base64Image) {
        if (targetId) {
          onUpdateImage(targetId, base64Image);
        } else {
          setNewProdImageUrl(base64Image);
        }
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert("Erro ao conectar com a IA. Verifique sua chave API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const newP: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.toUpperCase(),
      price: parseFloat(newProdPrice),
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

  // Fix: Added missing handleAddPartner function
  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName || !newPartnerUrl) return;
    const newP: Partner = {
      id: `partner-${Date.now()}`,
      name: newPartnerName.toUpperCase(),
      imageUrl: newPartnerUrl
    };
    onUpdatePartners([...partners, newP]);
    setNewPartnerName('');
    setNewPartnerUrl('');
    setIsAddingPartner(false);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-7xl h-[90vh] rounded-[3rem] border border-white/10 shadow-4xl flex flex-col overflow-hidden animate-fade-in relative">
        
        {isGenerating && (
          <div className="absolute inset-0 z-[600] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 border-8 border-yellow-500 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_50px_rgba(234,179,8,0.3)]"></div>
            <h3 className="text-4xl font-black text-white font-oswald uppercase italic mb-4">A IA está criando sua foto...</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Isso pode levar alguns segundos</p>
          </div>
        )}

        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/50">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <h2 className="text-4xl font-black text-white font-oswald tracking-tighter uppercase leading-none italic">Painel Smart AI</h2>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gerenciamento de Mídia Digital</span>
            </div>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5">
              {(['products', 'partners', 'remote'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
                >
                  {tab === 'products' ? 'Produtos' : tab === 'partners' ? 'Marcas' : 'Controle Remoto'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-zinc-800 rounded-full text-white hover:bg-red-600 transition-all shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'products' ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md pb-6 border-b border-white/5">
                <div className="md:col-span-5 relative">
                  <input 
                    type="text" 
                    placeholder="BUSCAR PRODUTO..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-bold text-sm uppercase outline-none pl-14"
                  />
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div className="md:col-span-4">
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                    className="w-full h-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black text-[10px] uppercase outline-none"
                  >
                    <option value="TODOS">TODAS CATEGORIAS</option>
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <button onClick={() => setIsAddingProduct(true)} className="md:col-span-3 bg-yellow-500 text-black font-black text-xs uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Novo Cadastro
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredProducts.map(p => (
                  <div key={p.id} className={`bg-white/5 border p-6 rounded-[2.5rem] flex flex-col gap-4 relative group transition-all duration-300 ${p.isOffer ? 'border-yellow-500/30' : 'border-white/5'}`}>
                    <button onClick={() => onDeleteProduct(p.id)} className="absolute -top-3 -right-3 p-3 bg-red-600 text-white rounded-full transition-all shadow-2xl hover:scale-110 active:scale-90 z-20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center relative">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <button onClick={() => generateAIImage(p.name, p.id)} className="w-full h-full flex items-center justify-center text-yellow-500/40 hover:text-yellow-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="text-white font-black uppercase font-oswald text-sm truncate">{p.name}</h4>
                        <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">{p.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-black/60 p-4 rounded-2xl border border-white/5">
                       <span className="text-zinc-700 font-black text-[10px]">R$</span>
                       <input type="number" step="0.01" value={p.price} onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value))} className="bg-transparent text-white font-black w-full outline-none text-xl" />
                       <span className="text-zinc-700 font-bold text-[10px] uppercase">{p.unit}</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => onToggleOffer(p.id)} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase transition-all ${p.isOffer ? 'bg-yellow-500 text-black shadow-lg scale-[1.03]' : 'bg-white/5 text-zinc-500'}`}>
                        {p.isOffer ? '🌟 OFERTA' : 'DESTACAR'}
                      </button>
                      <button onClick={() => generateAIImage(p.name, p.id)} className="px-4 bg-indigo-600/20 text-indigo-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all" title="Gerar Foto com IA">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'partners' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <div className="flex flex-col">
                  <h3 className="text-3xl font-black text-white font-oswald uppercase tracking-tighter italic">Suas Marcas</h3>
                  <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mt-1">Rodapé dinâmico de parceiros</p>
                </div>
                <button onClick={() => setIsAddingPartner(true)} className="px-10 py-5 bg-red-600 text-white font-black text-xs uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all">+ Nova Marca</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {partners.map(p => (
                  <div key={p.id} className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] flex flex-col items-center group relative shadow-2xl">
                    <button onClick={() => onUpdatePartners(partners.filter(item => item.id !== p.id))} className="absolute -top-3 -right-3 bg-red-600 text-white p-3 rounded-full shadow-xl">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="w-full aspect-square bg-white rounded-3xl p-6 flex items-center justify-center mb-6 overflow-hidden">
                      <img src={p.imageUrl} className="max-h-full object-contain" alt={p.name} />
                    </div>
                    <span className="text-white font-black uppercase text-[10px] text-center">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-fade-in">
              <div className="bg-white p-12 rounded-[5rem] shadow-4xl mb-12 border-[16px] border-zinc-800 transform -rotate-2">
                <img src={qrCodeUrl} alt="Remote Access QR Code" className="w-72 h-72" />
              </div>
              <h3 className="text-6xl font-black text-white font-oswald uppercase tracking-tighter mb-6 italic">Controle Remoto</h3>
              <p className="text-zinc-500 max-w-lg font-bold uppercase text-xs tracking-[0.2em] leading-relaxed mb-10">
                Escaneie com seu celular para mudar preços e categorias enquanto anda pela loja.
              </p>
              <div className="bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full max-w-2xl truncate text-indigo-400 font-mono text-[10px] flex justify-between items-center">
                <span>{remoteUrl}</span>
                <button onClick={() => navigator.clipboard.writeText(remoteUrl)} className="text-white bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all uppercase font-black tracking-widest text-[8px]">Copiar</button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Novo Produto */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-6 backdrop-blur-2xl">
            <div className="bg-zinc-900 border border-white/10 p-12 md:p-16 rounded-[4rem] w-full max-w-2xl shadow-4xl animate-fade-in">
              <h3 className="text-5xl font-black text-white font-oswald uppercase tracking-tighter italic text-center mb-10">Novo Item</h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <input value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="NOME DO PRODUTO (EX: PICANHA)" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold text-xl uppercase outline-none focus:border-yellow-500 transition-all" required />
                
                <div className="grid grid-cols-2 gap-6">
                  <input type="number" step="0.01" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} placeholder="0.00" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold text-xl outline-none" required />
                  <select value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)} className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-black uppercase text-sm">
                    <option value="kg">KG</option>
                    <option value="un">UN</option>
                    <option value="pct">PCT</option>
                  </select>
                </div>

                <div className="relative group">
                  <input value={newProdImageUrl} onChange={e => setNewProdImageUrl(e.target.value)} placeholder="URL DA IMAGEM OU GERE COM IA" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold text-sm outline-none pr-32" />
                  <button type="button" onClick={() => generateAIImage(newProdName)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:scale-105 active:scale-95 transition-all">
                    Gerar com IA
                  </button>
                </div>

                <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value as Category)} className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-black uppercase text-sm">
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <div className="flex gap-6 mt-12">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-7 bg-white/5 text-white font-black rounded-[2.5rem] uppercase tracking-widest">Sair</button>
                  <button type="submit" className="flex-1 py-7 bg-yellow-500 text-black font-black rounded-[2.5rem] uppercase tracking-widest shadow-3xl">Salvar Item</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Novo Parceiro */}
        {isAddingPartner && (
          <div className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-6 backdrop-blur-2xl">
            <div className="bg-zinc-900 border border-white/10 p-16 rounded-[4rem] w-full max-w-xl shadow-4xl animate-fade-in">
              <h3 className="text-4xl font-black text-white font-oswald uppercase mb-10 text-center italic">Novo Parceiro</h3>
              <form onSubmit={handleAddPartner} className="space-y-8">
                <input value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} placeholder="NOME DA MARCA" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold text-xl uppercase outline-none focus:border-red-600" required />
                <input value={newPartnerUrl} onChange={e => setNewPartnerUrl(e.target.value)} placeholder="LINK DO LOGO (PNG)" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold outline-none" required />
                <div className="flex gap-6">
                  <button type="button" onClick={() => setIsAddingPartner(false)} className="flex-1 py-7 bg-white/5 text-white font-black rounded-[2.5rem] uppercase">Sair</button>
                  <button type="submit" className="flex-1 py-7 bg-red-600 text-white font-black rounded-[2.5rem] uppercase shadow-3xl">Salvar</button>
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
