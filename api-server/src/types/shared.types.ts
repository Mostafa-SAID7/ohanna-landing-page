/**
 * Shared types used across multiple domains
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search parameters
 */
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

/**
 * Base entity with timestamps
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: {
    message: string;
    statusCode: number;
    details?: any;
  };
}