
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
    <div className="fixed bottom-36 left-10 z-[250] w-96 bg-black/95 backdrop-blur-3xl border border-green-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-left-8 font-mono pointer-events-none ring-1 ring-white/10">
      <div className="bg-green-500/10 px-6 py-4 border-b border-green-500/20 flex justify-between items-center">
        <span className="text-[11px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></span>
          MEDIA_SERVER_OS_v5.0
        </span>
        <span className="text-[9px] text-zinc-500 font-bold tracking-tighter">UHD_READY</span>
      </div>
      <div className="p-6 h-72 overflow-hidden flex flex-col-reverse text-[10px] gap-2.5 leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('ERR') ? 'text-red-400' : log.includes('SYNC') ? 'text-blue-400' : log.includes('EVENT') ? 'text-amber-400' : 'text-green-500/80'}`}>
            <span className="opacity-30 mr-3 text-[8px] italic font-light">[{new Date().toLocaleTimeString('pt-BR', {hour12: false})}]</span>
            <span className="font-bold tracking-tight">{log.split(':')[0]}</span>
            <span className="ml-1 opacity-90 font-medium">{log.split(':')[1]}</span>
          </div>
        ))}
      </div>
      <div className="bg-zinc-950 p-5 grid grid-cols-2 gap-5 border-t border-white/5 text-[10px] text-zinc-500 font-bold uppercase">
        <div className="flex justify-between px-4 bg-white/5 py-2.5 rounded-xl border border-white/5"><span>GPU_LOAD</span> <span className="text-green-400">{(Math.random() * 12 + 4).toFixed(1)}%</span></div>
        <div className="flex justify-between px-4 bg-white/5 py-2.5 rounded-xl border border-white/5"><span>ROTATION</span> <span className="text-amber-400">ACTIVE</span></div>
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
      marqueeText: 'QUALIDADE E ECONOMIA É NO SMART PAGUE MENOS • CARNES SELECIONADAS COM PROCEDÊNCIA GARANTIDA • HORTIFRUTI DIRETO DO PRODUTOR • ACEITAMOS TODOS OS CARTÕES •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 18,
      listScrollSpeed: 45,
      isJsMode: false,
      isNodeMode: true
    };
  });

  const [logs, setLogs] = useState<string[]>(['CORE: Media engine initialized', 'SYNC: Fetching real-time price feed', 'UHD: Hardware acceleration active', 'SYSTEM: TV Mode enabled by default']);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 30));

  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTvMode, setIsTvMode] = useState(true);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [scale, setScale] = useState(1);
  const [weather, setWeather] = useState('28°C');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleResize = useCallback(() => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    
    // Identifica se a orientação ATUAL é vertical baseada na rotação
    const isPortrait = rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270;
    
    const targetW = isPortrait ? 1080 : 1920;
    const targetH = isPortrait ? 1920 : 1080;
    
    // Escala perfeita para caber na tela sem cortes
    const s = Math.min(winW / targetW, winH / targetH);
    setScale(s);
  }, [rotation]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
    if (params.get('admin') === 'true') setIsTvMode(false);
    
    const wTimer = setInterval(() => {
      setWeather(`${(26 + Math.random() * 4).toFixed(0)}°C`);
    }, 120000);

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(wTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products_v4', JSON.stringify(products));
    localStorage.setItem('smart_pague_menos_media_v4', JSON.stringify(mediaConfig));
  }, [products, mediaConfig]);

  const activeCategories = useMemo(() => CATEGORIES_CYCLE, []);
  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 900);
    if (mediaConfig.isNodeMode) {
        addLog(`SYNC: Category switch -> [${currentCategory}]`);
    }
    return () => clearTimeout(timer);
  }, [currentCategoryIndex, mediaConfig.isNodeMode, currentCategory]);

  useEffect(() => {
    const interval = (mediaConfig.slideDuration || 18) * 1000;
    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, interval);
    return () => clearInterval(timer);
  }, [activeCategories.length, mediaConfig.slideDuration]);

  if (isRemoteMode) {
    return (
      <RemoteControl 
        products={products} 
        scrollSpeed={mediaConfig.listScrollSpeed}
        isPartnersEnabled={true}
        onTogglePartners={() => {}}
        onUpdateScrollSpeed={(s) => setMediaConfig({...mediaConfig, listScrollSpeed: s})}
        onUpdatePrice={(id, price) => setProducts(prev => prev.map(p => p.id === id ? {...p, price} : p))}
        onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
      />
    );
  }

  const isPortraitLayout = rotation === 90 || rotation === 270 || rotation === -90 || rotation === -270;
  const baseWidth = isPortraitLayout ? 1080 : 1920;
  const baseHeight = isPortraitLayout ? 1920 : 1080;

  const rotatePanel = () => {
    const nextRotation = (rotation + 90);
    setRotation(nextRotation);
    addLog(`UHD: Rotation Engine triggered -> ${nextRotation % 360}°`);
  };

  return (
    <div 
      className={`h-screen w-screen bg-[#010101] flex items-center justify-center overflow-hidden relative ${isTvMode ? 'cursor-none' : ''}`}
      onMouseMove={() => {
        if (isTvMode) {
          setIsTvMode(false);
          const timer = setTimeout(() => setIsTvMode(true), 8000);
          return () => clearTimeout(timer);
        }
      }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(220,38,38,0.1),transparent_60%)] pointer-events-none z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(251,191,36,0.06),transparent_60%)] pointer-events-none z-10"></div>

      {/* MOTOR DE ROTAÇÃO 360 GRAUS */}
      <div 
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
          backgroundColor: '#000',
        }} 
        className={`flex flex-col relative transition-all duration-[1500ms] cubic-bezier(0.22, 1, 0.36, 1) broadcast-shadow border border-white/5 overflow-hidden flex-shrink-0 shadow-[0_0_150px_rgba(0,0,0,1)]`}
      >
        {/* HEADER (20% HEIGHT) */}
        <header className="h-[20%] flex items-center justify-between px-28 z-30 bg-black/95 backdrop-blur-3xl border-b-4 border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-amber-600/10"></div>
          
          <div className="flex items-center gap-20 relative z-10">
            <div className="relative group">
               <div className="absolute -inset-6 bg-gradient-to-tr from-red-600 to-amber-500 rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-40 transition-opacity"></div>
               <div className="w-40 h-40 bg-white rounded-[3rem] flex items-center justify-center shadow-2xl p-7 ring-2 ring-white/10 relative overflow-hidden">
                {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
               </div>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-[7.5rem] font-black font-oswald italic tracking-tighter uppercase leading-[0.8] text-white">
                  SMART <span className="text-amber-500 neon-text-gold">PAGUE MENOS</span>
              </h1>
              <div className="flex items-center gap-6 mt-2">
                <div className="px-4 py-1.5 bg-red-600 rounded-xl animate-pulse border-2 border-white/20">
                    <span className="text-xs font-black text-white tracking-[0.3em] uppercase">BROADCAST 360°</span>
                </div>
                <span className="text-sm font-black uppercase tracking-[0.8em] text-white/30">ORIENTATION_AUTO</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-16">
             <div className="h-32 w-[3px] bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full"></div>
             <DigitalClock />
          </div>
        </header>

        {/* MAIN AREA - ADAPTABLE GRID */}
        <main className={`h-[65%] flex overflow-hidden ${isPortraitLayout ? 'flex-col' : 'flex-row'}`}>
          <div className={`h-full ${isPortraitLayout ? 'w-full h-[58%]' : 'w-[65%]'} border-r-4 border-white/10 relative overflow-hidden bg-zinc-950/20`}>
            <div className={`absolute inset-0 bg-black z-[40] transition-opacity duration-1000 pointer-events-none ${isTransitioning ? 'opacity-40' : 'opacity-0'}`}></div>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={mediaConfig.listScrollSpeed} />
          </div>
          
          <div className={`h-full ${isPortraitLayout ? 'w-full h-[42%]' : 'w-[35%]'} relative`}>
             <FeaturedOffer offer={
               products.find(p => p.isOffer && p.category === currentCategory) || 
               products.find(p => p.isOffer) || 
               products[0]
             } />
          </div>
        </main>

        {/* FOOTER (15% HEIGHT) */}
        <footer className="h-[15%] flex items-center overflow-hidden z-30 bg-red-600 border-t-8 border-white relative shadow-[0_-40px_150px_rgba(0,0,0,1)]">
          <div className="h-full bg-black flex items-center px-24 z-20 border-r-8 border-white/30 relative">
             <div className="flex flex-col items-center">
                <span className="text-6xl font-black font-oswald text-amber-500 italic uppercase tracking-tighter drop-shadow-xl">OFERTAS</span>
                <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em] mt-2 font-mono">BROADCAST_MOD</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden h-full flex items-center bg-red-600">
            <div className="flex whitespace-nowrap animate-marquee-custom items-center gap-48">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-48">
                  <span className="font-black text-6xl uppercase italic tracking-tighter text-white drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)]">
                    {mediaConfig.marqueeText}
                  </span>
                  <div className="w-10 h-10 bg-white rotate-45 shadow-[0_0_25px_rgba(255,255,255,0.6)] border-4 border-black/10"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-full bg-zinc-950 flex items-center px-24 border-l-8 border-white/30 z-20">
             <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-2 font-mono">THERMO_FEED</span>
                <span className="text-6xl font-black font-oswald text-white tabular-nums tracking-tighter neon-text-gold">{weather}</span>
             </div>
          </div>
        </footer>
      </div>

      <NodeConsole active={mediaConfig.isNodeMode} logs={logs} />

      {!isTvMode && (
        <div className="fixed bottom-44 right-16 z-[300] flex flex-col gap-8 scale-110">
          <div className="bg-black/60 backdrop-blur-3xl p-5 rounded-[3.5rem] border-2 border-white/10 flex flex-col gap-5 shadow-2xl ring-1 ring-white/5">
             <button onClick={() => setIsTvMode(true)} className="p-10 bg-blue-600 text-white hover:bg-white hover:text-blue-600 rounded-[3rem] shadow-xl transition-all active:scale-95 border-[6px] border-black group overflow-hidden relative" title="Modo TV">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
             </button>
             <button onClick={rotatePanel} className="p-10 bg-green-600 text-white hover:bg-white hover:text-green-600 rounded-[3rem] shadow-xl transition-all active:scale-95 border-[6px] border-black group" title="Girar 360°">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
             </button>
             <button onClick={() => setIsAdminOpen(true)} className="p-10 bg-amber-500 text-black hover:bg-white rounded-[3rem] shadow-xl transition-all active:scale-95 border-[6px] border-black group" title="Configurações">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
             </button>
          </div>
        </div>
      )}

      {isAdminOpen && (
        <AdminMenu 
          products={products} 
          theme={{ primary: '#b91c1c', accent: '#facc15', background: '#09090b', text: '#ffffff', panel: 'rgba(24, 24, 27, 0.8)' }} 
          isTvMode={isTvMode} 
          zoomOffset={0} 
          fitMode={'stretch'} 
          partners={[]} 
          onUpdatePartners={() => {}} 
          onUpdateFitMode={() => {}} 
          onUpdateZoom={() => {}} 
          isHortifrutiEnabled={true} 
          onToggleHortifruti={() => {}} 
          onToggleTvMode={() => setIsTvMode(!isTvMode)} 
          onUpdateTheme={() => {}} 
          onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={(id, price) => setProducts(prev => prev.map(p => p.id === id ? {...p, price} : p))} 
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))} 
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))} 
          onBulkToggleOffers={() => {}} 
          onAddProduct={(p) => setProducts(prev => [...prev, p])} 
          onDeleteProduct={() => {}} 
          onRotate90={rotatePanel} 
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
