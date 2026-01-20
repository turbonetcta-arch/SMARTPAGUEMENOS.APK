
import React, { useState, useRef, useMemo } from 'react';
import { Product, Category, ThemeSettings, Partner } from '../types';

interface AdminMenuProps {
  products: Product[];
  theme: ThemeSettings;
  partners: Partner[];
  onUpdatePartners: (partners: Partner[]) => void;
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
  onUpdateTheme, isPartnersEnabled, onTogglePartners, isTvMode, zoomOffset, onUpdateZoom, 
  isHortifrutiEnabled, onToggleHortifruti, onToggleTvMode, onBulkToggleOffers, onSpin360, isSpinning
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'partners' | 'style' | 'remote'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'TODOS'>('TODOS');
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>(Category.BOVINOS);
  const [newProdUnit, setNewProdUnit] = useState('kg');

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetUpdateId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateImage(targetUpdateId, base64);
        setTargetUpdateId(null);
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
      isOffer: false
    };
    onAddProduct(newP);
    setNewProdName('');
    setNewProdPrice('');
    setIsAddingProduct(false);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-6 backdrop-blur-2xl">
      <div className="bg-zinc-900 w-full max-w-7xl h-[92vh] rounded-[4rem] border border-white/10 shadow-4xl flex flex-col overflow-hidden">
        
        <input type="file" ref={listFileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

        <header className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/50">
          <div className="flex items-center gap-10">
            <h2 className="text-5xl font-black text-white font-oswald tracking-tighter uppercase italic">PAINEL MÍDIA</h2>
            <nav className="flex bg-black p-2 rounded-3xl border border-white/5 overflow-x-auto scrollbar-hide">
              {(['products', 'partners', 'style', 'remote'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)} 
                  className={`px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-red-600 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {tab === 'products' ? 'Produtos' : tab === 'partners' ? 'Marcas' : tab === 'style' ? 'Configuração' : 'Controle Remoto'}
                </button>
              ))}
            </nav>
          </div>
          <button onClick={onClose} className="p-6 bg-zinc-800 rounded-full text-white hover:bg-red-600 transition-all shadow-2xl group">
             <svg className="group-hover:rotate-90 transition-transform" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {activeTab === 'products' ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-xl pb-10 border-b border-white/5">
                <div className="md:col-span-6 relative">
                  <input type="text" placeholder="BUSCAR PRODUTO..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-black text-sm uppercase outline-none focus:border-red-600 pl-16 transition-all" />
                  <svg className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div className="md:col-span-4">
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)} className="w-full h-full bg-black border border-white/10 p-6 rounded-3xl text-white font-black text-xs uppercase outline-none focus:border-red-600 transition-all">
                    <option value="TODOS">TODAS CATEGORIAS</option>
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <button onClick={() => setIsAddingProduct(true)} className="md:col-span-2 bg-red-600 text-white font-black text-xs uppercase rounded-3xl shadow-3xl hover:scale-105 active:scale-95 transition-all">ADICIONAR</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(p => {
                  const isGenerating = generatingIds.has(p.id);
                  return (
                    <div key={p.id} className={`bg-black/40 border border-white/5 p-8 rounded-[3rem] flex flex-col gap-6 relative group transition-all duration-500 hover:border-red-600/50 ${p.isOffer ? 'shadow-[0_0_40px_rgba(234,179,8,0.1)] border-yellow-500/20' : ''}`}>
                      <button onClick={() => onDeleteProduct(p.id)} className="absolute -top-3 -right-3 p-4 bg-red-600 text-white rounded-full transition-all shadow-2xl scale-0 group-hover:scale-100 active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                      
                      <div className="flex items-center gap-6">
                        <button onClick={() => { setTargetUpdateId(p.id); listFileInputRef.current?.click(); }} className="w-20 h-20 bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 flex items-center justify-center relative hover:border-red-600 transition-all">
                          {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover opacity-80" /> : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                          {isGenerating && <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"><div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                        </button>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-white font-black uppercase font-oswald text-lg truncate leading-none mb-1">{p.name}</h4>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{p.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-black/60 p-5 rounded-3xl border border-white/5">
                         <span className="text-zinc-600 font-black text-sm">R$</span>
                         <input type="number" step="0.01" value={p.price || ''} onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value))} className="bg-transparent text-white font-black w-full outline-none text-3xl font-oswald" />
                         <span className="text-zinc-700 font-black text-xs uppercase">{p.unit}</span>
                      </div>

                      <div className="flex gap-4">
                        <button onClick={() => onToggleOffer(p.id)} className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${p.isOffer ? 'bg-yellow-500 text-black shadow-xl' : 'bg-white/5 text-zinc-500'}`}>{p.isOffer ? '★ OFERTA' : 'DESTACAR'}</button>
                        <button onClick={() => onManualGenerateArt(p, 'ad')} disabled={isGenerating} className="px-6 bg-indigo-600/20 text-indigo-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase">IA</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'style' ? (
            <div className="max-w-4xl mx-auto space-y-16">
               <section className="bg-zinc-800/40 p-12 rounded-[4rem] border border-white/5 space-y-10">
                  <header>
                    <h3 className="text-3xl font-black text-white font-oswald uppercase italic tracking-tighter mb-2">Velocidade da Mídia</h3>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Ajuste o ritmo da rolagem dos produtos na tela</p>
                  </header>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <button onClick={() => onUpdateScrollSpeed(10)} className={`py-10 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 ${scrollSpeed <= 15 ? 'bg-red-600 border-red-500 text-white shadow-3xl scale-105' : 'bg-black/40 border-transparent text-zinc-600 hover:text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                      <span className="font-black uppercase text-xs tracking-widest">Rápido</span>
                    </button>
                    <button onClick={() => onUpdateScrollSpeed(30)} className={`py-10 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 ${scrollSpeed > 15 && scrollSpeed <= 45 ? 'bg-yellow-500 border-yellow-400 text-black shadow-3xl scale-105' : 'bg-black/40 border-transparent text-zinc-600 hover:text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                      <span className="font-black uppercase text-xs tracking-widest">Normal</span>
                    </button>
                    <button onClick={() => onUpdateScrollSpeed(60)} className={`py-10 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 ${scrollSpeed > 45 ? 'bg-indigo-600 border-indigo-500 text-white shadow-3xl scale-105' : 'bg-black/40 border-transparent text-zinc-600 hover:text-white'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/></svg>
                      <span className="font-black uppercase text-xs tracking-widest">Lento</span>
                    </button>
                  </div>

                  <div className="bg-black/60 p-10 rounded-[3rem] border border-white/5 space-y-8">
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Ajuste Manual</span>
                        <span className="text-white font-black font-oswald text-4xl">{scrollSpeed}<span className="text-sm ml-2 font-inter opacity-40">Segundos</span></span>
                     </div>
                     <input 
                      type="range" 
                      min="5" 
                      max="120" 
                      step="1"
                      value={scrollSpeed} 
                      onChange={(e) => onUpdateScrollSpeed(parseInt(e.target.value))} 
                      className="w-full h-4 bg-zinc-800 rounded-full appearance-none accent-red-600 cursor-pointer" 
                    />
                  </div>
               </section>

               <section className="bg-zinc-800/40 p-12 rounded-[4rem] border border-white/5 space-y-10">
                  <header>
                    <h3 className="text-3xl font-black text-white font-oswald uppercase italic tracking-tighter mb-2">Aparência do Painel</h3>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 flex items-center justify-between">
                      <span className="font-black uppercase text-xs text-zinc-500">Cor Primária</span>
                      <input type="color" value={theme.primary} onChange={e => onUpdateTheme({...theme, primary: e.target.value})} className="w-16 h-16 bg-transparent border-0 cursor-pointer" />
                    </div>
                    <div className="bg-black/40 p-8 rounded-3xl border border-white/5 flex items-center justify-between">
                      <span className="font-black uppercase text-xs text-zinc-500">Marcas Parceiras</span>
                      <button onClick={onTogglePartners} className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] transition-all ${isPartnersEnabled ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                        {isPartnersEnabled ? 'VISÍVEL' : 'OCULTO'}
                      </button>
                    </div>
                  </div>
               </section>
            </div>
          ) : activeTab === 'remote' ? (
            <div className="flex flex-col items-center justify-center text-center space-y-12 py-20">
              <div className="bg-white p-10 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] transform -rotate-3 border-[12px] border-zinc-800 scale-110">
                <img src={qrCodeUrl} className="w-72 h-72" alt="QR Code" />
              </div>
              <div className="space-y-4">
                <h3 className="text-7xl font-black text-white font-oswald uppercase tracking-tighter italic">CONTROLE MÓVEL</h3>
                <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.4em] max-w-lg mx-auto leading-relaxed">Escaneie o código acima para gerenciar os preços e ofertas diretamente do seu celular em tempo real.</p>
              </div>
              <div className="bg-black/60 p-6 rounded-3xl border border-white/5 text-indigo-400 font-mono text-sm shadow-xl select-all">
                {remoteUrl}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isAddingProduct && (
        <div className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-8 backdrop-blur-3xl animate-fade-in">
          <div className="bg-zinc-900 border border-white/10 p-16 rounded-[4rem] w-full max-w-2xl shadow-4xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600"></div>
            <h3 className="text-6xl font-black text-white font-oswald uppercase tracking-tighter italic text-center mb-12">NOVO ITEM</h3>
            <form onSubmit={handleAddProduct} className="space-y-8">
              <input value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="NOME DO PRODUTO" className="w-full bg-black border border-white/10 p-8 rounded-3xl text-white font-black text-2xl uppercase outline-none focus:border-red-600 transition-all" required />
              <div className="grid grid-cols-2 gap-8">
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-lg">R$</span>
                   <input type="number" step="0.01" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} placeholder="0.00" className="w-full bg-black border border-white/10 p-8 pl-14 rounded-3xl text-white font-black text-2xl outline-none" required />
                </div>
                <select value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)} className="w-full bg-black border border-white/10 p-8 rounded-3xl text-white font-black uppercase text-sm">
                  <option value="kg">KILO (KG)</option>
                  <option value="un">UNIDADE (UN)</option>
                  <option value="pct">PACOTE (PCT)</option>
                </select>
              </div>
              <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value as any)} className="w-full bg-black border border-white/10 p-8 rounded-3xl text-white font-black uppercase text-sm">
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <div className="flex gap-8 pt-6">
                <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-8 bg-zinc-800 text-white font-black rounded-3xl uppercase tracking-widest hover:bg-zinc-700 transition-all">CANCELAR</button>
                <button type="submit" className="flex-1 py-8 bg-red-600 text-white font-black rounded-3xl uppercase tracking-widest shadow-3xl hover:bg-red-500 transition-all">SALVAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
