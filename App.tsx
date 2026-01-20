
import React, { useState, useEffect, useCallback } from 'react';
import { useBroadcastEngine } from './hooks/useBroadcastEngine';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';

const App: React.FC = () => {
  const engine = useBroadcastEngine();
  const [scale, setScale] = useState(1);
  const [showCursor, setShowCursor] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Lógica de Escala Dinâmica (Efeito 85% "Pequeno")
  const updateLayout = useCallback(() => {
    const isPortrait = Math.abs(engine.mediaConfig.rotation % 180) === 90;
    const targetW = isPortrait ? 1080 : 1920;
    const targetH = isPortrait ? 1920 : 1080;
    const s = Math.min(window.innerWidth / targetW, window.innerHeight / targetH) * 0.82;
    setScale(s);
  }, [engine.mediaConfig.rotation]);

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [updateLayout]);

  // Controle Remoto de TV (Teclado)
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      setLastActivity(Date.now());
      if (engine.isAdminOpen && e.key !== 'Escape') return;

      switch(e.key) {
        case 'ArrowRight': engine.setCurrentCategoryIndex(p => p + 1); break;
        case 'ArrowLeft': engine.setCurrentCategoryIndex(p => p - 1); break;
        case 'Enter': engine.setIsAdminOpen(true); break;
        case 'Escape': engine.setIsAdminOpen(false); break;
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [engine.isAdminOpen]);

  // Mouse Timeout
  useEffect(() => {
    const t = setInterval(() => setShowCursor(Date.now() - lastActivity < 3000), 1000);
    return () => clearInterval(t);
  }, [lastActivity]);

  if (new URLSearchParams(window.location.search).get('mode') === 'remote') {
    return (
      <RemoteControl 
        products={engine.products}
        scrollSpeed={engine.mediaConfig.listScrollSpeed}
        isPartnersEnabled={true}
        onTogglePartners={() => {}}
        onUpdateScrollSpeed={s => engine.setMediaConfig(p => ({...p, listScrollSpeed: s}))}
        onUpdatePrice={(id, price) => engine.setProducts(p => p.map(i => i.id === id ? {...i, price} : i))}
        onToggleOffer={id => engine.setProducts(p => p.map(i => i.id === id ? {...i, isOffer: !i.isOffer} : i))}
      />
    );
  }

  const isPortrait = Math.abs(engine.mediaConfig.rotation % 180) === 90;

  return (
    <div 
      className={`h-screen w-screen bg-[#020202] flex items-center justify-center overflow-hidden transition-all ${showCursor || engine.isAdminOpen ? 'cursor-default' : 'cursor-none'}`}
      onMouseMove={() => setLastActivity(Date.now())}
    >
      {/* Background Studio Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      
      {/* The Main "Small" Canvas */}
      <div 
        style={{
          width: isPortrait ? '1080px' : '1920px',
          height: isPortrait ? '1920px' : '1080px',
          transform: `scale(${scale}) rotate(${engine.mediaConfig.rotation}deg)`,
          backgroundImage: engine.mediaConfig.bgImageUrl ? `url(${engine.mediaConfig.bgImageUrl})` : 'none',
        }}
        className="flex flex-col bg-black border-[12px] border-white/10 shadow-[0_0_150px_rgba(0,0,0,1),0_0_40px_rgba(255,255,255,0.05)] rounded-lg overflow-hidden relative shrink-0"
      >
        <header className="h-[20%] flex items-center justify-between px-28 bg-black border-b-8 border-white/10 relative">
          <div className="flex items-center gap-16 relative z-10">
            <div className="w-44 h-44 bg-white rounded-[4rem] flex items-center justify-center p-8 ring-4 ring-white/10">
              {engine.mediaConfig.logoUrl ? <img src={engine.mediaConfig.logoUrl} className="max-h-full object-contain" /> : <span className="text-red-600 font-black text-6xl">S</span>}
            </div>
            <div>
              <h1 className="text-[9rem] font-black font-oswald italic leading-[0.7] text-white tracking-tighter uppercase">
                SMART <span className="text-amber-500 neon-text-gold">PAGUE MENOS</span>
              </h1>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`h-[65%] flex overflow-hidden ${isPortrait ? 'flex-col' : 'flex-row'}`}>
          <div className={`${isPortrait ? 'h-1/2 w-full' : 'w-[65%] h-full'} border-r-8 border-white/10 bg-zinc-950/50`}>
            <PriceList products={engine.products} currentCategory={engine.currentCategory} scrollSpeed={engine.mediaConfig.listScrollSpeed} />
          </div>
          <div className={`${isPortrait ? 'h-1/2 w-full' : 'w-[35%] h-full'}`}>
            <FeaturedOffer offer={engine.products.find(p => p.isOffer && p.category === engine.currentCategory) || engine.products[0]} />
          </div>
        </main>

        <footer className="h-[15%] flex items-center bg-red-600 border-t-8 border-white relative overflow-hidden">
          <div className="h-full bg-black flex items-center px-24 z-20 border-r-8 border-white/20 shrink-0">
             <span className="text-7xl font-black font-oswald text-amber-500 italic uppercase">OFERTAS</span>
          </div>
          <div className="flex-1 overflow-hidden h-full flex items-center">
            <div className="flex whitespace-nowrap animate-marquee-custom items-center gap-48">
              <span className="font-black text-7xl uppercase italic text-white">{engine.mediaConfig.marqueeText}</span>
              <span className="font-black text-7xl uppercase italic text-white">{engine.mediaConfig.marqueeText}</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Overlays */}
      {engine.mediaConfig.isNodeMode && (
        <div className="fixed bottom-8 left-8 z-[500] w-80 bg-black/90 p-6 rounded-3xl border border-green-500/30 font-mono text-[10px] text-green-500 shadow-2xl pointer-events-none">
          <div className="flex justify-between mb-2 border-b border-green-500/20 pb-2">
            <span>UHD_ENGINE_v5.5</span>
            <span className="animate-pulse">● LIVE</span>
          </div>
          {engine.logs.map((log, i) => <div key={i} className="opacity-70 truncate">> {log}</div>)}
        </div>
      )}

      {engine.isAdminOpen && (
        <AdminMenu 
          products={engine.products} 
          theme={{ primary: '#b91c1c', accent: '#facc15', background: '#09090b', text: '#ffffff', panel: 'rgba(24, 24, 27, 0.8)' }} 
          mediaConfig={engine.mediaConfig}
          onUpdateMedia={engine.setMediaConfig}
          onClose={() => engine.setIsAdminOpen(false)}
          onUpdatePrice={(id, price) => engine.setProducts(p => p.map(i => i.id === id ? {...i, price} : i))}
          onToggleOffer={id => engine.setProducts(p => p.map(i => i.id === id ? {...i, isOffer: !i.isOffer} : i))}
          onRotate90={() => engine.setMediaConfig(p => ({...p, rotation: (p.rotation + 90) % 360}))}
          currentRotation={engine.mediaConfig.rotation}
          onAddProduct={p => engine.setProducts(prev => [...prev, p])}
          onUpdateImage={(id, img) => engine.setProducts(p => p.map(i => i.id === id ? {...i, imageUrl: img} : i))}
          partners={[]} onUpdatePartners={() => {}} isTvMode={true} zoomOffset={0} fitMode={'stretch'} onUpdateFitMode={() => {}} onUpdateZoom={() => {}} isHortifrutiEnabled={true} onToggleHortifruti={() => {}} onToggleTvMode={() => {}} onUpdateTheme={() => {}} onBulkToggleOffers={() => {}} onDeleteProduct={() => {}} onSpin360={() => {}} isSpinning={false}
        />
      )}
    </div>
  );
};

export default App;
