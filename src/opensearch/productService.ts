import { OpenSearchClient } from './client';
import { OpenSearchRepository, SearchResultItem, SearchOptions, SearchResult } from './repository';

/**
 * Product model for OpenSearch results
 */
export interface Product extends SearchResultItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Product search options
 */
export interface ProductSearchOptions extends SearchOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Service for product search operations
 */
export class ProductSearchService {
  private repository: OpenSearchRepository<Product>;
  
  constructor(client: OpenSearchClient) {
    this.repository = new OpenSearchRepository<Product>(client);
  }
  
  /**
   * Search for products
   */
  async searchProducts(
    keyword: string,
    options: ProductSearchOptions = {}
  ): Promise<SearchResult<Product>> {
    try {
      // Build query string with keyword
      let queryString = keyword ? `name:'${keyword}' OR description:'${keyword}'` : '*';
      
      // Add filters
      const filters: string[] = [];
      
      if (options.category) {
        filters.push(`category:'${options.category}'`);
      }
      
      if (options.minPrice !== undefined) {
        filters.push(`price>=${options.minPrice}`);
      }
      
      if (options.maxPrice !== undefined) {
        filters.push(`price<=${options.maxPrice}`);
      }
      
      if (options.inStock !== undefined) {
        filters.push(`inStock:${options.inStock}`);
      }
      
      // Apply filters to query if any exist
      if (filters.length > 0) {
        options.filter = filters.join(' AND ');
      }
      
      // Set default sort if not provided
      if (!options.sort) {
        options.sort = 'rating:desc';
      }
      
      // Execute search
      return await this.repository.search(queryString, options);
    } catch (error) {
      console.error('[ProductSearchService] Error searching products:', error);
      throw error;
    }
  }
  
  /**
   * Get product recommendations based on category and tags
   */
  async getRecommendations(
    productId: string,
    limit: number = 5
  ): Promise<SearchResult<Product>> {
    try {
      // This is a simplified example - in a real application you would:
      // 1. First fetch the product details based on ID
      // 2. Use the product's category and tags to find similar products
      
      // For demonstration, we'll use a simple query
      const queryString = `id:!${productId}`; // Exclude the current product
      
      const options: SearchOptions = {
        pageSize: limit,
        sort: 'rating:desc'
      };
      
      return await this.repository.search(queryString, options);
    } catch (error) {
      console.error('[ProductSearchService] Error getting recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Get trending products based on recent updates and high ratings
   */
  async getTrendingProducts(
    limit: number = 10
  ): Promise<SearchResult<Product>> {
    try {
      // This would typically use a combination of recency and popularity
      const queryString = 'rating>=4';
      
      const options: SearchOptions = {
        pageSize: limit,
        sort: 'updatedAt:desc' // Most recently updated first
      };
      
      return await this.repository.search(queryString, options);
    } catch (error) {
      console.error('[ProductSearchService] Error getting trending products:', error);
      throw error;
    }
  }
  
  /**
   * Search products by category with faceted navigation
   */
  async searchByCategory(
    category: string,
    options: ProductSearchOptions = {}
  ): Promise<SearchResult<Product>> {
    try {
      const queryString = `category:'${category}'`;
      
      // Add aggregation to get tag counts
      options.aggregate = 'tags:count()';
      
      return await this.repository.search(queryString, options);
    } catch (error) {
      console.error('[ProductSearchService] Error searching by category:', error);
      throw error;
    }
  }
}
