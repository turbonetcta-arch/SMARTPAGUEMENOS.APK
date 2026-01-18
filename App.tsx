
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Category, Product, ThemeSettings, Partner } from './types';
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
  
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('smart_pague_menos_partners');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', name: 'Friboi', imageUrl: 'https://seeklogo.com/images/F/friboi-logo-4E1564C79F-seeklogo.com.png' },
      { id: 'p2', name: 'Sadia', imageUrl: 'https://seeklogo.com/images/S/sadia-logo-66107D3A63-seeklogo.com.png' },
      { id: 'p3', name: 'Perdigão', imageUrl: 'https://seeklogo.com/images/P/perdigao-logo-A353086588-seeklogo.com.png' },
      { id: 'p4', name: 'Seara', imageUrl: 'https://seeklogo.com/images/S/seara-logo-B11776378A-seeklogo.com.png' }
    ];
  });

  const [isPartnersEnabled, setIsPartnersEnabled] = useState(() => {
    const saved = localStorage.getItem('smart_pague_menos_partners_enabled');
    return saved ? saved === 'true' : true;
  });

  const [partnerNameSize, setPartnerNameSize] = useState(() => {
    const saved = localStorage.getItem('smart_pague_menos_partner_size');
    return saved ? parseInt(saved) : 70;
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
  
  const [theme, setTheme] = useState<ThemeSettings>({
    primary: '#b91c1c',
    accent: '#facc15',
    background: '#09090b',
    text: '#ffffff',
    panel: 'rgba(24, 24, 27, 0.8)'
  });

  const [isTvMode, setIsTvMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [fitMode, setFitMode] = useState<'contain' | 'stretch'>('stretch');
  const [zoomOffset, setZoomOffset] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const isPortraitMode = rotation === 90 || rotation === 270;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('remote') === 'true') setIsRemoteMode(true);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsTvMode(true);
    }

    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('smart_pague_menos_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      
      const savedSpeed = localStorage.getItem('smart_pague_menos_scroll_speed');
      if (savedSpeed) setScrollSpeed(parseInt(savedSpeed));

      const savedPartners = localStorage.getItem('smart_pague_menos_partners');
      if (savedPartners) setPartners(JSON.parse(savedPartners));

      const savedPartnersEnabled = localStorage.getItem('smart_pague_menos_partners_enabled');
      if (savedPartnersEnabled) setIsPartnersEnabled(savedPartnersEnabled === 'true');

      const savedSize = localStorage.getItem('smart_pague_menos_partner_size');
      if (savedSize) setPartnerNameSize(parseInt(savedSize));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_scroll_speed', scrollSpeed.toString());
  }, [scrollSpeed]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_partners_enabled', isPartnersEnabled.toString());
  }, [isPartnersEnabled]);

  useEffect(() => {
    localStorage.setItem('smart_pague_menos_partner_size', partnerNameSize.toString());
  }, [partnerNameSize]);

  const handleUserActivity = () => {
    if (isRemoteMode) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    if (isRemoteMode) return;
    handleUserActivity();
    return () => { if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current); };
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
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const contentW = isPortraitMode ? 1080 : 1920;
    const contentH = isPortraitMode ? 1920 : 1080;
    const projectedW = isPortraitMode ? contentH : contentW;
    const projectedH = isPortraitMode ? contentW : contentH;

    let targetSX = 1;
    let targetSY = 1;
    const effectiveFit = isTvMode ? 'stretch' : fitMode;

    if (effectiveFit === 'stretch') {
      targetSX = winW / projectedW;
      targetSY = winH / projectedH;
    } else {
      const s = Math.min(winW / projectedW, winH / projectedH);
      targetSX = s;
      targetSY = s;
    }
    setScaleX(targetSX);
    setScaleY(targetSY);
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
      document.documentElement.requestFullscreen().then(() => setIsTvMode(true)).catch(() => setIsTvMode(true));
    } else {
      document.exitFullscreen().then(() => setIsTvMode(false));
    }
  };

  const handleGenerateOfferArt = async () => {
    const currentOffer = displayOffers[activeOfferIndex % displayOffers.length];
    if (!currentOffer || isGeneratingArt) return;

    setIsGeneratingArt(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let visualFocus = currentOffer.category === Category.FRUTAS 
        ? "extremely juicy fruits, glistening with fresh dew, vibrant bursting colors" 
        : "succulent premium meat, rich marbling, glistening texture, gourmet presentation";
      
      const prompt = `Hyper-realistic professional digital signage advertisement for ${currentOffer.name}. ${visualFocus}. Cinematic lighting, luxury market style, 8k detail.`;
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
      if (generatedImageUrl) setProducts(prev => prev.map(p => p.id === currentOffer.id ? { ...p, imageUrl: generatedImageUrl } : p));
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
        isPartnersEnabled={isPartnersEnabled}
        onTogglePartners={() => setIsPartnersEnabled(!isPartnersEnabled)}
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
    borderRadius: isTvMode ? '0' : '2rem',
    boxShadow: isTvMode ? 'none' : '0 0 100px rgba(0,0,0,0.5)',
  } as React.CSSProperties;

  return (
    <div className={`h-screen w-screen bg-black overflow-hidden relative transition-all duration-500 ${isTvMode ? 'cursor-none' : ''}`} onMouseMove={handleUserActivity}>
      <div ref={containerRef} style={appStyle} className={`flex flex-col overflow-hidden transition-all duration-700 ease-in-out ${isSpinning ? 'animate-spin-once' : ''}`}>
        <header className="h-32 flex items-center justify-between px-10 border-b border-white/10 relative z-20" style={{ background: `linear-gradient(to r, var(--primary-color), var(--bg-color))` }}>
          <div className="flex items-center gap-8">
            <div className="relative w-28 h-28 bg-red-600 rounded-full border-4 border-white flex items-center justify-center shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-6xl font-black leading-none font-oswald tracking-tighter uppercase italic" style={{ color: 'var(--text-color)' }}>SMART <span style={{ color: 'var(--accent-color)' }}>PAGUE MENOS</span></h1>
              <p className="text-xl font-bold tracking-[0.3em] uppercase font-oswald opacity-80" style={{ color: 'var(--text-color)' }}>Açougue & Hortifruti</p>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden relative ${isPortraitMode ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: 'var(--bg-color)' }}>
          <div className={`${isPortraitMode ? 'w-full h-[45%]' : 'w-[50%] h-full'} flex flex-col transition-all duration-700 ease-in-out border-white/5 border-r z-10`}>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={scrollSpeed} />
          </div>
          <div className={`${isPortraitMode ? 'w-full h-[55%]' : 'w-[50%] h-full'} relative overflow-hidden`}>
            {displayOffers.length > 0 && (
              <FeaturedOffer 
                offer={displayOffers[activeOfferIndex % displayOffers.length]} 
                isGenerating={isGeneratingArt} 
                onGenerateArt={handleGenerateOfferArt} 
                showControls={showControls} 
                isPartnersEnabled={isPartnersEnabled}
              />
            )}
            <div className={`absolute top-6 right-6 flex items-center gap-4 transition-opacity duration-1000 ${isTvMode ? 'opacity-100' : 'opacity-0'}`}>
               <div className="bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,1)]"></div><span className="text-[10px] font-black text-white/90 uppercase tracking-widest">AO VIVO</span></div>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">FHD 1080p</span>
               </div>
            </div>
          </div>
        </main>

        {isPartnersEnabled && partners.length > 0 && (
          <div className="h-32 bg-black border-t border-white/10 flex items-center overflow-hidden z-20">
            <div className="flex whitespace-nowrap animate-scroll items-center gap-32 px-12">
              {[1, 2, 3, 4].map((group) => (
                <React.Fragment key={group}>
                  {partners.map((partner) => (
                    <div key={`${partner.id}-${group}`} className="flex items-center gap-10 group/partner">
                      <div className="h-24 w-auto flex items-center justify-center p-3 bg-white rounded-3xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <img src={partner.imageUrl} alt={partner.name} className="h-full w-auto object-contain" />
                      </div>
                      <span 
                        className="text-white font-black uppercase tracking-tighter drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]"
                        style={{ fontSize: `${partnerNameSize}px` }}
                      >
                        {partner.name}
                      </span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <footer className="h-14 bg-white flex items-center overflow-hidden z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
          <div className="flex whitespace-nowrap animate-scroll items-center gap-12 px-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <React.Fragment key={i}>
                <span className="font-black text-2xl uppercase tracking-widest flex items-center gap-4" style={{ color: 'var(--primary-color)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--primary-color)' }}></span>
                  SMART PAGUE MENOS: ECONOMIA E QUALIDADE NO MESMO LUGAR
                </span>
                <span className="text-black font-black text-2xl uppercase tracking-widest">
                  CARNES FRESCAS TODOS OS DIAS • ACEITAMOS TODOS OS CARTÕES • FRUTAS FRESCAS • CARVÃO •
                </span>
              </React.Fragment>
            ))}
          </div>
        </footer>
      </div>

      <div className={`fixed bottom-16 right-8 z-[200] flex flex-col gap-5 transition-all duration-500 ${showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
        <button onClick={() => setRotation(prev => (prev + 90) % 360)} className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white border border-white/10 shadow-2xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 1 1-3-7.7L21 8"/></svg></button>
        <button onClick={toggleFullscreen} className={`p-6 rounded-full border border-white/10 backdrop-blur-xl transition-all shadow-2xl ${isTvMode ? 'bg-red-600 text-white' : 'bg-white/10 text-white/40'}`}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg></button>
        <button onClick={() => setIsAdminOpen(true)} className="p-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white/40 hover:text-white border border-white/10 shadow-2xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>
      </div>

      {isAdminOpen && (
        <AdminMenu 
          products={products} 
          theme={theme} 
          isTvMode={isTvMode} 
          zoomOffset={zoomOffset} 
          fitMode={fitMode} 
          scrollSpeed={scrollSpeed} 
          partners={partners} 
          isPartnersEnabled={isPartnersEnabled} 
          partnerNameSize={partnerNameSize}
          onUpdatePartnerNameSize={setPartnerNameSize}
          onUpdatePartners={setPartners} 
          onTogglePartners={() => setIsPartnersEnabled(!isPartnersEnabled)} 
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
