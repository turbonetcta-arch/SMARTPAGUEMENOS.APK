
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Bovinos
  { id: 'b1', name: 'CORAÇÃO BOVINO', price: 13.49, unit: 'kg', category: Category.BOVINOS },
  { id: 'b2', name: 'OSSADA BOVINA', price: 8.99, unit: 'kg', category: Category.BOVINOS },
  { id: 'b3', name: 'CARNE COM OSSO', price: 24.29, unit: 'kg', category: Category.BOVINOS },
  { id: 'b4', name: 'FÍGADO BOVINO', price: 18.49, unit: 'kg', category: Category.BOVINOS },
  { id: 'b5', name: 'PICANHA CONGELADA FRIBOI', price: 89.60, unit: 'kg', category: Category.BOVINOS, isOffer: true, offerPrice: 79.90 },
  { id: 'b10', name: 'COXÃO MOLE FRIBOI', price: 45.00, unit: 'kg', category: Category.BOVINOS },

  // Suinos
  { id: 's1', name: 'BISTECA SUÍNA', price: 18.99, unit: 'kg', category: Category.SUINOS },
  { id: 's2', name: 'COSTELA SUÍNA', price: 21.99, unit: 'kg', category: Category.SUINOS, isOffer: true, offerPrice: 19.90 },
  { id: 's6', name: 'LOMBO SUÍNO', price: 30.00, unit: 'kg', category: Category.SUINOS },

  // Aves
  { id: 'a1', name: 'COXA E SOBRECOXA', price: 13.49, unit: 'kg', category: Category.AVES },
  { id: 'a2', name: 'FILÉ DE PEITO', price: 24.30, unit: 'kg', category: Category.AVES },
  { id: 'a4', name: 'COXINHA DA ASA', price: 19.99, unit: 'kg', category: Category.AVES, isOffer: true, offerPrice: 17.50 },

  // Frutas (Antiga Bebidas)
  { id: 'f1', name: 'BANANA PRATA', price: 5.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'f2', name: 'MAÇÃ NACIONAL', price: 8.49, unit: 'kg', category: Category.FRUTAS, isOffer: true, offerPrice: 6.99 },
  { id: 'f3', name: 'LARANJA PERA', price: 4.50, unit: 'kg', category: Category.FRUTAS },
  { id: 'f4', name: 'MELANCIA', price: 2.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'f5', name: 'UVA SEM SEMENTE', price: 12.90, unit: 'kg', category: Category.FRUTAS },
];

export const CATEGORIES_CYCLE = [
  Category.BOVINOS,
  Category.SUINOS,
  Category.AVES,
  Category.FRUTAS
];
