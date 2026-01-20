
import React, { useState, useRef, useMemo } from 'react';
import { Product, Category, ThemeSettings, Partner } from '../types';

interface AdminMenuProps {
  products: Product[];
  theme: ThemeSettings;
  partners: Partner[];
  onUpdatePartners: (partners: Partner[]) => void;
  // Added missing properties to the interface
  isPartnersEnabled: boolean;
  onTogglePartners: () => void;
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
  onManualGenerateArt: (product: Product, style: 'photo' | 'ad') => Promise<void>;
  generatingIds: Set<string>;
  scrollSpeed: number;
  onUpdateScrollSpeed: (speed: number) => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, partners, onUpdatePartners, theme, onClose, 
  onUpdatePrice, onToggleOffer, onAddProduct, onDeleteProduct, onRotate90, currentRotation, onUpdateImage, onUpdateName,
  onManualGenerateArt, generatingIds, scrollSpeed, onUpdateScrollSpeed, fitMode, onUpdateFitMode,
  // Added all missing destructures from AdminMenuProps interface
  onUpdateTheme, isPartnersEnabled, onTogglePartners, isTvMode, zoomOffset, onUpdateZoom, 
  isHortifrutiEnabled, onToggleHortifruti, onToggleTvMode, onBulkToggleOffers, onSpin360, isSpinning
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'partners' | 'style' | 'remote'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'TODOS'>('TODOS');
  
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>(Category.BOVINOS);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const listFileInputRef = useRef<HTMLInputElement>(null);
  const [targetUpdateId, setTargetUpdateId] = useState<string | null>(null);

  const remoteUrl = `${window.location.origin}${window.location.pathname}?mode=remote&remote=true`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(remoteUrl)}&color=ffffff&bgcolor=000000`;

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

  const updateColor = (key: keyof ThemeSettings, val: string) => {
    // Correctly calling onUpdateTheme which is now destructured from props
    onUpdateTheme({ ...theme, [key]: val });
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-7xl h-[90vh] rounded-[3rem] border border-white/10 shadow-4xl flex flex-col overflow-hidden relative">
        
        <input type="file" ref={listFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />

        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/50">
          <div className="flex items-center gap-8">
            <h2 className="text-4xl font-black text-white font-oswald tracking-tighter uppercase italic">Gerenciamento</h2>
            <div className="flex bg-black p-1.5 rounded-2xl border border-white/5 overflow-x-auto scrollbar-hide">
              {(['products', 'partners', 'style', 'remote'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-zinc-600 hover:text-zinc-300'}`}
                >
                  {tab === 'products' ? 'Produtos' : tab === 'partners' ? 'Marcas' : tab === 'style' ? 'Painel' : 'Acesso Móvel'}
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
                  <input type="text" placeholder="BUSCAR PRODUTO..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white font-bold text-sm uppercase outline-none focus:border-yellow-500 pl-14" />
                  <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div className="md:col-span-4">
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)} className="w-full h-full bg-black border border-white/10 p-5 rounded-2xl text-white font-black text-[10px] uppercase outline-none">
                    <option value="TODOS">TODAS CATEGORIAS</option>
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <button onClick={() => setIsAddingProduct(true)} className="md:col-span-3 bg-yellow-500 text-black font-black text-xs uppercase rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">Novo Item</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredProducts.map(p => {
                  const isGenerating = generatingIds.has(p.id);
                  return (
                    <div key={p.id} className={`bg-white/5 border p-6 rounded-[2.5rem] flex flex-col gap-4 relative group transition-all duration-300 ${p.isOffer ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/5'}`}>
                      <button onClick={() => onDeleteProduct(p.id)} className="absolute -top-3 -right-3 p-3 bg-red-600 text-white rounded-full transition-all shadow-2xl hover:scale-110 active:scale-90 z-20"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                      <div className="flex items-center gap-4">
                        <button onClick={() => { setTargetUpdateId(p.id); listFileInputRef.current?.click(); }} className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center relative group/img hover:border-yellow-500 transition-all">
                          {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover group-hover/img:opacity-40" /> : <div className="w-full h-full bg-zinc-800" />}
                          {isGenerating && <div className="absolute inset-0 flex items-center justify-center bg-black/60"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                        </button>
                        <div className="flex-1">
                          <input type="text" value={p.name} onChange={(e) => onUpdateName && onUpdateName(p.id, e.target.value.toUpperCase())} className="bg-transparent text-white font-black uppercase font-oswald text-sm w-full outline-none focus:bg-white/10 px-1 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 p-4 rounded-2xl border border-white/5">
                         <input type="number" step="0.01" value={p.price || ''} onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value))} className="bg-transparent text-white font-black w-full outline-none text-xl" />
                         <span className="text-zinc-700 font-bold text-[10px] uppercase">{p.unit}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => onToggleOffer(p.id)} className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase transition-all ${p.isOffer ? 'bg-yellow-500 text-black' : 'bg-white/5 text-zinc-500'}`}>{p.isOffer ? '🌟 OFERTA' : 'DESTACAR'}</button>
                        <button onClick={() => onManualGenerateArt(p, 'photo')} disabled={isGenerating} className="px-4 bg-indigo-600/20 text-indigo-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">IA</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'style' ? (
            <div className="space-y-12 max-w-4xl mx-auto">
               <div className="bg-zinc-800/40 p-10 rounded-[3rem] border border-white/5 space-y-8">
                  <h3 className="text-2xl font-black text-white font-oswald uppercase tracking-widest border-l-4 border-yellow-500 pl-4">Velocidade da Mídia</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                     <button onClick={() => onUpdateScrollSpeed(10)} className={`py-6 rounded-2xl font-black uppercase tracking-widest transition-all ${scrollSpeed <= 15 ? 'bg-red-600 text-white shadow-lg' : 'bg-black text-zinc-500'}`}>Rápido</button>
                     <button onClick={() => onUpdateScrollSpeed(30)} className={`py-6 rounded-2xl font-black uppercase tracking-widest transition-all ${scrollSpeed > 15 && scrollSpeed <= 45 ? 'bg-yellow-500 text-black shadow-lg' : 'bg-black text-zinc-500'}`}>Normal</button>
                     <button onClick={() => onUpdateScrollSpeed(60)} className={`py-6 rounded-2xl font-black uppercase tracking-widest transition-all ${scrollSpeed > 45 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black text-zinc-500'}`}>Lento</button>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-500">
                       <span>Ajuste Fino</span>
                       <span className="text-white text-xl font-oswald">{scrollSpeed} segundos</span>
                    </div>
                    <input type="range" min="5" max="120" value={scrollSpeed} onChange={(e) => onUpdateScrollSpeed(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                  </div>
               </div>

               <div className="bg-zinc-800/40 p-10 rounded-[3rem] border border-white/5 space-y-6">
                  <h3 className="text-2xl font-black text-white font-oswald uppercase tracking-widest border-l-4 border-red-600 pl-4">Cores e Tela</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex items-center justify-between p-6 bg-black rounded-2xl">
                        <span className="text-xs font-black uppercase text-zinc-500">Primária</span>
                        <input type="color" value={theme.primary} onChange={(e) => updateColor('primary', e.target.value)} className="w-12 h-12 bg-transparent border-0" />
                     </div>
                     <div className="flex items-center justify-between p-6 bg-black rounded-2xl">
                        <span className="text-xs font-black uppercase text-zinc-500">Ajuste de Tela</span>
                        <select value={fitMode} onChange={(e) => onUpdateFitMode(e.target.value as any)} className="bg-zinc-800 text-white p-2 rounded-lg text-[10px] font-black uppercase">
                           <option value="contain">Contain</option>
                           <option value="stretch">Stretch</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>
          ) : activeTab === 'partners' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <h3 className="text-3xl font-black text-white font-oswald uppercase italic">Suas Marcas</h3>
                <button onClick={() => setIsAddingPartner(true)} className="px-10 py-5 bg-red-600 text-white font-black text-xs uppercase rounded-2xl">+ Nova Marca</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {partners.map(p => (
                  <div key={p.id} className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] flex flex-col items-center relative">
                    <button onClick={() => onUpdatePartners(partners.filter(item => item.id !== p.id))} className="absolute -top-3 -right-3 bg-red-600 text-white p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                    <img src={p.imageUrl} className="h-16 object-contain mb-4" />
                    <span className="text-white font-black uppercase text-[10px] text-center">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="bg-white p-8 rounded-[4rem] shadow-4xl mb-10 border-[12px] border-zinc-800 transform -rotate-2">
                <img src={qrCodeUrl} className="w-64 h-64" />
              </div>
              <h3 className="text-6xl font-black text-white font-oswald uppercase tracking-tighter mb-6 italic">Acesso pelo Celular</h3>
              <p className="text-zinc-500 max-w-lg font-bold uppercase text-xs tracking-[0.2em] mb-10">Escaneie para alterar preços em tempo real.</p>
              <div className="bg-black/80 p-6 rounded-3xl border border-white/10 text-indigo-400 font-mono text-[10px]">{remoteUrl}</div>
            </div>
          )}
        </div>

        {isAddingProduct && (
          <div className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-6 backdrop-blur-2xl">
            <div className="bg-zinc-900 border border-white/10 p-12 md:p-16 rounded-[4rem] w-full max-w-2xl shadow-4xl animate-fade-in">
              <h3 className="text-5xl font-black text-white font-oswald uppercase tracking-tighter italic text-center mb-10">Cadastrar Item</h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <input value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="NOME DO PRODUTO" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold text-xl uppercase outline-none focus:border-yellow-500 transition-all" required />
                <div className="grid grid-cols-2 gap-6">
                  <input type="number" step="0.01" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} placeholder="0.00" className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-bold text-xl outline-none" required />
                  <select value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)} className="w-full bg-black border border-white/10 p-7 rounded-[2.5rem] text-white font-black uppercase text-sm"><option value="kg">KILO (KG)</option><option value="un">UNIDADE (UN)</option></select>
                </div>
                <div className="flex gap-6 mt-12">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-7 bg-white/5 text-white font-black rounded-[2.5rem] uppercase tracking-widest">Descartar</button>
                  <button type="submit" className="flex-1 py-7 bg-yellow-500 text-black font-black rounded-[2.5rem] uppercase tracking-widest shadow-3xl">Salvar Item</button>
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
