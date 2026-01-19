
export enum Category {
  BOVINOS = 'BOVINOS',
  SUINOS = 'SUÍNOS',
  AVES = 'AVES',
  FRUTAS = 'FRUTAS',
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

export interface AppState {
  currentCategory: Category;
  products: Product[];
  activeOfferIndex: number;
}
