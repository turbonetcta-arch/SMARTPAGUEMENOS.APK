
import React, { useState, useRef } from 'react';
import { Product, Category, ThemeSettings, Partner } from '../types';

interface AdminMenuProps {
  products: Product[];
  theme: ThemeSettings;
  isTvMode: boolean;
  zoomOffset: number;
  fitMode: 'contain' | 'stretch';
  scrollSpeed: number;
  partners: Partner[];
  isPartnersEnabled: boolean;
  partnerNameSize: number;
  onUpdatePartnerNameSize: (size: number) => void;
  onUpdatePartners: (partners: Partner[]) => void;
  onTogglePartners: () => void;
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
  onManualGenerateArt: (product: Product, style: 'photo' | 'ad') => Promise<void>;
  generatingIds: Set<string>;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ 
  products, 
  theme,
  isTvMode,
  scrollSpeed,
  partners,
  isPartnersEnabled,
  partnerNameSize,
  onUpdatePartnerNameSize,
  onUpdatePartners,
  onTogglePartners,
  onUpdateScrollSpeed,
  onUpdateFitMode,
  fitMode,
  isHortifrutiEnabled,
  onToggleHortifruti,
  onToggleTvMode,
  onUpdateTheme,
  onClose, 
  onUpdatePrice, 
  onToggleOffer, 
  onBulkToggleOffers,
  onAddProduct,
  onRotate90,
  currentRotation,
  onManualGenerateArt,
  generatingIds
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'style' | 'remote' | 'partners'>('products');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('kg');
  const [newProductCategory, setNewProductCategory] = useState<Category>(Category.BOVINOS);
  const [newProductIsOffer, setNewProductIsOffer] = useState(false);

  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);

  const remoteUrl = `${window.location.origin}${window.location.pathname}?remote=true`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(remoteUrl)}&color=ffffff&bgcolor=000000`;

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
    };

    onAddProduct(newProduct);
    setIsAddingProduct(false);
    setNewProductName('');
    setNewProductPrice('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPartnerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditPartnerFile = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newUrl = reader.result as string;
        onUpdatePartners(partners.map(p => p.id === id ? { ...p, imageUrl: newUrl } : p));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName || !newPartnerUrl) return;
    
    const newPartner: Partner = {
      id: `partner-${Date.now()}`,
      name: newPartnerName,
      imageUrl: newPartnerUrl
    };
    
    onUpdatePartners([...partners, newPartner]);
    setIsAddingPartner(false);
    setActiveTab('partners'); 
    setNewPartnerName('');
    setNewPartnerUrl('');
  };

  const handleDeletePartner = (id: string) => {
    onUpdatePartners(partners.filter(p => p.id !== id));
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
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
              <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Produtos</button>
              <button onClick={() => setActiveTab('style')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'style' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Painel</button>
              <button onClick={() => setActiveTab('partners')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'partners' ? 'bg-yellow-500 text-black' : 'text-white/40 hover:text-white'}`}>Parceiros</button>
              <button onClick={() => setActiveTab('remote')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'remote' ? 'bg-indigo-600 text-white' : 'text-white/40 hover:text-white'}`}>Remoto</button>
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
            <div className="px-8 py-6 bg-zinc-800/30 flex items-center justify-between border-b border-white/5 overflow-x-auto whitespace-nowrap">
              <div className="flex gap-4 items-center">
                <button onClick={onRotate90} className="px-5 py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl">Girar Tela ({currentRotation}°)</button>
                <button onClick={onToggleHortifruti} className={`px-5 py-3 font-black text-xs uppercase rounded-xl transition-all border ${isHortifrutiEnabled ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{isHortifrutiEnabled ? 'HORTIFRUTI: ON' : 'HORTIFRUTI: OFF'}</button>
                <button onClick={() => onBulkToggleOffers(true)} className="px-5 py-3 bg-red-600 text-white font-black text-xs uppercase rounded-xl whitespace-nowrap">Ativar Todas Ofertas</button>
              </div>
              <button onClick={() => setIsAddingProduct(true)} className="ml-4 px-6 py-3 bg-yellow-500 text-black font-black text-xs uppercase rounded-xl">Novo Produto</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => {
                  const isGenerating = generatingIds.has(product.id);
                  return (
                    <div key={product.id} className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] relative group hover:border-white/20 transition-colors">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img src={product.imageUrl || 'https://via.placeholder.com/150'} className={`w-20 h-20 rounded-2xl object-cover shadow-2xl transition-all ${isGenerating ? 'blur-sm opacity-50' : ''}`} />
                          {isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
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
                         <button onClick={() => onManualGenerateArt(product, 'photo')} disabled={isGenerating} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black rounded-xl uppercase transition-all disabled:opacity-30">Limpar Foto</button>
                         <button onClick={() => onManualGenerateArt(product, 'ad')} disabled={isGenerating} className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white text-[9px] font-black rounded-xl uppercase shadow-lg shadow-red-900/20 active:scale-95 transition-all disabled:opacity-30">Arte IA Premium</button>
                         <button onClick={() => onToggleOffer(product.id)} className={`w-full py-3 text-[10px] font-black rounded-xl uppercase transition-all ${product.isOffer ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-white/40'}`}>
                          {product.isOffer ? 'Oferta Ativa' : 'Promover à Oferta'}
                         </button>
                      </div>
                    </div>
                  );
                })}
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
                      <input type="range" min="5" max="120" step="1" value={scrollSpeed} onChange={(e) => onUpdateScrollSpeed(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
                      <span className="text-[10px] font-black text-white/30 uppercase">Lento</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <h3 className="text-white font-black font-oswald text-2xl uppercase tracking-widest border-l-4 border-red-600 pl-4">Cores do Tema</h3>
                <div className="flex items-center justify-between p-6 bg-zinc-800/40 rounded-3xl border border-white/5">
                  <span className="text-white font-bold uppercase text-xs tracking-widest">Fundo</span>
                  <input type="color" value={theme.background} onChange={(e) => updateColor('background', e.target.value)} className="w-14 h-14 rounded-full bg-transparent cursor-pointer border-4 border-white/10" />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'partners' ? (
          <>
            <div className="px-8 py-6 bg-zinc-800/30 flex items-center justify-between border-b border-white/5 overflow-x-auto whitespace-nowrap gap-6">
              <div className="flex gap-4 items-center">
                 <button 
                  onClick={onTogglePartners} 
                  className={`px-6 py-3 font-black text-xs uppercase rounded-xl transition-all border ${isPartnersEnabled ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}
                >
                  {isPartnersEnabled ? 'PARCEIROS: VISÍVEIS' : 'PARCEIROS: OCULTOS'}
                </button>
              </div>

              <div className="flex-1 max-w-md px-6 py-2 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Tamanho dos Nomes</span>
                    <span className="text-yellow-500 font-black font-oswald">{partnerNameSize}px</span>
                 </div>
                 <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  value={partnerNameSize} 
                  onChange={(e) => onUpdatePartnerNameSize(parseInt(e.target.value))} 
                  className="w-full accent-yellow-500" 
                />
              </div>

              <button onClick={() => setIsAddingPartner(true)} className="px-6 py-3 bg-yellow-500 text-black font-black text-xs uppercase rounded-xl">Adicionar Marca</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/30">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {partners.map(partner => (
                   <div key={partner.id} className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 relative group hover:border-white/10 transition-all">
                      <div className="w-full aspect-video bg-white rounded-2xl p-4 flex items-center justify-center overflow-hidden relative">
                        <img src={partner.imageUrl} alt={partner.name} className="max-h-full max-w-full object-contain" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button 
                            onClick={() => {
                              setEditingPartnerId(partner.id);
                              editFileInputRef.current?.click();
                            }}
                            className="bg-white text-black font-black text-[10px] uppercase px-4 py-2 rounded-lg"
                           >
                             Trocar Foto
                           </button>
                        </div>
                      </div>
                      <div className="w-full">
                         <h3 className="text-white font-black font-oswald uppercase text-center mb-4 truncate">{partner.name}</h3>
                         <button onClick={() => handleDeletePartner(partner.id)} className="w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-[10px] font-black rounded-xl uppercase transition-all">Remover Marca</button>
                      </div>
                   </div>
                 ))}
                 <input 
                  type="file" 
                  ref={editFileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => editingPartnerId && handleEditPartnerFile(e, editingPartnerId)}
                 />
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 bg-black/50 overflow-y-auto custom-scrollbar">
            <div className="max-w-xl w-full text-center space-y-12">
               <div className="space-y-4">
                 <h3 className="text-5xl font-black text-white font-oswald uppercase tracking-tighter">CONTROLE PELO CELULAR</h3>
                 <p className="text-zinc-500 text-lg">Acesse e altere preços em tempo real usando seu smartphone.</p>
               </div>
               <div className="relative group mx-auto w-fit">
                  <div className="relative bg-white p-8 rounded-[3rem] shadow-3xl transform transition-transform duration-700 group-hover:scale-105">
                    <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
               </div>
            </div>
          </div>
        )}

        {isAddingPartner && (
          <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-zinc-900 border border-white/10 p-12 rounded-[3.5rem] w-full max-w-xl shadow-3xl">
              <h3 className="text-4xl font-black text-white font-oswald uppercase mb-10 tracking-tighter">Adicionar Marca</h3>
              <form onSubmit={handleAddPartnerSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Nome da Marca</label>
                   <input value={newPartnerName} onChange={(e) => setNewPartnerName(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-bold text-xl uppercase" placeholder="EX: FRIBOI" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Foto / Logo</label>
                   <div className="flex flex-col gap-4">
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase py-5 rounded-2xl flex items-center justify-center gap-3 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Selecionar Arquivo da TV
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      
                      <div className="relative flex items-center"><div className="flex-grow border-t border-white/10"></div><span className="mx-4 text-[10px] font-black text-zinc-600 uppercase">OU URL</span><div className="flex-grow border-t border-white/10"></div></div>
                      <input value={newPartnerUrl} onChange={(e) => setNewPartnerUrl(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white font-bold text-xs" placeholder="URL da foto" />
                   </div>
                </div>

                {newPartnerUrl && (
                  <div className="mt-4 p-6 bg-white rounded-3xl flex items-center justify-center shadow-inner">
                    <img src={newPartnerUrl} className="max-h-32 object-contain" alt="Preview" />
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button type="button" onClick={() => setIsAddingPartner(false)} className="flex-1 py-5 bg-white/5 text-white font-black uppercase rounded-2xl">Cancelar</button>
                  <button type="submit" className="flex-1 py-5 bg-yellow-500 text-black font-black uppercase rounded-2xl">Salvar Parceiro</button>
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
