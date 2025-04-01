import { OpenSearchClient, OpenSearchQuery, OpenSearchResponse, OpenSearchError } from './client';

/**
 * Base model interface for search results
 */
export interface SearchResultItem {
  id: string;
  [key: string]: any;
}

/**
 * Search result response with pagination
 */
export interface SearchResult<T extends SearchResultItem> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  searchTime: number;
  requestId: string;
}

/**
 * Search options interface
 */
export interface SearchOptions {
  page?: number;
  pageSize?: number;
  sort?: string;
  filter?: string;
  distinct?: string;
  aggregate?: string;
}

/**
 * Repository for OpenSearch operations
 */
export class OpenSearchRepository<T extends SearchResultItem> {
  private client: OpenSearchClient;
  
  constructor(client: OpenSearchClient) {
    this.client = client;
  }

  /**
   * Execute a search query and transform the results
   */
  async search(
    queryString: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> {
    try {
      const page = options.page || 1;
      const pageSize = options.pageSize || 10;
      
      const query: OpenSearchQuery = {
        query: queryString,
        start: (page - 1) * pageSize,
        hits: pageSize,
        format: 'fulljson'
      };
      
      // Add optional parameters if provided
      if (options.sort) query.sort = options.sort;
      if (options.filter) query.filter = options.filter;
      if (options.distinct) query.distinct = options.distinct;
      if (options.aggregate) query.aggregate = options.aggregate;
      
      const response = await this.client.search(query);
      
      return this.transformResponse(response, page, pageSize);
    } catch (error) {
      this.handleError(error);
      // This line will never execute, but TypeScript needs it for type safety
      throw new Error('Unexpected execution flow');
    }
  }

  /**
   * Transform OpenSearch response to a domain model
   */
  private transformResponse(
    response: OpenSearchResponse,
    page: number,
    pageSize: number
  ): SearchResult<T> {
    const { result, request_id } = response;
    
    return {
      items: result.items as T[],
      total: result.total,
      page,
      pageSize,
      totalPages: Math.ceil(result.total / pageSize),
      searchTime: result.searchtime,
      requestId: request_id
    };
  }

  /**
   * Handle common error scenarios with clear logs and exceptions
   */
  private handleError(error: any): never {
    // Log the error details
    console.error('[OpenSearch Error]', error);
    
    if (error instanceof OpenSearchError) {
      // Rethrow OpenSearch-specific errors
      throw error;
    }
    
    // Handle other types of errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      throw new OpenSearchError('OpenSearch request timed out', 408);
    }
    
    if (error.code === 'ENOTFOUND') {
      throw new OpenSearchError('OpenSearch service not found', 503);
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new OpenSearchError('Connection to OpenSearch refused', 503);
    }
    
    // Generic error
    throw new OpenSearchError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500
    );
  }
}
