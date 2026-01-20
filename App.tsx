
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category, Product, ThemeSettings, Partner, MediaConfig } from './types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from './constants';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';

const NodeConsole: React.FC<{ active: boolean, logs: string[] }> = ({ active, logs }) => {
  if (!active) return null;
  return (
    <div className="fixed bottom-24 left-6 z-[250] w-80 bg-black/90 backdrop-blur-xl border border-green-500/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-fade-in font-mono pointer-events-none">
      <div className="bg-green-500/20 px-4 py-2 border-b border-green-500/30 flex justify-between items-center">
        <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Node.js Engine v20.10.0
        </span>
        <span className="text-[9px] text-green-700">PID: 4492</span>
      </div>
      <div className="p-4 h-56 overflow-hidden flex flex-col-reverse text-[10px] gap-1.5 leading-relaxed">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('ERR') ? 'text-red-400' : 'text-green-400/90'}`}>
            <span className="opacity-30 mr-2">{new Date().toLocaleTimeString()}</span>
            <span className="font-bold">{log.split(':')[0]}:</span>
            <span className="ml-1 opacity-80">{log.split(':')[1]}</span>
          </div>
        ))}
      </div>
      <div className="bg-black p-3 grid grid-cols-2 gap-4 border-t border-green-500/10 text-[9px] text-green-600/70 font-bold uppercase tracking-tighter">
        <div className="flex justify-between border-r border-white/5 pr-4"><span>CPU Usage</span> <span>{(Math.random() * 3 + 1).toFixed(2)}%</span></div>
        <div className="flex justify-between pl-2"><span>Memory</span> <span>{(64 + Math.random() * 10).toFixed(0)}MB</span></div>
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
      marqueeText: 'ECONOMIA TODO DIA É AQUI NO SMART PAGUE MENOS • ACEITAMOS TODOS OS CARTÕES • CARNES FRESCAS TODOS OS DIAS •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 10,
      listScrollSpeed: 30,
      isJsMode: false,
      isNodeMode: true // Ativado por padrão para mostrar que está funcionando
    };
  });

  const [logs, setLogs] = useState<string[]>(['CORE: Kernel initialized', 'V8: Optimized JIT execution ready', 'NET: Listening on port 3000']);
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 25));

  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHortifrutiEnabled, setIsHortifrutiEnabled] = useState(true);
  const [isTvMode, setIsTvMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [zoomOffset, setZoomOffset] = useState(0);

  const isPortraitMode = rotation === 90 || rotation === 270;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'remote') setIsRemoteMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products', JSON.stringify(products));
    localStorage.setItem('smart_pague_menos_media', JSON.stringify(mediaConfig));
  }, [products, mediaConfig]);

  const activeCategories = useMemo(() => {
    return CATEGORIES_CYCLE.filter(cat => cat === Category.FRUTAS ? isHortifrutiEnabled : true);
  }, [isHortifrutiEnabled]);

  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];

  useEffect(() => {
    if (mediaConfig.isNodeMode) addLog(`ROUTE_GET: /category/${currentCategory.toLowerCase().replace(' ', '-')}`);
  }, [currentCategory, mediaConfig.isNodeMode]);

  const handleResize = () => {
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const targetW = isPortraitMode ? 1080 : 1920;
    const targetH = isPortraitMode ? 1920 : 1080;
    
    // Calcula a escala para caber perfeitamente na viewport
    const s = Math.min(winW / targetW, winH / targetH) * 0.98; // 2% de margem de segurança
    setScale(s);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rotation, isPortraitMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, 20000);
    return () => clearInterval(timer);
  }, [activeCategories.length]);

  const updatePrice = (id: string, price: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p));
    if (mediaConfig.isNodeMode) addLog(`POST_PRICE: ID#${id.slice(-4)} updated to ${price}`);
  };

  if (isRemoteMode) {
    return (
      <RemoteControl 
        products={products} 
        scrollSpeed={mediaConfig.listScrollSpeed}
        isPartnersEnabled={true}
        onTogglePartners={() => {}}
        onUpdateScrollSpeed={(s) => setMediaConfig({...mediaConfig, listScrollSpeed: s})}
        onUpdatePrice={updatePrice}
        onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
      />
    );
  }

  const baseWidth = isPortraitMode ? 1080 : 1920;
  const baseHeight = isPortraitMode ? 1920 : 1080;

  const appStyle = {
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
    transform: `scale(${scale + zoomOffset}) rotate(${rotation}deg)`,
    '--primary-color': mediaConfig.isJsMode ? '#000000' : '#b91c1c',
    '--accent-color': mediaConfig.isJsMode ? '#fbbf24' : '#facc15',
    '--bg-color': mediaConfig.isJsMode ? '#000000' : '#09090b',
    '--text-color': '#ffffff',
    '--panel-color': mediaConfig.isJsMode ? 'rgba(10, 10, 10, 0.98)' : 'rgba(24, 24, 27, 0.8)',
    backgroundImage: mediaConfig.bgImageUrl ? `url(${mediaConfig.bgImageUrl})` : 'none',
    backgroundColor: 'var(--bg-color)',
    position: 'relative',
    transformOrigin: 'center center',
    flexShrink: 0
  } as React.CSSProperties;

  return (
    <div className={`h-full w-full bg-black flex items-center justify-center overflow-hidden relative ${isTvMode ? 'cursor-none' : ''}`}>
      <div style={appStyle} className={`flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] ${mediaConfig.isJsMode ? 'border-[12px] border-yellow-500/10' : ''}`}>
        <header className="h-32 flex items-center justify-between px-12 border-b-4 border-black/20 z-20" style={{ background: mediaConfig.isJsMode ? 'linear-gradient(to right, #000, #111)' : `linear-gradient(to right, var(--primary-color), rgba(0,0,0,0.6))` }}>
          <div className="flex items-center gap-10">
            <div className={`w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl p-4 transition-all ${mediaConfig.isJsMode ? 'ring-8 ring-yellow-500/30' : ''}`}>
              {mediaConfig.logoUrl ? <img src={mediaConfig.logoUrl} className="max-w-full max-h-full object-contain" /> : <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>}
            </div>
            <div>
              <h1 className={`text-7xl font-black font-oswald italic tracking-tighter uppercase leading-none ${mediaConfig.isJsMode ? 'text-yellow-500' : 'text-white'}`}>SMART <span className={mediaConfig.isJsMode ? 'text-white' : 'text-yellow-400'}>PAGUE MENOS</span></h1>
              <p className="text-xl font-bold uppercase tracking-[0.5em] opacity-60 text-white mt-2">Tecnologia em Alimentos</p>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden ${isPortraitMode ? 'flex-col' : 'flex-row'}`}>
          <div className={`${isPortraitMode ? 'w-full h-[48%]' : 'w-[52%] h-full'} border-r border-white/5`}>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={mediaConfig.listScrollSpeed} isJsMode={mediaConfig.isJsMode} />
          </div>
          <div className={`${isPortraitMode ? 'w-full h-[52%]' : 'w-[48%] h-full'} relative`}>
            {products.filter(p => p.isOffer).length > 0 && <FeaturedOffer offer={products.filter(p => p.isOffer)[activeOfferIndex % products.filter(p => p.isOffer).length]} />}
          </div>
        </main>

        <footer className={`h-20 flex items-center overflow-hidden z-20 border-t-4 ${mediaConfig.isJsMode ? 'bg-yellow-500 border-black' : 'bg-white border-black/10'}`}>
          <div className="flex whitespace-nowrap animate-scroll items-center gap-12 px-10" style={{ animationDuration: `${mediaConfig.listScrollSpeed}s` }}>
            {[1, 2, 3].map(i => <span key={i} className="font-black text-4xl uppercase italic tracking-tight text-black">{mediaConfig.marqueeText}</span>)}
          </div>
        </footer>
      </div>

      <NodeConsole active={mediaConfig.isNodeMode} logs={logs} />

      {!isTvMode && (
        <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-6 scale-110">
          <button onClick={() => setIsTvMode(true)} className="p-7 bg-blue-600 rounded-full text-white shadow-[0_10px_40px_rgba(37,99,235,0.4)] hover:scale-110 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
          </button>
          <button onClick={() => setIsAdminOpen(true)} className="p-7 bg-red-600 rounded-full text-white shadow-[0_10px_40px_rgba(220,38,38,0.4)] hover:scale-110 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      )}

      {isTvMode && (
        <div className="fixed top-0 right-0 w-40 h-40 z-[500] group">
          <button onClick={() => setIsTvMode(false)} className="absolute top-8 right-8 bg-black/60 hover:bg-red-600 text-white/40 hover:text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 backdrop-blur-xl border border-white/10 shadow-2xl">Fechar Modo TV</button>
        </div>
      )}

      {isAdminOpen && (
        <AdminMenu 
          products={products} theme={{ primary: '#b91c1c', accent: '#facc15', background: '#09090b', text: '#ffffff', panel: 'rgba(24, 24, 27, 0.8)' }} isTvMode={isTvMode} zoomOffset={zoomOffset} fitMode={'stretch'} partners={[]} onUpdatePartners={() => {}} onUpdateFitMode={() => {}} onUpdateZoom={(z) => setZoomOffset(z)} isHortifrutiEnabled={isHortifrutiEnabled} onToggleHortifruti={() => setIsHortifrutiEnabled(!isHortifrutiEnabled)} onToggleTvMode={() => setIsTvMode(!isTvMode)} onUpdateTheme={() => {}} onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={updatePrice} onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))} onUpdateName={(id, name) => setProducts(prev => prev.map(item => item.id === id ? {...item, name} : item))} onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))} onBulkToggleOffers={(off) => setProducts(prev => prev.map(item => ({...item, isOffer: off})))} onAddProduct={(p) => setProducts(prev => [...prev, p])} onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))} onRotate90={() => setRotation(prev => (prev + 90) % 360)} onSpin360={() => {}} currentRotation={rotation} isSpinning={false} mediaConfig={mediaConfig} onUpdateMedia={setMediaConfig}
        />
      )}
    </div>
  );
};

export default App;
