
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

  const [scrollSpeed, setScrollSpeed] = useState(() => {
    const saved = localStorage.getItem('smart_pague_menos_scroll_speed');
    return saved ? parseInt(saved) : 30;
  });

  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHortifrutiEnabled, setIsHortifrutiEnabled] = useState(true);
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [aiError, setAiError] = useState<string | null>(null);
  
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
    if (params.get('remote') === 'true' || params.get('mode') === 'remote') {
      setIsRemoteMode(true);
    }

    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('smart_pague_menos_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      
      const savedSpeed = localStorage.getItem('smart_pague_menos_scroll_speed');
      if (savedSpeed) setScrollSpeed(parseInt(savedSpeed));

      const savedTheme = localStorage.getItem('smart_pague_menos_theme');
      if (savedTheme) setTheme(JSON.parse(savedTheme));
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
    localStorage.setItem('smart_pague_menos_theme', JSON.stringify(theme));
  }, [theme]);

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

    let targetSX = winW / projectedW;
    let targetSY = winH / projectedH;
    
    if (fitMode === 'contain') {
      const s = Math.min(targetSX, targetSY);
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
  }, [rotation, fitMode, isRemoteMode]);

  useEffect(() => {
    if (isRemoteMode) return;
    const categoryTimer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % activeCategories.length);
    }, 15000);
    return () => clearInterval(categoryTimer);
  }, [activeCategories.length, isRemoteMode]);

  useEffect(() => {
    if (displayOffers.length === 0 || isRemoteMode) return;
    const offerTimer = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % displayOffers.length);
    }, 10000);
    return () => clearInterval(offerTimer);
  }, [displayOffers.length, isRemoteMode]);

  const handleGenerateArt = async (product: Product, style: 'photo' | 'ad' = 'ad') => {
    if (generatingIds.has(product.id)) return;
    setGeneratingIds(prev => new Set(prev).add(product.id));
    setAiError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = style === 'ad' 
        ? `Ultra-premium commercial advertisement for ${product.name}. Cinematic lighting, professional food styling, gourmet presentation, high contrast, 8k resolution. NO TEXT ON IMAGE.`
        : `Professional studio photography of ${product.name}, soft lighting, clean minimalist background, 8k resolution.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
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
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageUrl: generatedImageUrl } : p));
      } else {
        throw new Error("No image generated");
      }
    } catch (error: any) {
      console.error('Art Generation Error:', error);
      if (error?.message?.includes('429') || error?.status === 429) {
        setAiError("Limite de IA esgotado. Tente novamente em alguns minutos.");
      } else {
        setAiError("Erro ao gerar imagem. Tente novamente.");
      }
      setTimeout(() => setAiError(null), 5000);
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }
  };

  const currentOffer = displayOffers[activeOfferIndex % displayOffers.length];

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

  const appStyle = {
    width: `${isPortraitMode ? 1080 : 1920}px`,
    height: `${isPortraitMode ? 1920 : 1080}px`,
    transform: `translate(-50%, -50%) scale(${scaleX + zoomOffset}, ${scaleY + zoomOffset}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    '--primary-color': theme.primary,
    '--accent-color': theme.accent,
    '--bg-color': theme.background,
    '--text-color': theme.text,
    '--panel-color': theme.panel,
    '--base-scale': scaleX + zoomOffset,
    '--base-rotation': `${rotation}deg`,
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    position: 'absolute',
    left: '50%',
    top: '50%',
  } as React.CSSProperties;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative" onMouseMove={handleUserActivity}>
      {aiError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] bg-red-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl animate-bounce">
          {aiError}
        </div>
      )}

      <div ref={containerRef} style={appStyle} className={`flex flex-col overflow-hidden transition-all duration-700 ${isSpinning ? 'animate-spin-once' : ''}`}>
        <header className="h-32 flex items-center justify-between px-12 border-b border-white/10 relative z-20 shadow-2xl" style={{ backgroundColor: 'var(--primary-color)' }}>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-black/10">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-6xl font-black font-oswald tracking-tighter uppercase italic leading-none">
                SMART <span style={{ color: 'var(--accent-color)' }}>PAGUE MENOS</span>
              </h1>
              <p className="text-xl font-bold tracking-[0.4em] uppercase opacity-80 mt-1">Sua melhor escolha digital</p>
            </div>
          </div>
          <DigitalClock />
        </header>

        <main className={`flex-1 flex overflow-hidden ${isPortraitMode ? 'flex-col' : 'flex-row'}`}>
          <div className={`${isPortraitMode ? 'w-full h-1/2' : 'w-1/2 h-full'} border-r border-white/5`}>
            <PriceList products={products} currentCategory={currentCategory} scrollSpeed={scrollSpeed} />
          </div>
          <div className={`${isPortraitMode ? 'w-full h-1/2' : 'w-1/2 h-full'} relative`}>
            {currentOffer && (
              <FeaturedOffer 
                offer={currentOffer} 
                isGenerating={generatingIds.has(currentOffer.id)} 
                onGenerateArt={() => handleGenerateArt(currentOffer, 'ad')} 
                showControls={showControls} 
              />
            )}
          </div>
        </main>

        {isPartnersEnabled && (
          <div className="h-28 bg-black/50 border-t border-white/10 flex items-center overflow-hidden z-20">
             <div className="flex whitespace-nowrap animate-scroll items-center gap-24 px-12">
                {[1, 2, 3].map(group => (
                  <React.Fragment key={group}>
                    {partners.map(p => (
                      <div key={`${p.id}-${group}`} className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                        <img src={p.imageUrl} className="h-16 w-auto object-contain" alt={p.name} />
                        <span className="text-3xl font-black uppercase font-oswald text-white/40">{p.name}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
             </div>
          </div>
        )}

        <footer className="h-12 bg-white flex items-center overflow-hidden z-30 shadow-2xl">
           <div className="flex whitespace-nowrap animate-scroll items-center gap-10 px-8">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="text-black font-black text-xl uppercase tracking-widest italic flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  SMART PAGUE MENOS: ECONOMIA REAL TODOS OS DIAS • CARNES SELECIONADAS • HORTIFRUTI FRESCO • QUALIDADE PREMIUM • ACEITAMOS TODOS OS CARTÕES
                </span>
              ))}
           </div>
        </footer>
      </div>

      <div className={`fixed bottom-16 right-10 z-[100] flex flex-col gap-4 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button onClick={() => setRotation(prev => (prev + 90) % 360)} className="p-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white border border-white/10 shadow-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 2v6h-6"/><path d="M21 13a9 9 0 1 1-3-7.7L21 8"/></svg>
        </button>
        <button onClick={() => setIsAdminOpen(true)} className="p-5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white border border-white/10 shadow-2xl">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>

      {isAdminOpen && (
        <AdminMenu 
          products={products}
          partners={partners}
          onUpdatePartners={setPartners}
          theme={theme}
          isTvMode={isTvMode}
          zoomOffset={zoomOffset}
          fitMode={fitMode}
          onUpdateFitMode={setFitMode}
          onUpdateZoom={setZoomOffset}
          isHortifrutiEnabled={isHortifrutiEnabled}
          onToggleHortifruti={() => setIsHortifrutiEnabled(!isHortifrutiEnabled)}
          onToggleTvMode={() => setIsTvMode(!isTvMode)}
          onUpdateTheme={setTheme}
          onClose={() => setIsAdminOpen(false)}
          onUpdatePrice={(id, p) => setProducts(prev => prev.map(item => item.id === id ? {...item, price: p} : item))}
          onUpdateImage={(id, img) => setProducts(prev => prev.map(item => item.id === id ? {...item, imageUrl: img} : item))}
          onToggleOffer={(id) => setProducts(prev => prev.map(item => item.id === id ? {...item, isOffer: !item.isOffer} : item))}
          onBulkToggleOffers={(isOffer) => setProducts(prev => prev.map(item => ({...item, isOffer})))}
          onAddProduct={(p) => setProducts(prev => [...prev, p])}
          onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
          onRotate90={() => setRotation(prev => (prev + 90) % 360)}
          onSpin360={() => { setIsSpinning(true); setTimeout(() => setIsSpinning(false), 1200); }}
          currentRotation={rotation}
          isSpinning={isSpinning}
          onManualGenerateArt={handleGenerateArt}
          generatingIds={generatingIds}
          scrollSpeed={scrollSpeed}
          onUpdateScrollSpeed={setScrollSpeed}
          isPartnersEnabled={isPartnersEnabled}
          onTogglePartners={() => setIsPartnersEnabled(!isPartnersEnabled)}
        />
      )}
    </div>
  );
};

export default App;
