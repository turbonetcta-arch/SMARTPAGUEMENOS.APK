
export enum Category {
  BOVINOS = 'BOVINOS',
  SUINOS = 'SUÍNOS',
  AVES = 'AVES',
  FRUTAS = 'HORTIFRUTI',
  BEBIDAS = 'BEBIDAS GELADAS',
  ESPECIAIS = 'CORTES ESPECIAIS'
}

export interface ThemeSettings {
  primary: string;
  accent: string;
  background: string;
  text: string;
  panel: string;
}

export interface MediaConfig {
  marqueeText: string;
  logoUrl: string;
  bgImageUrl: string;
  slideDuration: number;
  listScrollSpeed: number;
  isNodeMode: boolean; 
  rotation: number; // Persistência da rotação 360
}

export interface Partner {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: Category;
  isOffer?: boolean;
  offerPrice?: number;
  imageUrl?: string;
}
