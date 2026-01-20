
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Bovinos Premium
  { id: 'b1', name: 'PICANHA ANGUS SELECIONADA', price: 98.90, unit: 'kg', category: Category.BOVINOS, isOffer: true, offerPrice: 89.90, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800' },
  { id: 'b2', name: 'MAMINHA GRILL', price: 48.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'b3', name: 'CONTRA FILÉ EXTRA', price: 54.90, unit: 'kg', category: Category.BOVINOS, isOffer: true, offerPrice: 49.99 },
  { id: 'b4', name: 'ACÉM SEM OSSO', price: 28.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'b5', name: 'COSTELA JANELA RIO', price: 34.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'b6', name: 'FRALDINHA LIMPA', price: 42.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'b7', name: 'COXÃO MOLE', price: 45.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'b8', name: 'PATINHO SELECIONADO', price: 39.90, unit: 'kg', category: Category.BOVINOS },

  // Suínos
  { id: 's1', name: 'LINGUIÇA ARTESANAL', price: 24.90, unit: 'kg', category: Category.SUINOS, isOffer: true, offerPrice: 19.99 },
  { id: 's2', name: 'BISTECA SUÍNA PREMIUM', price: 18.90, unit: 'kg', category: Category.SUINOS },
  { id: 's3', name: 'PANCETA TEMPERADA', price: 29.90, unit: 'kg', category: Category.SUINOS },
  { id: 's4', name: 'COSTELINHA BBQ', price: 32.90, unit: 'kg', category: Category.SUINOS },

  // Aves
  { id: 'a1', name: 'FILÉ DE FRANGO', price: 24.90, unit: 'kg', category: Category.AVES },
  { id: 'a2', name: 'COXINHA DA ASA', price: 18.90, unit: 'kg', category: Category.AVES, isOffer: true, offerPrice: 15.99 },
  { id: 'a3', name: 'SOBRECOXA SEM OSSO', price: 22.90, unit: 'kg', category: Category.AVES },
  { id: 'a4', name: 'FRANGO INTEIRO', price: 12.90, unit: 'kg', category: Category.AVES },

  // Hortifruti
  { id: 'h1', name: 'BANANA PRATA DO VALE', price: 6.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'h2', name: 'TOMATE SELECIONADO', price: 8.99, unit: 'kg', category: Category.FRUTAS, isOffer: true, offerPrice: 5.99 },
  { id: 'h3', name: 'LARANJA PÊRA DOCE', price: 4.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'h4', name: 'BATATA LAVADA', price: 5.49, unit: 'kg', category: Category.FRUTAS },

  // Bebidas
  { id: 'd1', name: 'CERVEJA HEINEKEN 330ML', price: 6.99, unit: 'un', category: Category.BEBIDAS, isOffer: true, offerPrice: 5.49 },
  { id: 'd2', name: 'COCA-COLA 2L', price: 11.99, unit: 'un', category: Category.BEBIDAS },
  { id: 'd3', name: 'RED BULL 250ML', price: 9.90, unit: 'un', category: Category.BEBIDAS, isOffer: true, offerPrice: 7.99 },
  { id: 'd4', name: 'VINHO TINTO RESERVA', price: 45.90, unit: 'un', category: Category.BEBIDAS },
];

export const CATEGORIES_CYCLE = [
  Category.BOVINOS,
  Category.SUINOS,
  Category.AVES,
  Category.FRUTAS,
  Category.BEBIDAS
];
