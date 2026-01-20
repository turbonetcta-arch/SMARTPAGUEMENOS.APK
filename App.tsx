
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category, Product, ThemeSettings, Partner } from './types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from './constants';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smart_products_v2');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('smart_partners_v2');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'FRIBOI', imageUrl: 'https://seeklogo.com/images/F/friboi-logo-4E1564C79F-seeklogo.com.png' },
      { id: 'p2', name: 'SEARA', imageUrl: 'https://seeklogo.com/images/S/seara-logo-C7A4A0B7C1-seeklogo.com.png' }
    ];
  });

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [activePartnerIndex, setActivePartnerIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHortifrutiEnabled, setIsHortifrutiEnabled] = useState(true);
  const [isRemoteMode, setIsRemoteMode] = useState(false);
  
  const [theme, setTheme] = useState<ThemeSettings>({
    primary: '#b91c1c',
    accent: '#facc15',
    background: '#000000',
    text: '#ffffff',
    panel: 'rgba(12, 12, 14, 0.85)'
  });

  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') {
      setIsRemoteMode(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smart_partners_v2', JSON.stringify(partners));
  }, [partners]);

  const handleUserActivity = () => {
    if (isRemoteMode) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  const activeCategories = useMemo(() => {
    return CATEGORIES_CYCLE.filter(cat => cat === Category.FRUTAS ? isHortifrutiEnabled : true);
  }, [isHortifrutiEnabled]);

  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];
  const actualOffers = products.filter(p => p.isOffer);
  const hasValidOffers = actualOffers.length > 0;

  useEffect(() => {
    if (isRemoteMode) return;
    const categoryTimer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, 20000);
    return () => clearInterval(categoryTimer);
  }, [activeCategories.length, isRemoteMode]);

  useEffect(() => {
    if (isRemoteMode) return;
    const timer = setInterval(() => {
      if (hasValidOffers) {
        setActiveOfferIndex((prev) => (prev + 1) % actualOffers.length);
      } else if (partners.length > 0) {
        setActivePartnerIndex((prev) => (prev + 1) % partners.length);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [actualOffers.length, partners.length, hasValidOffers, isRemoteMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  if (isRemoteMode) {
    return (
      <RemoteControl 
        products={products}
        onUpdateProducts={setProducts}
        onRotate={() => setRotation(prev => (prev + 90) % 360)}
        onToggleCategory={() => setCurrentCategoryIndex(prev => (prev + 1) % activeCategories.length)}
      />
    );
  }

  const isPortrait = rotation === 90 || rotation === 270;
  const baseWidth = 1920;
  const baseHeight = 1080;
  const targetWidth = isPortrait ? baseHeight : baseWidth;
  const targetHeight = isPortrait ? baseWidth : baseHeight;
  const scaleX = windowSize.width / targetWidth;
  const scaleY = windowSize.height / targetHeight;
  const autoScale = Math.min(scaleX, scaleY);

  const appStyle = {
    '--primary-color': theme.primary,
    '--accent-color': theme.accent,
    '--bg-color': theme.background,
    '--text-color': theme.text,
    '--panel-color': theme.panel,
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    width: `${targetWidth}px`,
    height: `${targetHeight}px`,
    transform: `translate(-50%, -50%) scale(${autoScale}) rotate(${rotation}deg)`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: 'center center',
  } as React.CSSProperties;

  return (
    <div 
      className="h-screen w-screen bg-black overflow-hidden relative cursor-none" 
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div style={appStyle} className="flex flex-col overflow-hidden transition-transform duration-500 ease-out">
        
        <header className="h-32 flex items-center justify-between px-10 z-20 border-b-4 border-black/20" style={{ background: `linear-gradient(to r, var(--primary-color), var(--bg-color))` }}>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <div>
              <h1 className="text-6xl font-black font-oswald italic tracking-tighter text-white uppercase leading-none">
                SMART <span className="text-yellow-400">PAGUE MENOS</span>
              </h1>
              <p className="text-xl font-bold uppercase tracking-[0.4em] opacity-80 text-white mt-1">Mídia Digital Inteligente</p>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden ${isPortrait ? 'flex-col' : 'flex-row'}`}>
          <div className={`${isPortrait ? 'w-full h-[42%]' : 'w-[45%] h-full'} z-10 border-r border-white/5`}>
            <PriceList products={products} currentCategory={currentCategory} />
          </div>
          
          <div className={`${isPortrait ? 'w-full h-[58%]' : 'w-[55%] h-full'} relative bg-black`}>
            {hasValidOffers ? (
              <FeaturedOffer offer={actualOffers[activeOfferIndex % actualOffers.length]} />
            ) : partners.length > 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-20 animate-fade-in text-center bg-zinc-950">
                <div className="bg-red-600 text-white px-10 py-3 rounded-full font-black text-2xl uppercase tracking-[0.3em] mb-12 shadow-2xl">Parceiro Oficial</div>
                <div className="relative w-full max-w-2xl aspect-video bg-white rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden border-[12px] border-zinc-900">
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shine"></div>
                   <img src={partners[activePartnerIndex % partners.length].imageUrl} alt="Partner" className="max-w-full max-h-full object-contain relative z-10" />
                </div>
                <h2 className="text-7xl font-black text-white mt-12 font-oswald uppercase tracking-tighter">{partners[activePartnerIndex % partners.length].name}</h2>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/20 font-black text-4xl uppercase font-oswald text-center">Configuração Pendente</p>
              </div>
            )}
          </div>
        </main>

        <footer className="h-24 bg-white flex items-center overflow-hidden z-20 border-t-4 border-black/10">
          <div className="flex whitespace-nowrap animate-scroll items-center gap-20 px-10">
            {[1, 2, 3].map((g) => (
              <React.Fragment key={g}>
                <span className="text-red-700 font-black text-4xl uppercase italic">ECONOMIA TODO DIA NO SMART PAGUE MENOS •</span>
                {partners.map(p => (
                  <div key={`${p.id}-${g}`} className="flex items-center gap-6 bg-zinc-100 px-8 py-3 rounded-3xl border border-black/5">
                    <img src={p.imageUrl} className="h-12 w-auto object-contain" />
                    <span className="text-black font-black text-3xl uppercase tracking-tight">{p.name}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </footer>
      </div>

      {showControls && (
        <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-4 animate-fade-in pointer-events-auto">
          <button onClick={() => setRotation(prev => (prev + 90) % 360)} className="p-6 bg-white/10 backdrop-blur-xl text-white rounded-3xl shadow-3xl hover:bg-white/20 transition-all border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
          <button onClick={() => setIsAdminOpen(true)} className="p-6 bg-red-600 rounded-3xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      )}

      {isAdminOpen && (
        <AdminMenu 
          products={products} theme={theme} isTvMode={false} zoomOffset={0} fitMode="stretch" 
          partners={partners} onUpdatePartners={setPartners}
          onUpdateFitMode={()=>{}} onUpdateZoom={()=>{}} isHortifrutiEnabled={isHortifrutiEnabled}
          onToggleHortifruti={() => setIsHortifrutiEnabled(!isHortifrutiEnabled)} onToggleTvMode={toggleFullscreen}
          onUpdateTheme={setTheme} onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))}
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
          onBulkToggleOffers={(off) => setProducts(prev => prev.map(item => ({...item, isOffer: off})))}
          onAddProduct={(p) => setProducts(prev => [...prev, p])}
          onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
          onRotate90={() => setRotation(prev => (prev + 90) % 360)}
          onSpin360={() => {}} currentRotation={rotation} isSpinning={false}
        />
      )}
    </div>
  );
};

export default App;
