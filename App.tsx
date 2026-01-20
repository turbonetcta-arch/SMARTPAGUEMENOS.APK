
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Category, Product, MediaConfig, Partner } from './types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from './constants';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';

const NodeConsole: React.FC<{ active: boolean, logs: string[] }> = ({ active, logs }) => {
  if (!active) return null;
  return (
    <div className="fixed bottom-10 left-10 z-[500] w-96 bg-black/90 backdrop-blur-2xl border border-green-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] animate-fade-in font-mono pointer-events-none ring-1 ring-white/10">
      <div className="bg-green-500/10 px-5 py-3 border-b border-green-500/20 flex justify-between items-center">
        <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          SMART_SYSTEM_v5.2
        </span>
        <span className="text-[9px] text-zinc-500">LIVE_FEED</span>
      </div>
      <div className="p-5 h-60 overflow-hidden flex flex-col-reverse text-[10px] gap-2 leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('ERR') ? 'text-red-400' : log.includes('SYNC') ? 'text-blue-400' : 'text-green-500/80'}`}>
            <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString('pt-BR', {hour12: false})}]</span>
            <span className="font-bold">{log.split(':')[0]}</span>
            <span className="ml-1 opacity-90">{log.split(':')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smart_products_v4');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('smart_partners_v4');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'FRIBOI', imageUrl: 'https://seeklogo.com/images/F/friboi-logo-4E1564C79F-seeklogo.com.png' },
      { id: 'p2', name: 'SEARA', imageUrl: 'https://seeklogo.com/images/S/seara-logo-C7A4A0B7C1-seeklogo.com.png' }
    ];
  });

  const [mediaConfig, setMediaConfig] = useState<MediaConfig>(() => {
    const saved = localStorage.getItem('smart_media_v4');
    return saved ? JSON.parse(saved) : {
      marqueeText: 'QUALIDADE E ECONOMIA É NO SMART PAGUE MENOS • CARNES SELECIONADAS COM PROCEDÊNCIA GARANTIDA •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 20,
      listScrollSpeed: 40,
      isNodeMode: true
    };
  });

  const [logs, setLogs] = useState<string[]>(['CORE: Media engine started', 'RENDER: Scale normalizer active', 'UHD: Hardware sync ok']);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 30));

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTvMode, setIsTvMode] = useState(true);
  const [rotation, setRotation] = useState(0); 
  const [scale, setScale] = useState(1);
  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const normalizedRotation = Math.abs(rotation % 180);
  const isPortraitLayout = normalizedRotation === 90;

  const handleResize = useCallback(() => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const targetW = isPortraitLayout ? 1080 : 1920;
    const targetH = isPortraitLayout ? 1920 : 1080;
    const s = Math.min(winW / targetW, winH / targetH);
    setScale(s);
  }, [isPortraitLayout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    localStorage.setItem('smart_products_v4', JSON.stringify(products));
    localStorage.setItem('smart_partners_v4', JSON.stringify(partners));
    localStorage.setItem('smart_media_v4', JSON.stringify(mediaConfig));
  }, [products, partners, mediaConfig]);

  const activeCategories = useMemo(() => CATEGORIES_CYCLE, []);
  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 900);
    if (mediaConfig.isNodeMode) addLog(`SYNC: Category switch -> ${currentCategory}`);
    return () => clearTimeout(timer);
  }, [currentCategoryIndex, mediaConfig.isNodeMode, currentCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, mediaConfig.slideDuration * 1000);
    return () => clearInterval(timer);
  }, [activeCategories.length, mediaConfig.slideDuration]);

  if (isRemoteMode) {
    return (
      <RemoteControl 
        products={products} 
        onUpdateProducts={setProducts} 
        onRotate={() => setRotation(r => (r + 90) % 360)} 
        onToggleCategory={() => setCurrentCategoryIndex(i => (i + 1) % activeCategories.length)} 
      />
    );
  }

  const baseWidth = isPortraitLayout ? 1080 : 1920;
  const baseHeight = isPortraitLayout ? 1920 : 1080;

  return (
    <div 
      className={`h-screen w-screen bg-[#010101] flex items-center justify-center overflow-hidden relative ${isTvMode ? 'cursor-none' : ''}`}
      onMouseMove={() => { if (isTvMode) { setIsTvMode(false); setTimeout(() => setIsTvMode(true), 10000); } }}
    >
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(185,28,28,0.1),transparent_60%)] pointer-events-none"></div>

      <div 
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
          backgroundColor: '#000',
        }} 
        className={`flex flex-col relative transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) border border-white/5 shadow-4xl`}
      >
        {/* HEADER UHD */}
        <header className="h-[20%] flex items-center justify-between px-28 bg-black/95 backdrop-blur-3xl border-b-4 border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-amber-600/10"></div>
          
          <div className="flex items-center gap-16 relative z-10">
            <div className="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl p-7 ring-2 ring-white/10">
              {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
            </div>
            <div>
              <h1 className="text-[7.5rem] font-black font-oswald italic tracking-tighter uppercase leading-[0.8] text-white">
                  SMART <span className="text-yellow-400">PAGUE MENOS</span>
              </h1>
              <div className="flex items-center gap-5 mt-2">
                <div className="px-4 py-1 bg-red-600 rounded-xl animate-pulse">
                    <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">SINAL UHD</span>
                </div>
                <span className="text-xs font-black uppercase tracking-[0.8em] text-white/30">MÍDIA DIGITAL</span>
              </div>
            </div>
          </div>
          <DigitalClock />
        </header>

        {/* CONTENT GRID */}
        <main className={`h-[65%] flex overflow-hidden ${isPortraitLayout ? 'flex-col' : 'flex-row'}`}>
          <div className={`h-full ${isPortraitLayout ? 'w-full h-[55%]' : 'w-[55%]'} border-r-4 border-white/10 relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-black z-40 transition-opacity duration-1000 ${isTransitioning ? 'opacity-40' : 'opacity-0'}`}></div>
            <PriceList products={products} currentCategory={currentCategory} />
          </div>
          <div className={`h-full ${isPortraitLayout ? 'w-full h-[45%]' : 'w-[45%]'} bg-black`}>
             <FeaturedOffer offer={products.find(p => p.isOffer && p.category === currentCategory) || products.find(p => p.isOffer) || products[0]} />
          </div>
        </main>

        {/* FOOTER MARQUEE */}
        <footer className="h-[15%] flex items-center overflow-hidden bg-red-600 border-t-8 border-white relative">
          <div className="h-full bg-black flex items-center px-24 z-20 border-r-8 border-white/30">
             <span className="text-6xl font-black font-oswald text-yellow-400 italic uppercase tracking-tighter shadow-2xl">OFERTAS</span>
          </div>
          <div className="flex-1 overflow-hidden h-full flex items-center bg-red-600">
            <div className="flex whitespace-nowrap animate-scroll items-center gap-48">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-48">
                  <span className="font-black text-6xl uppercase italic tracking-tighter text-white drop-shadow-lg">
                    {mediaConfig.marqueeText}
                  </span>
                  <div className="w-10 h-10 bg-white rotate-45"></div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <NodeConsole active={mediaConfig.isNodeMode} logs={logs} />

      {!isTvMode && (
        <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-4 scale-125">
           <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-6 bg-white/10 backdrop-blur-xl text-white rounded-3xl border border-white/10 shadow-3xl hover:bg-white/20 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
           </button>
           <button onClick={() => setIsAdminOpen(true)} className="p-6 bg-red-600 text-white rounded-3xl shadow-3xl hover:scale-110 active:scale-95 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
           </button>
        </div>
      )}

      {isAdminOpen && (
        <AdminMenu 
          products={products} partners={partners} onUpdatePartners={setPartners}
          theme={{primary: '#b91c1c', accent: '#facc15', background: '#000', text: '#fff', panel: 'rgba(0,0,0,0.8)'}}
          onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))}
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
          onAddProduct={(p) => setProducts(prev => [...prev, p])}
          onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
          onClose={() => setIsAdminOpen(false)}
          mediaConfig={mediaConfig}
          onUpdateMedia={setMediaConfig}
          // Props extras do Admin original que mantivemos compatibilidade
          isTvMode={isTvMode} zoomOffset={0} fitMode="stretch" onUpdateFitMode={()=>{}} onUpdateZoom={()=>{}}
          isHortifrutiEnabled={true} onToggleHortifruti={()=>{}} onToggleTvMode={()=>{}} onUpdateTheme={()=>{}}
          onBulkToggleOffers={()=>{}} onRotate90={()=>{}} onSpin360={()=>{}} currentRotation={rotation} isSpinning={false}
        />
      )}
    </div>
  );
};

export default App;
