
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, MediaConfig, Category } from '../types';
import { INITIAL_PRODUCTS, CATEGORIES_CYCLE } from '../constants';

export const useBroadcastEngine = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('broadcast_v5_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [mediaConfig, setMediaConfig] = useState<MediaConfig>(() => {
    const saved = localStorage.getItem('broadcast_v5_config');
    return saved ? JSON.parse(saved) : {
      marqueeText: 'QUALIDADE E ECONOMIA SMART PAGUE MENOS • CORTES SELECIONADOS •',
      logoUrl: '',
      bgImageUrl: '',
      slideDuration: 18,
      listScrollSpeed: 45,
      isNodeMode: true,
      rotation: 0
    };
  });

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>(['SYSTEM: Kernel Loaded', 'VIDEO: UHD Output Active']);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 20));
  }, []);

  const currentCategory = useMemo(() => 
    CATEGORIES_CYCLE[currentCategoryIndex % CATEGORIES_CYCLE.length]
  , [currentCategoryIndex]);

  // Sincronização LocalStorage (Multi-aba/Mobile)
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === 'broadcast_v5_products' && e.newValue) setProducts(JSON.parse(e.newValue));
      if (e.key === 'broadcast_v5_config' && e.newValue) setMediaConfig(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Persistência
  useEffect(() => {
    localStorage.setItem('broadcast_v5_products', JSON.stringify(products));
    localStorage.setItem('broadcast_v5_config', JSON.stringify(mediaConfig));
  }, [products, mediaConfig]);

  // Ciclo Automático
  useEffect(() => {
    if (isAdminOpen) return;
    const timer = setInterval(() => {
      setCurrentCategoryIndex(prev => (prev + 1) % CATEGORIES_CYCLE.length);
    }, mediaConfig.slideDuration * 1000);
    return () => clearInterval(timer);
  }, [isAdminOpen, mediaConfig.slideDuration]);

  return {
    products, setProducts,
    mediaConfig, setMediaConfig,
    currentCategory,
    currentCategoryIndex, setCurrentCategoryIndex,
    isAdminOpen, setIsAdminOpen,
    logs, addLog
  };
};
