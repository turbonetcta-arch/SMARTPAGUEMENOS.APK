
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category, Product, ThemeSettings } from './types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from './constants';
import PriceList from './components/PriceList';
import FeaturedOffer from './components/FeaturedOffer';
import DigitalClock from './components/DigitalClock';
import AdminMenu from './components/AdminMenu';
import RemoteControl from './components/RemoteControl';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smart_pague_menos_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [scrollSpeed, setScrollSpeed] = useState(() => {
    const saved = localStorage.getItem('smart_pague_menos_scroll_speed');
    return saved ? parseInt(saved) : 30;
  });

  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHortifrutiEnabled, setIsHortifrutiEnabled] = useState(true);
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  
  // Theme State
  const [theme, setTheme] = useState<ThemeSettings>({
    primary: '#b91c1c', // red-700
    accent: '#facc15',  // yellow-400
    background: '#09090b', // zinc-950
    text: '#ffffff',
    panel: 'rgba(24, 24, 27, 0.8)' // zinc-900 with opacity
  });

  // States for TV Mode and Layout
  const [isTvMode, setIsTvMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [fitMode, setFitMode] = useState<'contain' | 'stretch'>('stretch');
  const [zoomOffset, setZoomOffset] = useState(0);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const isPortraitMode = rotation === 90 || rotation === 270;

  // Detecta Modo Remoto e Sincroniza
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('remote') === 'true') {
      setIsRemoteMode(true);
    }

    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('smart_pague_menos_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      
      const savedSpeed = localStorage.getItem('smart_pague_menos_scroll_speed');
      if (savedSpeed) setScrollSpeed(parseInt(savedSpeed));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Salva no localStorage para sincronização entre abas
  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_scroll_speed', scrollSpeed.toString());
  }, [scrollSpeed]);

  const handleUserActivity = () => {
    if (isRemoteMode) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    if (isRemoteMode) return;
    handleUserActivity();
    return () => {
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    };
  }, [isRemoteMode]);

  const activeCategories = useMemo(() => {
    return CATEGORIES_CYCLE.filter(cat => {
      if (cat === Category.FRUTAS) return isHortifrutiEnabled;
      return true;
    });
  }, [isHortifrutiEnabled]);

  const currentCategory = activeCategories[currentCategoryIndex % activeCategories.length];
  
  const actualOffers = products.filter(p => p.isOffer);
  const categoryProducts = products.filter(p => p.category === currentCategory);
  const displayOffers = actualOffers.length > 0 ? actualOffers : categoryProducts;

  const handleResize = () => {
    if (isRemoteMode) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const baseW = isPortraitMode ? 1080 : 1920;
    const baseH = isPortraitMode ? 1920 : 1080;
    const visibleW = isPortraitMode ? baseH : baseW;
    const visibleH = isPortraitMode ? baseW : baseH;

    let targetScaleX = 1;
    let targetScaleY = 1;

    if (fitMode === 'stretch') {
      targetScaleX = windowWidth / visibleW;
      targetScaleY = windowHeight / visibleH;
    } else {
      const s = Math.min(windowWidth / visibleW, windowHeight / visibleH);
      targetScaleX = s;
      targetScaleY = s;
    }

    setScaleX(targetScaleX);
    setScaleY(targetScaleY);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rotation, isTvMode, fitMode, isRemoteMode]);

  useEffect(() => {
    if (isRemoteMode) return;
    const categoryTimer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, 20000);
    return () => clearInterval(categoryTimer);
  }, [activeCategories.length, isRemoteMode]);

  useEffect(() => {
    if (displayOffers.length === 0 || isRemoteMode) return;
    const offerTimer = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % displayOffers.length);
    }, 10000);
    return () => clearInterval(offerTimer);
  }, [displayOffers.length, isRemoteMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleGenerateOfferArt = async () => {
    const currentOffer = displayOffers[activeOfferIndex % displayOffers.length];
    if (!currentOffer || isGeneratingArt) return;

    setIsGeneratingArt(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let visualFocus = "";
      
      if (currentOffer.category === Category.FRUTAS) {
        visualFocus = "extremely juicy fruits, glistening with fresh dew, vibrant bursting colors, sweet and ripe appearance";
      } else if (currentOffer.category === Category.BEBIDAS) {
        visualFocus = "extremely cold beverage bottle/can, covered in ice crystals and condensation, frozen atmosphere, splashing cold water, refreshing blue lighting";
      } else {
        visualFocus = "succulent premium meat, rich marbling, glistening texture, fresh cut, deep red natural colors, gourmet presentation";
      }
      
      const prompt = `Hyper-realistic professional digital signage advertisement for ${currentOffer.name}. ${visualFocus}. Mouth-watering, appetizing, food-blog quality. Cinematic lighting, elegant background with subtle sparks, high resolution 8k, extremely detailed textures to trigger hunger. Luxury market style.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } },
      });

      let generatedImageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        setProducts(prev => prev.map(p => p.id === currentOffer.id ? { ...p, imageUrl: generatedImageUrl } : p));
      }
    } catch (error) {
      console.error('Art Generation Error:', error);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  if (isRemoteMode) {
    return (
      <RemoteControl 
        products={products} 
        scrollSpeed={scrollSpeed}
        onUpdateScrollSpeed={setScrollSpeed}
        onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
        onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
      />
    );
  }

  const finalScaleX = scaleX + zoomOffset;
  const finalScaleY = scaleY + zoomOffset;
  const baseWidth = isPortraitMode ? 1080 : 1920;
  const baseHeight = isPortraitMode ? 1920 : 1080;

  const appStyle = {
    width: `${baseWidth}px`,
    height: `${baseHeight}px`,
    transform: `translate(-50%, -50%) scale(${finalScaleX}, ${finalScaleY}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    '--primary-color': theme.primary,
    '--accent-color': theme.accent,
    '--bg-color': theme.background,
    '--text-color': theme.text,
    '--panel-color': theme.panel,
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    position: 'absolute',
    left: '50%',
    top: '50%',
  } as React.CSSProperties;

  return (
    <div 
      className={`h-screen w-screen bg-black overflow-hidden relative transition-all duration-500 ${isTvMode ? 'cursor-none' : ''}`}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div 
        ref={containerRef}
        style={appStyle}
        className={`flex flex-col shadow-[0_0_150px_rgba(0,0,0,1)] transition-all duration-700 ease-in-out ${isSpinning ? 'animate-spin-once' : ''}`}
      >
        <header className="h-32 flex items-center justify-between px-10 border-b border-white/10 shadow-2xl relative z-20" style={{ background: `linear-gradient(to r, var(--primary-color), var(--bg-color))` }}>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-red-600 opacity-30 blur-2xl rounded-full animate-pulse transition-all duration-700"></div>
              <div className="relative w-28 h-28 bg-red-600 rounded-full shadow-[0_15px_40px_rgba(220,38,38,0.5)] border-4 border-white flex items-center justify-center transform hover:scale-105 transition-transform overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 pointer-events-none"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative drop-shadow-lg">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-6xl font-black leading-none font-oswald tracking-tighter uppercase italic" style={{ color: 'var(--text-color)' }}>
                SMART <span style={{ color: 'var(--accent-color)' }}>PAGUE MENOS</span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="h-[2px] w-8" style={{ backgroundColor: 'var(--accent-color)' }}></span>
                <p className="text-xl font-bold tracking-[0.3em] uppercase font-oswald opacity-80" style={{ color: 'var(--text-color)' }}>
                  Açougue <span style={{ color: 'var(--accent-color)' }}>&</span> Hortifruti
                </p>
              </div>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden relative ${isPortraitMode ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: 'var(--bg-color)' }}>
          <div className={`${isPortraitMode ? 'w-full h-[45%]' : 'w-[50%] h-full'} flex flex-col transition-all duration-700 ease-in-out border-white/5 shadow-[20px_20px_50px_rgba(0,0,0,0.5)] z-10 ${isPortraitMode ? 'border-b' : 'border-r'}`}>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={scrollSpeed} />
          </div>
          
          <div className={`${isPortraitMode ? 'w-full h-[55%]' : 'w-[50%] h-full'} transition-all duration-700 ease-in-out relative overflow-hidden`}>
            {displayOffers.length > 0 && (
              <FeaturedOffer 
                offer={displayOffers[activeOfferIndex % displayOffers.length]} 
                isGenerating={isGeneratingArt}
                onGenerateArt={handleGenerateOfferArt}
                showControls={showControls}
              />
            )}
            
            <div className={`absolute top-6 right-6 flex items-center gap-4 transition-opacity duration-1000 ${isTvMode ? 'opacity-100' : 'opacity-0'}`}>
               <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,1)]"></div>
                    <span className="text-[10px] font-black text-white/90 tracking-widest uppercase">AO VIVO</span>
                  </div>
                  <div className="w-[1px] h-4 bg-white/20"></div>
                  <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">FHD 1080i</span>
               </div>
            </div>
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">
              OUTDOOR DIGITAL FABIO 99982690704
            </p>
          </div>
        </main>

        <footer className="h-14 bg-white flex items-center overflow-hidden z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
          <div className="flex whitespace-nowrap animate-scroll items-center gap-12 px-8">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <span className="font-black text-2xl uppercase tracking-widest flex items-center gap-4" style={{ color: 'var(--primary-color)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                  SMART PAGUE MENOS: ECONOMIA E QUALIDADE NO MESMO LUGAR
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                </span>
                <span className="text-black font-black text-2xl uppercase tracking-widest">
                  CARNES FRESCAS TODOS OS DIAS • ACEITAMOS TODOS OS CARTÕES • FRUTAS FRESCAS • CARVÃO • ARTIGOS PARA CHURRASCO •
                </span>
              </React.Fragment>
            ))}
          </div>
        </footer>
      </div>

      <div className={`fixed bottom-16 right-8 z-[200] flex flex-col gap-5 transition-all duration-500 ${showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
        <button 
          onClick={() => setRotation(prev => (prev + 90) % 360)} 
          className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white/40 hover:text-white border border-white/10 shadow-2xl transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 1 1-3-7.7L21 8"/></svg>
        </button>
        <button 
          onClick={toggleFullscreen} 
          className={`p-6 rounded-full border border-white/10 backdrop-blur-xl transition-all shadow-2xl ${isTvMode ? 'bg-red-600 text-white' : 'bg-white/10 text-white/40'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        </button>
        <button 
          onClick={() => setIsAdminOpen(true)} 
          className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white/40 hover:text-white border border-white/10 shadow-2xl transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      {isAdminOpen && (
        <AdminMenu 
          products={products} 
          theme={theme}
          isTvMode={isTvMode}
          zoomOffset={zoomOffset}
          fitMode={fitMode}
          scrollSpeed={scrollSpeed}
          onUpdateScrollSpeed={setScrollSpeed}
          onUpdateFitMode={setFitMode}
          onUpdateZoom={setZoomOffset}
          isHortifrutiEnabled={isHortifrutiEnabled}
          onToggleHortifruti={() => setIsHortifrutiEnabled(!isHortifrutiEnabled)}
          onToggleTvMode={toggleFullscreen}
          onUpdateTheme={setTheme}
          onClose={() => setIsAdminOpen(false)} 
          onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))}
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
          onBulkToggleOffers={(off) => setProducts(prev => prev.map(item => ({...item, isOffer: off})))}
          onAddProduct={(p) => setProducts(prev => [...prev, p])}
          onRotate90={() => setRotation(prev => (prev + 90) % 360)}
          onSpin360={() => { setIsSpinning(true); setTimeout(() => setIsSpinning(false), 1200); }}
          currentRotation={rotation}
          isSpinning={isSpinning}
        />
      )}
    </div>
  );
};

export default App;
