
import React, { useState } from 'react';
import { Product, Category, ThemeSettings, Partner } from '../types';

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
  onUpdatePrice, onToggleOffer, onAddProduct, onDeleteProduct, onRotate90, currentRotation 
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'partners' | 'remote'>('products');
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerUrl, setNewPartnerUrl] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>(Category.BOVINOS);
  const [newProdUnit, setNewProdUnit] = useState('kg');

  const remoteUrl = `${window.location.origin}${window.location.pathname}?mode=remote`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(remoteUrl)}`;

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName || !newPartnerUrl) return;
    const newP: Partner = { id: `p-${Date.now()}`, name: newPartnerName.toUpperCase(), imageUrl: newPartnerUrl };
    onUpdatePartners([...partners, newP]);
    setNewPartnerName('');
    setNewPartnerUrl('');
    setIsAddingPartner(false);
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
      isOffer: false
    };
    onAddProduct(newP);
    setNewProdName('');
    setNewProdPrice('');
    setIsAddingProduct(false);
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
      <div className="bg-zinc-900 w-full max-w-6xl h-[85vh] rounded-[3rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden animate-fade-in">
        
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-10">
            <h2 className="text-4xl font-black text-white font-oswald tracking-tighter uppercase">Painel de Controle</h2>
            <div className="flex bg-black p-1 rounded-2xl border border-white/5">
              <button onClick={() => setActiveTab('products')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'products' ? 'bg-white text-black' : 'text-zinc-500'}`}>Produtos</button>
              <button onClick={() => setActiveTab('partners')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'partners' ? 'bg-white text-black' : 'text-zinc-500'}`}>Parceiros</button>
              <button onClick={() => setActiveTab('remote')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'remote' ? 'bg-white text-black' : 'text-zinc-500'}`}>Remoto</button>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-zinc-800 rounded-full text-white hover:bg-red-600 transition-all shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'products' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <button onClick={onRotate90} className="px-6 py-3 bg-indigo-600 text-white font-black text-xs uppercase rounded-xl">Girar Tela ({currentRotation}°)</button>
                 <button onClick={() => setIsAddingProduct(true)} className="px-8 py-4 bg-yellow-500 text-black font-black text-xs uppercase rounded-2xl shadow-xl hover:scale-105 transition-all">
                   + Novo Produto
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4 relative group">
                    <button onClick={() => onDeleteProduct(p.id)} className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <h4 className="text-white font-black uppercase font-oswald text-lg truncate pr-8">{p.name}</h4>
                    <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl">
                       <span className="text-zinc-600 font-bold text-xs">R$</span>
                       <input type="number" step="0.01" value={p.price} onChange={(e) => onUpdatePrice(p.id, parseFloat(e.target.value))} className="bg-transparent text-white font-black w-full outline-none" />
                    </div>
                    <button onClick={() => onToggleOffer(p.id)} className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all ${p.isOffer ? 'bg-yellow-500 text-black shadow-lg' : 'bg-white/5 text-zinc-500'}`}>
                      {p.isOffer ? 'EM OFERTA' : 'DESTACAR'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'partners' ? (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-black text-2xl uppercase font-oswald border-l-8 border-red-600 pl-6">Nossas Marcas</h3>
                <button onClick={() => setIsAddingPartner(true)} className="px-8 py-4 bg-red-600 text-white font-black text-xs uppercase rounded-2xl shadow-xl hover:scale-105 transition-all">+ Novo Parceiro</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {partners.map(p => (
                  <div key={p.id} className="bg-white/5 border border-white/10 p-8 rounded-[3rem] flex flex-col items-center group relative shadow-2xl">
                    <button onClick={() => onUpdatePartners(partners.filter(item => item.id !== p.id))} className="absolute -top-3 -right-3 bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="w-full aspect-square bg-white rounded-[2rem] p-6 flex items-center justify-center mb-4">
                      <img src={p.imageUrl} className="max-h-full object-contain" alt={p.name} />
                    </div>
                    <span className="text-white font-black uppercase text-xs text-center">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-fade-in">
              <div className="bg-white p-10 rounded-[4rem] shadow-4xl mb-12 border-[12px] border-zinc-800">
                <img src={qrCodeUrl} alt="Remote Access QR Code" className="w-64 h-64" />
              </div>
              <h3 className="text-5xl font-black text-white font-oswald uppercase tracking-tighter mb-6 italic">Acesso Remoto</h3>
              <p className="text-zinc-500 max-w-md font-bold uppercase text-sm tracking-widest leading-relaxed mb-10">
                Escaneie o código acima com seu celular para controlar os preços e categorias sem precisar de teclado ou mouse.
              </p>
              <div className="bg-black/50 p-6 rounded-3xl border border-white/5 w-full max-w-xl truncate text-indigo-400 font-mono text-xs">
                {remoteUrl}
              </div>
            </div>
          )}
        </div>

        {/* Modal Novo Produto */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-zinc-900 border border-white/10 p-16 rounded-[4rem] w-full max-w-xl shadow-3xl">
              <h3 className="text-4xl font-black text-white font-oswald uppercase mb-10 tracking-tighter text-center italic">Novo Produto</h3>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <input value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="EX: PICANHA ARGENTINA" className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white font-bold text-xl uppercase outline-none focus:border-yellow-500" />
                <div className="grid grid-cols-2 gap-6">
                  <input type="number" step="0.01" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} placeholder="0.00" className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white font-bold text-xl outline-none" />
                  <select value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white font-black uppercase text-sm">
                    <option value="kg">KG</option>
                    <option value="un">UN</option>
                    <option value="pct">PCT</option>
                  </select>
                </div>
                <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value as Category)} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white font-black uppercase text-sm">
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex gap-6 mt-10">
                  <button type="button" onClick={() => setIsAddingProduct(false)} className="flex-1 py-6 bg-white/5 text-white font-black rounded-[2rem] uppercase">Cancelar</button>
                  <button type="submit" className="flex-1 py-6 bg-yellow-500 text-black font-black rounded-[2rem] uppercase shadow-2xl">Cadastrar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Novo Parceiro */}
        {isAddingPartner && (
          <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-zinc-900 border border-white/10 p-16 rounded-[4rem] w-full max-w-xl shadow-3xl">
              <h3 className="text-4xl font-black text-white font-oswald uppercase mb-10 tracking-tighter text-center italic">Adicionar Marca</h3>
              <form onSubmit={handleAddPartner} className="space-y-8">
                <input value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} placeholder="NOME DA MARCA" className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white font-bold text-xl uppercase outline-none focus:border-red-600" />
                <input value={newPartnerUrl} onChange={e => setNewPartnerUrl(e.target.value)} placeholder="LINK DA IMAGEM" className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white font-bold" />
                <div className="flex gap-6">
                  <button type="button" onClick={() => setIsAddingPartner(false)} className="flex-1 py-6 bg-white/5 text-white font-black rounded-[2rem] uppercase">Cancelar</button>
                  <button type="submit" className="flex-1 py-6 bg-red-600 text-white font-black rounded-[2rem] uppercase shadow-2xl">Salvar</button>
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
