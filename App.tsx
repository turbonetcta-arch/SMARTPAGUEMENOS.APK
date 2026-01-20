
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category, Product, ThemeSettings, Partner, MediaConfig } from './types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from './constants';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smart_pague_menos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('smart_pague_menos_partners');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'Friboi', imageUrl: 'https://seeklogo.com/images/F/friboi-logo-4E1564C79F-seeklogo.com.png' },
      { id: 'p2', name: 'Seara', imageUrl: 'https://seeklogo.com/images/S/seara-logo-B11776378A-seeklogo.com.png' }
    ];
  });

  const [mediaConfig, setMediaConfig] = useState<MediaConfig>(() => {
    const saved = localStorage.getItem('smart_pague_menos_media');
    return saved ? JSON.parse(saved) : {
      marqueeText: 'ECONOMIA TODO DIA É AQUI NO SMART PAGUE MENOS • ACEITAMOS TODOS OS CARTÕES • CARNES FRESCAS TODOS OS DIAS •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 10,
      listScrollSpeed: 30
    };
  });

  const [isPartnersEnabled, setIsPartnersEnabled] = useState(true);
  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHortifrutiEnabled, setIsHortifrutiEnabled] = useState(true);
  const [isTvMode, setIsTvMode] = useState(false);
  
  const [theme, setTheme] = useState<ThemeSettings>({
    primary: '#b91c1c',
    accent: '#facc15',
    background: '#09090b',
    text: '#ffffff',
    panel: 'rgba(24, 24, 27, 0.8)'
  });

  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [zoomOffset, setZoomOffset] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  const controlsTimeoutRef = useRef<number | null>(null);
  const isPortraitMode = rotation === 90 || rotation === 270;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products', JSON.stringify(products));
    localStorage.setItem('smart_pague_menos_partners', JSON.stringify(partners));
    localStorage.setItem('smart_pague_menos_media', JSON.stringify(mediaConfig));
  }, [products, partners, mediaConfig]);

  const activeCategories = useMemo(() => {
    return CATEGORIES_CYCLE.filter(cat => cat === Category.FRUTAS ? isHortifrutiEnabled : true);
  }, [isHortifrutiEnabled]);

  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];
  const actualOffers = products.filter(p => p.isOffer);
  const displayOffers = actualOffers.length > 0 ? actualOffers : products.filter(p => p.category === currentCategory);

  const handleResize = () => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const projectedW = isPortraitMode ? 1080 : 1920;
    const projectedH = isPortraitMode ? 1920 : 1080;
    const s = Math.min(winW / projectedW, winH / projectedH);
    setScaleX(s);
    setScaleY(s);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rotation, isPortraitMode]);

  useEffect(() => {
    if (isRemoteMode) return;
    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, 20000);
    return () => clearInterval(timer);
  }, [activeCategories.length, isRemoteMode]);

  useEffect(() => {
    if (isRemoteMode) return;
    const timer = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % Math.max(1, displayOffers.length));
    }, mediaConfig.slideDuration * 1000);
    return () => clearInterval(timer);
  }, [displayOffers.length, isRemoteMode, mediaConfig.slideDuration]);

  if (isRemoteMode) {
    return (
      <RemoteControl 
        products={products} 
        scrollSpeed={mediaConfig.listScrollSpeed}
        isPartnersEnabled={isPartnersEnabled}
        onTogglePartners={() => setIsPartnersEnabled(!isPartnersEnabled)}
        onUpdateScrollSpeed={(s) => setMediaConfig({...mediaConfig, listScrollSpeed: s})}
        onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
        onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
      />
    );
  }

  const baseWidth = isPortraitMode ? 1080 : 1920;
  const baseHeight = isPortraitMode ? 1920 : 1080;

  const appStyle = {
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
    transform: `translate(-50%, -50%) scale(${scaleX + zoomOffset}) rotate(${rotation}deg)`,
    '--primary-color': theme.primary,
    '--accent-color': theme.accent,
    '--bg-color': theme.background,
    '--text-color': theme.text,
    '--panel-color': theme.panel,
    backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: 'center center',
  } as React.CSSProperties;

  return (
    <div className={`h-screen w-screen bg-black overflow-hidden relative ${isTvMode ? 'cursor-none' : ''}`}>
      <div style={appStyle} className="flex flex-col overflow-hidden shadow-4xl">
        <header className="h-32 flex items-center justify-between px-10 border-b-4 border-black/20 z-20" style={{ background: `linear-gradient(to r, var(--primary-color), rgba(0,0,0,0.5))` }}>
          <div className="flex items-center gap-8">
            <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-4">
              {mediaConfig.logoUrl ? (
                <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" alt="Logo" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              )}
            </div>
            <div>
              <h1 className="text-6xl font-black font-oswald italic tracking-tighter text-white uppercase leading-none">
                SMART <span className="text-yellow-400">PAGUE MENOS</span>
              </h1>
              <p className="text-xl font-bold uppercase tracking-[0.4em] opacity-80 text-white mt-1">Açougue & Hortifruti</p>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden ${isPortraitMode ? 'flex-col' : 'flex-row'}`}>
          <div className={`${isPortraitMode ? 'w-full h-[45%]' : 'w-[50%] h-full'} border-r border-white/5`}>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={mediaConfig.listScrollSpeed} />
          </div>
          <div className={`${isPortraitMode ? 'w-full h-[55%]' : 'w-[50%] h-full'} relative`}>
            {displayOffers.length > 0 && (
              <FeaturedOffer offer={displayOffers[activeOfferIndex % displayOffers.length]} />
            )}
          </div>
        </main>

        <footer className="h-20 bg-white flex items-center overflow-hidden z-20 border-t-4 border-black/10">
          <div className="flex whitespace-nowrap animate-scroll items-center gap-10 px-8" style={{ animationDuration: `${mediaConfig.listScrollSpeed}s` }}>
            {[1, 2].map(i => (
              <span key={i} className="text-black font-black text-4xl uppercase italic tracking-tight">
                {mediaConfig.marqueeText}
              </span>
            ))}
          </div>
        </footer>
      </div>

      {/* Controles Flutuantes - Só aparecem se NÃO estiver no Modo TV */}
      {!isTvMode && (
        <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-4 animate-fade-in pointer-events-auto">
          {/* Botão Modo TV */}
          <button 
            onClick={() => setIsTvMode(true)}
            title="Ativar Modo TV (Exibição Limpa)"
            className="p-6 bg-blue-600 rounded-3xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
            <span className="absolute right-full mr-4 bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ativar Modo TV</span>
          </button>

          <button onClick={() => setRotation(prev => (prev + 90) % 360)} className="p-6 bg-zinc-900/80 backdrop-blur-xl text-white rounded-3xl border border-white/10 shadow-3xl hover:bg-zinc-800 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>

          <button onClick={() => setIsAdminOpen(true)} className="p-6 bg-red-600 rounded-3xl text-white shadow-3xl hover:scale-110 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      )}

      {/* Botão de Saída do Modo TV (Invisível no canto, aparece no hover) */}
      {isTvMode && (
        <div className="fixed top-0 right-0 w-32 h-32 z-[500] group pointer-events-auto">
          <button 
            onClick={() => setIsTvMode(false)}
            className="absolute top-5 right-5 bg-black/40 hover:bg-red-600 text-white/20 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm border border-white/10"
          >
            Sair do Modo TV [X]
          </button>
        </div>
      )}

      {isAdminOpen && (
        <AdminMenu 
          products={products} 
          theme={theme} 
          isTvMode={isTvMode} 
          zoomOffset={zoomOffset} 
          fitMode={'stretch'} 
          partners={partners} 
          onUpdatePartners={setPartners}
          onUpdateFitMode={() => {}} 
          onUpdateZoom={setZoomOffset} 
          isHortifrutiEnabled={isHortifrutiEnabled}
          onToggleHortifruti={() => setIsHortifrutiEnabled(!isHortifrutiEnabled)} 
          onToggleTvMode={() => setIsTvMode(!isTvMode)}
          onUpdateTheme={setTheme} 
          onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))}
          onUpdateName={(id, name) => setProducts(prev => prev.map(item => item.id === id ? {...item, name} : item))}
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
          onBulkToggleOffers={(off) => setProducts(prev => prev.map(item => ({...item, isOffer: off})))}
          onAddProduct={(p) => setProducts(prev => [...prev, p])}
          onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
          onRotate90={() => setRotation(prev => (prev + 90) % 360)}
          onSpin360={() => {}} 
          currentRotation={rotation} 
          isSpinning={false}
          mediaConfig={mediaConfig}
          onUpdateMedia={setMediaConfig}
        />
      )}
    </div>
  );
};

export default App;
