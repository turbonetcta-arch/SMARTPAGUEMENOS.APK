import React, { useState, useEffect, useMemo } from 'react';
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
    <div className="fixed bottom-36 left-10 z-[250] w-88 bg-black/95 backdrop-blur-3xl border border-green-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-left-6 font-mono pointer-events-none ring-1 ring-white/10">
      <div className="bg-green-500/10 px-5 py-3 border-b border-green-500/20 flex justify-between items-center">
        <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-3">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></span>
          ENGINE_CORE_v4.5
        </span>
        <span className="text-[9px] text-zinc-500 font-bold">STABLE</span>
      </div>
      <div className="p-5 h-64 overflow-hidden flex flex-col-reverse text-[10px] gap-2 leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('ERR') ? 'text-red-400' : log.includes('EVENT') ? 'text-amber-400' : 'text-green-500/80'}`}>
            <span className="opacity-30 mr-3 text-[8px] italic">[{new Date().toLocaleTimeString('pt-BR', {hour12: false})}]</span>
            <span className="font-bold">{log.split(':')[0]}</span>
            <span className="ml-1 opacity-90">{log.split(':')[1]}</span>
          </div>
        ))}
      </div>
      <div className="bg-zinc-950 p-4 grid grid-cols-2 gap-4 border-t border-white/5 text-[9px] text-zinc-500 font-bold uppercase">
        <div className="flex justify-between px-3 bg-white/5 py-2 rounded-xl"><span>LOAD</span> <span className="text-green-400">{(Math.random() * 0.8 + 0.1).toFixed(2)}</span></div>
        <div className="flex justify-between px-3 bg-white/5 py-2 rounded-xl"><span>MEM</span> <span className="text-blue-400">{(142 + Math.random() * 8).toFixed(0)}MB</span></div>
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
      marqueeText: 'QUALIDADE E ECONOMIA É NO SMART PAGUE MENOS • CARNES SELECIONADAS • HORTIFRUTI DIRETO DO PRODUTOR • ACEITAMOS TODOS OS CARTÕES •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 20,
      listScrollSpeed: 45,
      isJsMode: false,
      isNodeMode: true
    };
  });

  const [logs, setLogs] = useState<string[]>(['CORE: Boot sequence complete', 'V8: Optimization pass ready', 'SHADERS: Hot-reloading media pipeline']);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 30));

  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTvMode, setIsTvMode] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [weather, setWeather] = useState('28°C');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
    if (params.get('admin') === 'true') setIsTvMode(false);
    
    const wTimer = setInterval(() => {
      setWeather(`${(25 + Math.random() * 5).toFixed(0)}°C`);
    }, 120000);
    return () => clearInterval(wTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products_v4', JSON.stringify(products));
    localStorage.setItem('smart_pague_menos_media_v4', JSON.stringify(mediaConfig));
  }, [products, mediaConfig]);

  const activeCategories = useMemo(() => CATEGORIES_CYCLE, []);
  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    if (mediaConfig.isNodeMode) {
        addLog(`EVENT: Syncing category [${currentCategory}]`);
        addLog(`MEM: GC triggered for frame clearing`);
    }
    return () => clearTimeout(timer);
  }, [currentCategoryIndex, mediaConfig.isNodeMode]);

  const handleResize = () => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const isPortrait = rotation === 90 || rotation === 270;
    const targetW = isPortrait ? 1080 : 1920;
    const targetH = isPortrait ? 1920 : 1080;
    const s = Math.min(winW / targetW, winH / targetH) * 0.99;
    setScale(s);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rotation]);

  useEffect(() => {
    const interval = (mediaConfig.slideDuration || 20) * 1000;
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

  const isPortrait = rotation === 90 || rotation === 270;
  const baseWidth = isPortrait ? 1080 : 1920;
  const baseHeight = isPortrait ? 1920 : 1080;

  return (
    <div 
      className={`h-full w-full bg-[#030303] flex items-center justify-center overflow-hidden relative ${isTvMode ? 'cursor-none' : ''}`}
      onMouseMove={() => {
        if (isTvMode) {
          setIsTvMode(false);
          setTimeout(() => setIsTvMode(true), 5000);
        }
      }}
    >
      {/* Background Ambience Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.05),transparent_50%)] pointer-events-none"></div>

      <div 
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
          backgroundColor: '#000',
        }} 
        className={`flex flex-col relative transition-transform duration-[1500ms] cubic-bezier(0.2, 0, 0, 1) broadcast-shadow border border-white/5 overflow-hidden`}
      >
        {/* HEADER AREA */}
        <header className="h-48 flex items-center justify-between px-24 z-30 bg-black/80 backdrop-blur-3xl border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-amber-600/5"></div>
          
          <div className="flex items-center gap-16 relative z-10">
            <div className="relative group">
               <div className="absolute -inset-4 bg-gradient-to-tr from-red-600 to-amber-500 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity animate-pulse"></div>
               <div className="w-36 h-36 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl p-6 ring-2 ring-white/10 relative overflow-hidden">
                {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
               </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-[6.5rem] font-black font-oswald italic tracking-tighter uppercase leading-[0.85] text-white">
                    SMART <span className="text-amber-500 neon-text-gold">PAGUE MENOS</span>
                </h1>
                <div className="mt-6 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-lg animate-pulse border border-white/20">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">LIVE</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.7em] text-white/40">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shadow-[0_0_10px_#dc2626]"></span>
                  OFERTAS EM TEMPO REAL
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-14 relative z-10">
             <div className="h-24 w-[2px] bg-white/10 rounded-full shadow-[0_0_20px_white/10]"></div>
             <DigitalClock />
          </div>
        </header>

        {/* CONTENT REGION */}
        <main className={`flex-1 flex overflow-hidden ${isPortrait ? 'flex-col' : 'flex-row'}`}>
          <div className={`h-full ${isPortrait ? 'w-full h-[55%]' : 'w-[58%]'} border-r border-white/5 relative overflow-hidden`}>
            <div className={`absolute inset-0 bg-black z-[40] transition-opacity duration-700 pointer-events-none ${isTransitioning ? 'opacity-30' : 'opacity-0'}`}></div>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={mediaConfig.listScrollSpeed} />
          </div>
          
          <div className={`h-full ${isPortrait ? 'w-full h-[45%]' : 'w-[42%]'} relative`}>
             <FeaturedOffer offer={
               products.find(p => p.isOffer && p.category === currentCategory) || 
               products.find(p => p.isOffer) || 
               products[0]
             } />
          </div>
        </main>

        {/* TICKER FOOTER */}
        <footer className="h-32 flex items-center overflow-hidden z-30 bg-red-600 border-t-4 border-white relative shadow-[0_-30px_100px_rgba(0,0,0,0.9)]">
          <div className="h-full bg-black flex items-center px-16 z-20 border-r-4 border-white/30 relative">
             <div className="absolute inset-0 bg-red-600/10 animate-pulse"></div>
             <div className="flex flex-col items-center">
                <span className="text-5xl font-black font-oswald text-amber-500 italic uppercase tracking-tighter relative">OFERTAS:</span>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">Sinal Live</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-hidden h-full flex items-center bg-red-600">
            <div className="flex whitespace-nowrap animate-marquee-custom items-center gap-32">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-32">
                  <span className="font-black text-5xl uppercase italic tracking-tighter text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                    {mediaConfig.marqueeText}
                  </span>
                  <div className="w-6 h-6 bg-white rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
                  <span className="font-black text-5xl uppercase italic tracking-tighter text-white opacity-90 underline decoration-amber-400 decoration-4 underline-offset-8">
                    QUALIDADE QUE VOCÊ JÁ CONHECE •
                  </span>
                  <div className="w-6 h-6 bg-white rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.4)]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-full bg-zinc-950 flex items-center px-16 border-l-4 border-white/30 z-20">
             <div className="flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">LOCAL TEMP</span>
                <span className="text-5xl font-black font-oswald text-white tabular-nums tracking-tighter neon-text-gold">{weather}</span>
             </div>
          </div>
        </footer>
      </div>

      <NodeConsole active={mediaConfig.isNodeMode} logs={logs} />

      {!isTvMode && (
        <div className="fixed bottom-40 right-14 z-[300] flex flex-col gap-6 scale-110">
          <button 
            onClick={() => setIsAdminOpen(true)} 
            className="p-8 bg-amber-500 text-black hover:bg-white rounded-[2.5rem] shadow-[0_30px_80px_-15px_rgba(245,158,11,0.6)] transition-all active:scale-90 border-4 border-black group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-[120deg] transition-transform duration-1000"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
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