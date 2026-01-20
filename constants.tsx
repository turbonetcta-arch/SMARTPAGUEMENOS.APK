
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

  // Aves
  { id: 'a1', name: 'COXA E SOBRECOXA', price: 13.49, unit: 'kg', category: Category.AVES },
  { id: 'a2', name: 'FILÉ DE PEITO', price: 24.30, unit: 'kg', category: Category.AVES },
  { id: 'a4', name: 'COXINHA DA ASA', price: 19.99, unit: 'kg', category: Category.AVES, isOffer: true, offerPrice: 17.50 },

  // Frutas
  { id: 'f1', name: 'BANANA PRATA', price: 5.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'f2', name: 'MAÇÃ NACIONAL', price: 8.49, unit: 'kg', category: Category.FRUTAS, isOffer: true, offerPrice: 6.99 },
  { id: 'f4', name: 'MELANCIA', price: 2.99, unit: 'kg', category: Category.FRUTAS },

  // Bebidas Geladas
  { id: 'd1', name: 'COCA-COLA 2L', price: 11.99, unit: 'un', category: Category.BEBIDAS },
  { id: 'd2', name: 'CERVEJA HEINEKEN 330ML', price: 6.49, unit: 'un', category: Category.BEBIDAS, isOffer: true, offerPrice: 5.89 },
  { id: 'd3', name: 'SUCO DEL VALLE 1L', price: 7.99, unit: 'un', category: Category.BEBIDAS },
  { id: 'd4', name: 'ÁGUA MINERAL 500ML', price: 2.50, unit: 'un', category: Category.BEBIDAS },
  { id: 'd5', name: 'ENERGÉTICO MONSTER', price: 9.90, unit: 'un', category: Category.BEBIDAS, isOffer: true, offerPrice: 8.50 },
];

export const CATEGORIES_CYCLE = [
  Category.BOVINOS,
  Category.SUINOS,
  Category.AVES,
  Category.FRUTAS,
  Category.BEBIDAS
];
