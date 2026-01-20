
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // Bovinos Premium - Curadoria Especial
  { id: 'B001', name: 'PICANHA ANGUS SELECIONADA', price: 98.90, unit: 'kg', category: Category.BOVINOS, isOffer: true, offerPrice: 89.90, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200' },
  { id: 'B002', name: 'MAMINHA GRILL PRIME', price: 48.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'B003', name: 'CONTRA FILÉ EXTRA SELEÇÃO', price: 54.90, unit: 'kg', category: Category.BOVINOS, isOffer: true, offerPrice: 49.99, imageUrl: 'https://images.unsplash.com/photo-1558030006-45c675171f23?auto=format&fit=crop&q=80&w=1200' },
  { id: 'B004', name: 'ACÉM SEM OSSO ESPECIAL', price: 28.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'B005', name: 'COSTELA JANELA RIO', price: 34.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'B006', name: 'FRALDINHA LIMPA PREMIUM', price: 42.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'B007', name: 'COXÃO MOLE EXTRA', price: 45.90, unit: 'kg', category: Category.BOVINOS },
  { id: 'B008', name: 'PATINHO SELECIONADO', price: 39.90, unit: 'kg', category: Category.BOVINOS },

  // Suínos Seleção
  { id: 'S001', name: 'LINGUIÇA ARTESANAL CUIABANA', price: 24.90, unit: 'kg', category: Category.SUINOS, isOffer: true, offerPrice: 19.99, imageUrl: 'https://images.unsplash.com/photo-1593030103066-01bb30370d6b?auto=format&fit=crop&q=80&w=1200' },
  { id: 'S002', name: 'BISTECA SUÍNA PREMIUM', price: 18.90, unit: 'kg', category: Category.SUINOS },
  { id: 'S003', name: 'PANCETA TEMPERADA GRILL', price: 29.90, unit: 'kg', category: Category.SUINOS },
  { id: 'S004', name: 'COSTELINHA BBQ PRIME', price: 32.90, unit: 'kg', category: Category.SUINOS },

  // Aves da Granja
  { id: 'A001', name: 'FILÉ DE FRANGO EXTRA LIMPO', price: 24.90, unit: 'kg', category: Category.AVES },
  { id: 'A002', name: 'COXINHA DA ASA TEMPERADA', price: 18.90, unit: 'kg', category: Category.AVES, isOffer: true, offerPrice: 15.99, imageUrl: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=1200' },
  { id: 'A003', name: 'SOBRECOXA SEM OSSO', price: 22.90, unit: 'kg', category: Category.AVES },
  { id: 'A004', name: 'FRANGO INTEIRO SELECIONADO', price: 12.90, unit: 'kg', category: Category.AVES },

  // Hortifruti Direto do Produtor
  { id: 'H001', name: 'BANANA PRATA DO VALE', price: 6.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'H002', name: 'TOMATE SELECIONADO TIPO A', price: 8.99, unit: 'kg', category: Category.FRUTAS, isOffer: true, offerPrice: 5.99, imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=1200' },
  { id: 'H003', name: 'LARANJA PÊRA DOCE', price: 4.99, unit: 'kg', category: Category.FRUTAS },
  { id: 'H004', name: 'BATATA LAVADA ESPECIAL', price: 5.49, unit: 'kg', category: Category.FRUTAS },

  // Bebidas Geladas - Cold Filter
  { id: 'D001', name: 'CERVEJA HEINEKEN LONG NECK', price: 6.99, unit: 'un', category: Category.BEBIDAS, isOffer: true, offerPrice: 5.49, imageUrl: 'https://images.unsplash.com/photo-1618885472179-5e4aa4ca79dd?auto=format&fit=crop&q=80&w=1200' },
  { id: 'D002', name: 'COCA-COLA ORIGINAL 2L', price: 11.99, unit: 'un', category: Category.BEBIDAS },
  { id: 'D003', name: 'RED BULL ENERGY DRINK', price: 9.90, unit: 'un', category: Category.BEBIDAS, isOffer: true, offerPrice: 7.99 },
  { id: 'D004', name: 'VINHO TINTO RESERVA DOC', price: 45.90, unit: 'un', category: Category.BEBIDAS },
];

export const CATEGORIES_CYCLE = [
  Category.BOVINOS,
  Category.SUINOS,
  Category.AVES,
  Category.FRUTAS,
  Category.BEBIDAS
];
