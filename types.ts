export type ProductCategory = 'panini-del-mese' | 'hamburger' | 'american-sandwich' | 'sandwich-maiale' | 'sandwich-pollo' | 'veggy' | 'kids-junior' | 'chips' | 'starter' | 'box' | 'dolci' | 'salse' | 'drink';

export interface ProductVariant {
  name: string;
  price: number;
}

export interface Product {
  id: number;
  name:string;
  price: number;
  menuPrice?: number;
  description: string;
  image: string;
  category: ProductCategory;
  ingredients?: string[];
  isDrink?: boolean;
  galleryImages?: string[];
  imagePosition?: string;
  imageFit?: 'cover' | 'contain';
  variants?: ProductVariant[];
}

export type CartItemVariant = 'panino' | 'menu';

export interface Extra {
  name: string;
  price: number;
}

export interface SelectedExtra {
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // Unique identifier for each cart item instance
  product: Product;
  quantity: number;
  notes: string;
  variant: CartItemVariant;
  
  // Customizations
  removedIngredients: string[];
  addedExtras: SelectedExtra[];
  
  // For 'menu' variant
  selectedDrink?: Product;
  selectedFrySauces?: string[];

  // Calculated price for this specific configured item
  finalPrice: number;
}