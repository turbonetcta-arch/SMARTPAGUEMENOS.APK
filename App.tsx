
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Category, Product, MediaConfig } from './types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from './constants';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';

const NodeConsole: React.FC<{ active: boolean, logs: string[] }> = ({ active, logs }) => {
  if (!active) return null;
  return (
    <div className="fixed bottom-10 left-10 z-[500] w-96 bg-black/95 backdrop-blur-3xl border border-green-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,1)] animate-fade-in font-mono pointer-events-none ring-1 ring-white/10">
      <div className="bg-green-500/10 px-5 py-3 border-b border-green-500/20 flex justify-between items-center">
        <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
          UHD_REMOTE_SYNC
        </span>
        <span className="text-[9px] text-zinc-600 font-bold">STABLE</span>
      </div>
      <div className="p-5 h-56 overflow-hidden flex flex-col-reverse text-[9px] gap-1 leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('ERR') ? 'text-red-400' : log.includes('REMOTE') ? 'text-blue-400 font-bold' : 'text-green-500/70'}`}>
            <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString('pt-BR', {hour12: false})}]</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smart_pague_menos_products_v4');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [mediaConfig, setMediaConfig] = useState<MediaConfig>(() => {
    const saved = localStorage.getItem('smart_pague_menos_media_v4');
    return saved ? JSON.parse(saved) : {
      marqueeText: 'QUALIDADE E ECONOMIA É NO SMART PAGUE MENOS • CARNES SELECIONADAS COM PROCEDÊNCIA GARANTIDA • ACEITAMOS TODOS OS CARTÕES •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 18,
      listScrollSpeed: 45,
      isNodeMode: true
    };
  });

  const [logs, setLogs] = useState<string[]>(['CORE: Boot sequence initiated', 'REMOTE: Wireless sync active', 'UHD: Hardware sync ok']);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 30));

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [rotation, setRotation] = useState(0); 
  const [scale, setScale] = useState(1);
  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const activeCategories = useMemo(() => CATEGORIES_CYCLE, []);
  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];

  // Sincronização Mobile -> TV
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smart_pague_menos_products_v4') {
        setProducts(JSON.parse(e.newValue || '[]'));
        addLog('REMOTE: Data updated via mobile');
      }
      if (e.key === 'smart_pague_menos_media_v4') {
        setMediaConfig(JSON.parse(e.newValue || '{}'));
        addLog('REMOTE: Media config updated');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Teclas do Controle Remoto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setLastActivity(Date.now());
      switch(e.key) {
        case 'ArrowRight':
          setCurrentCategoryIndex(prev => (prev + 1) % activeCategories.length);
          addLog('REMOTE: Key -> Category Forward');
          break;
        case 'ArrowLeft':
          setCurrentCategoryIndex(prev => (prev - 1 + activeCategories.length) % activeCategories.length);
          addLog('REMOTE: Key -> Category Backward');
          break;
        case 'Enter':
        case 'Escape':
          setIsAdminOpen(prev => !prev);
          addLog('REMOTE: Key -> Menu Toggle');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCategories.length]);

  // Gestão de Cursor Inativo
  useEffect(() => {
    const timer = setInterval(() => {
      setShowCursor(Date.now() - lastActivity <= 5000);
    }, 1000);
    return () => clearInterval(timer);
  }, [lastActivity]);

  // AJUSTE DE ESCALA (Reduzido para 85% para não ocupar a tela toda)
  const handleResize = useCallback(() => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const isPortrait = Math.abs(rotation % 180) === 90;
    const targetW = isPortrait ? 1080 : 1920;
    const targetH = isPortrait ? 1920 : 1080;
    
    // Multiplicamos por 0.85 para deixar uma margem ao redor
    const s = Math.min(winW / targetW, winH / targetH) * 0.85;
    setScale(s);
  }, [rotation]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products_v4', JSON.stringify(products));
    localStorage.setItem('smart_pague_menos_media_v4', JSON.stringify(mediaConfig));
  }, [products, mediaConfig]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [currentCategoryIndex]);

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
        scrollSpeed={mediaConfig.listScrollSpeed}
        isPartnersEnabled={true}
        onTogglePartners={() => {}}
        onUpdateScrollSpeed={(s) => {
          const newConfig = {...mediaConfig, listScrollSpeed: s};
          setMediaConfig(newConfig);
          localStorage.setItem('smart_pague_menos_media_v4', JSON.stringify(newConfig));
        }}
        onUpdatePrice={(id, price) => {
          const newProducts = products.map(p => p.id === id ? {...p, price} : p);
          setProducts(newProducts);
          localStorage.setItem('smart_pague_menos_products_v4', JSON.stringify(newProducts));
        }}
        onToggleOffer={(id) => {
          const newProducts = products.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item);
          setProducts(newProducts);
          localStorage.setItem('smart_pague_menos_products_v4', JSON.stringify(newProducts));
        }}
      />
    );
  }

  const isPortrait = Math.abs(rotation % 180) === 90;
  const baseWidth = isPortrait ? 1080 : 1920;
  const baseHeight = isPortrait ? 1920 : 1080;

  return (
    <div 
      className={`h-screen w-screen bg-[#050505] flex items-center justify-center overflow-hidden relative ${showCursor ? 'cursor-default' : 'cursor-none'}`}
      onMouseMove={() => setLastActivity(Date.now())}
      onClick={(e) => {
        if (e.clientY < 200) setIsAdminOpen(true);
      }}
    >
      {/* Luzes de fundo para ambientação do painel flutuante */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>

      <div 
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
          backgroundColor: '#000',
        }} 
        className="flex flex-col relative transition-all duration-[1500ms] cubic-bezier(0.25, 1, 0.5, 1) border border-white/10 overflow-hidden flex-shrink-0 shadow-[0_0_200px_rgba(0,0,0,1),0_0_50px_rgba(0,0,0,0.5)] rounded-sm"
      >
        <header className="h-[20%] flex items-center justify-between px-28 z-30 bg-black border-b-8 border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-amber-600/20"></div>
          <div className="flex items-center gap-16 relative z-10">
            <div className="w-44 h-44 bg-white rounded-[4rem] flex items-center justify-center shadow-2xl p-8 ring-4 ring-white/10">
              {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
            </div>
            <div className="flex flex-col">
              <h1 className="text-[9rem] font-black font-oswald italic tracking-tighter uppercase leading-[0.7] text-white">
                  SMART <span className="text-amber-500 neon-text-gold">PAGUE MENOS</span>
              </h1>
              <div className="flex items-center gap-5 mt-4">
                <div className="px-6 py-2 bg-red-600 rounded-2xl animate-pulse">
                    <span className="text-[14px] font-black text-white tracking-[0.5em] uppercase">SINAL UHD LIVE</span>
                </div>
                <span className="text-sm font-bold uppercase tracking-[1em] text-white/40">BROADCAST SYSTEM</span>
              </div>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`h-[65%] flex overflow-hidden ${isPortrait ? 'flex-col' : 'flex-row'}`}>
          <div className={`h-full ${isPortrait ? 'w-full h-[55%]' : 'w-[65%]'} border-r-8 border-white/10 relative overflow-hidden bg-black/40`}>
            <div className={`absolute inset-0 bg-black z-40 transition-opacity duration-1000 pointer-events-none ${isTransitioning ? 'opacity-60' : 'opacity-0'}`}></div>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={mediaConfig.listScrollSpeed} />
          </div>
          <div className={`h-full ${isPortrait ? 'w-full h-[45%]' : 'w-[35%]'} relative`}>
             <FeaturedOffer offer={products.find(p => p.isOffer && p.category === currentCategory) || products.find(p => p.isOffer) || products[0]} />
          </div>
        </main>

        <footer className="h-[15%] flex items-center overflow-hidden z-30 bg-red-600 border-t-8 border-white relative">
          <div className="h-full bg-black flex items-center px-24 z-20 border-r-8 border-white/20">
             <span className="text-7xl font-black font-oswald text-amber-500 italic uppercase tracking-tighter shadow-2xl">OFERTAS</span>
          </div>
          <div className="flex-1 overflow-hidden h-full flex items-center bg-red-600">
            <div className="flex whitespace-nowrap animate-marquee-custom items-center gap-48">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-48">
                  <span className="font-black text-7xl uppercase italic tracking-tighter text-white drop-shadow-lg">
                    {mediaConfig.marqueeText}
                  </span>
                  <div className="w-12 h-12 bg-white rotate-45 border-4 border-black/10"></div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <NodeConsole active={mediaConfig.isNodeMode} logs={logs} />

      {isAdminOpen && (
        <AdminMenu 
          products={products} 
          theme={{ primary: '#b91c1c', accent: '#facc15', background: '#09090b', text: '#ffffff', panel: 'rgba(24, 24, 27, 0.8)' }} 
          isTvMode={true} 
          zoomOffset={0} 
          fitMode={'stretch'} 
          partners={[]} 
          onUpdatePartners={() => {}} 
          onUpdateFitMode={() => {}} 
          onUpdateZoom={() => {}} 
          isHortifrutiEnabled={true} 
          onToggleHortifruti={() => {}} 
          onToggleTvMode={() => {}} 
          onUpdateTheme={() => {}} 
          onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={(id, price) => setProducts(prev => prev.map(p => p.id === id ? {...p, price} : p))} 
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))} 
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))} 
          onBulkToggleOffers={() => {}} 
          onAddProduct={(p) => setProducts(prev => [...prev, p])} 
          onDeleteProduct={() => {}} 
          onRotate90={() => {
            setRotation(r => (r + 90) % 360);
            addLog(`HARDWARE: Rotation update -> ${(rotation + 90) % 360}°`);
          }} 
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
