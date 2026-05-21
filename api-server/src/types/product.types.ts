/**
 * Product-related type definitions
 */

import type { BaseEntity } from './shared.types';

/**
 * Product category enum
 */
export type ProductCategory = 
  | 'dresses' 
  | 'tops' 
  | 'bottoms' 
  | 'accessories' 
  | 'shoes' 
  | 'bags';

/**
 * Product badge types
 */
export type ProductBadge = 
  | 'new' 
  | 'sale' 
  | 'bestseller' 
  | 'limited' 
  | 'exclusive';

/**
 * Product size options
 */
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

/**
 * Product color options
 */
export interface ProductColor {
  name: string;
  hex: string;
}

/**
 * Product image structure
 */
export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

/**
 * Product API response
 */
export interface ProductResponse extends BaseEntity {
  name: string;
  description: string;
  price: number; // in cents (EGP)
  category: ProductCategory;
  badge?: ProductBadge;
  imageUrl: string;
  images?: ProductImage[];
  stock: number;
  slug?: string;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  tags?: string[];
  isActive: boolean;
}

/**
 * Product list response
 */
export interface ProductsListResponse {
  products: ProductResponse[];
}

/**
 * Product search filters
 */
export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sizes?: ProductSize[];
  colors?: string[];
  badges?: ProductBadge[];
  inStock?: boolean;
}

/**
 * Product search request
 */
export interface ProductSearchRequest {
  query?: string;
  filters?: ProductFilters;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product creation request
 */
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  badge?: ProductBadge;
  imageUrl: string;
  images?: ProductImage[];
  stock: number;
  slug?: string;
  sizes?: ProductSize[];
  colors?: ProductColor[];
  tags?: string[];
}

/**
 * Product update request
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
}