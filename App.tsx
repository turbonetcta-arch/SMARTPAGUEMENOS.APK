
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
    <div className="fixed bottom-24 left-6 z-[250] w-80 bg-black/95 backdrop-blur-2xl border border-green-500/30 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.15)] animate-in fade-in slide-in-from-bottom-4 font-mono pointer-events-none">
      <div className="bg-green-500/10 px-4 py-2 border-b border-green-500/20 flex justify-between items-center">
        <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          SYS_MONITOR_V2
        </span>
        <span className="text-[8px] text-green-800">Uptime: {Math.floor(performance.now()/1000)}s</span>
      </div>
      <div className="p-4 h-48 overflow-hidden flex flex-col-reverse text-[9px] gap-1 leading-tight">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('ERR') ? 'text-red-400' : 'text-green-500/80'}`}>
            <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString('pt-BR', {hour12: false})}]</span>
            <span className="font-bold">{log.split(':')[0]}</span>
            <span className="ml-1 opacity-70">{log.split(':')[1]}</span>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900/50 p-2.5 grid grid-cols-2 gap-2 border-t border-green-500/10 text-[8px] text-green-600/60 font-bold uppercase">
        <div className="flex justify-between px-2"><span>CPU</span> <span>{(Math.random() * 2 + 0.5).toFixed(1)}%</span></div>
        <div className="flex justify-between px-2 border-l border-white/5"><span>RAM</span> <span>{(50 + Math.random() * 5).toFixed(0)}MB</span></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smart_pague_menos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [mediaConfig, setMediaConfig] = useState<MediaConfig>(() => {
    const saved = localStorage.getItem('smart_pague_menos_media');
    return saved ? JSON.parse(saved) : {
      marqueeText: 'QUALIDADE E ECONOMIA É NO SMART PAGUE MENOS • CARNES SELECIONADAS • HORTIFRUTI DIRETO DO PRODUTOR • ACEITAMOS TODOS OS CARTÕES •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 10,
      listScrollSpeed: 40,
      isJsMode: false,
      isNodeMode: true
    };
  });

  const [logs, setLogs] = useState<string[]>(['SYS: Booting kernel...', 'V8: Engine ready', 'API: Listening']);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 20));

  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
    
    // Suprimir logs de erro de favicon no console se possível
    window.addEventListener('error', (e) => {
      if (e.message.includes('favicon')) e.preventDefault();
    }, true);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products', JSON.stringify(products));
    localStorage.setItem('smart_pague_menos_media', JSON.stringify(mediaConfig));
  }, [products, mediaConfig]);

  const activeCategories = useMemo(() => CATEGORIES_CYCLE, []);
  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];

  useEffect(() => {
    if (mediaConfig.isNodeMode) addLog(`FETCH: /api/v1/prices/${currentCategory.toLowerCase().split(' ')[0]}`);
  }, [currentCategory, mediaConfig.isNodeMode]);

  const handleResize = () => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const targetW = (rotation === 90 || rotation === 270) ? 1080 : 1920;
    const targetH = (rotation === 90 || rotation === 270) ? 1920 : 1080;
    const s = Math.min(winW / targetW, winH / targetH) * 0.98;
    setScale(s);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rotation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [activeCategories.length]);

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

  const baseWidth = (rotation === 90 || rotation === 270) ? 1080 : 1920;
  const baseHeight = (rotation === 90 || rotation === 270) ? 1920 : 1080;

  return (
    <div className={`h-full w-full bg-black flex items-center justify-center overflow-hidden relative ${isTvMode ? 'cursor-none' : ''}`}>
      <div 
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
          backgroundColor: mediaConfig.isJsMode ? '#000' : '#050505',
        }} 
        className="flex flex-col shadow-[0_0_120px_rgba(0,0,0,1)] relative transition-transform duration-700 ease-out"
      >
        <header className="h-32 flex items-center justify-between px-12 border-b-2 border-white/5 z-20 overflow-hidden relative" style={{ background: mediaConfig.isJsMode ? 'linear-gradient(90deg, #000 0%, #111 100%)' : 'linear-gradient(90deg, #811212 0%, #450a0a 100%)' }}>
          {/* Luz ambiente no header */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className={`w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-4 ${mediaConfig.isJsMode ? 'ring-4 ring-yellow-500/20' : ''}`}>
              {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
            </div>
            <div>
              <h1 className={`text-6xl font-black font-oswald italic tracking-tighter uppercase leading-none ${mediaConfig.isJsMode ? 'text-yellow-500' : 'text-white'}`}>SMART <span className={mediaConfig.isJsMode ? 'text-white' : 'text-yellow-400'}>PAGUE MENOS</span></h1>
              <p className="text-lg font-bold uppercase tracking-[0.4em] opacity-40 text-white mt-1">Sua melhor escolha em carnes</p>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden ${(rotation === 90 || rotation === 270) ? 'flex-col' : 'flex-row'}`}>
          <div className={`h-full ${(rotation === 90 || rotation === 270) ? 'w-full h-[50%]' : 'w-[55%]'} border-r border-white/5 bg-zinc-950/20 backdrop-blur-sm`}>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={mediaConfig.listScrollSpeed} isJsMode={mediaConfig.isJsMode} />
          </div>
          <div className={`h-full ${(rotation === 90 || rotation === 270) ? 'w-full h-[50%]' : 'w-[45%]'}`}>
            {products.filter(p => p.isOffer).length > 0 && <FeaturedOffer offer={products.filter(p => p.isOffer)[0]} />}
          </div>
        </main>

        <footer className={`h-16 flex items-center overflow-hidden z-20 border-t border-white/5 ${mediaConfig.isJsMode ? 'bg-yellow-500' : 'bg-white'}`}>
          <div className="flex whitespace-nowrap animate-scroll items-center gap-16 px-12" style={{ animationDuration: '30s' }}>
            {[1, 2, 3, 4].map(i => <span key={i} className="font-black text-3xl uppercase italic tracking-tight text-black">{mediaConfig.marqueeText}</span>)}
          </div>
        </footer>
      </div>

      <NodeConsole active={mediaConfig.isNodeMode} logs={logs} />

      {!isTvMode && (
        <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-4">
          <button onClick={() => setIsAdminOpen(true)} className="p-6 bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-xl rounded-full text-white shadow-2xl transition-all active:scale-95 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      )}

      {isAdminOpen && (
        <AdminMenu 
          products={products} theme={{ primary: '#b91c1c', accent: '#facc15', background: '#09090b', text: '#ffffff', panel: 'rgba(24, 24, 27, 0.8)' }} isTvMode={isTvMode} zoomOffset={0} fitMode={'stretch'} partners={[]} onUpdatePartners={() => {}} onUpdateFitMode={() => {}} onUpdateZoom={() => {}} isHortifrutiEnabled={true} onToggleHortifruti={() => {}} onToggleTvMode={() => setIsTvMode(!isTvMode)} onUpdateTheme={() => {}} onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={(id, price) => setProducts(prev => prev.map(p => p.id === id ? {...p, price} : p))} onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))} onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))} onBulkToggleOffers={() => {}} onAddProduct={(p) => setProducts(prev => [...prev, p])} onDeleteProduct={() => {}} onRotate90={() => setRotation(prev => (prev + 90) % 360)} onSpin360={() => {}} currentRotation={rotation} isSpinning={false} mediaConfig={mediaConfig} onUpdateMedia={setMediaConfig}
        />
      )}
    </div>
  );
};

export default App;
