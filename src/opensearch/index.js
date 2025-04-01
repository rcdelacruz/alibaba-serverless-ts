/**
 * OpenSearch module exports for development and production
 * 
 * In development, it exports the mock implementation
 * In production, it would export the TypeScript-compiled classes
 */

// Use mock implementation for local development
const mockModule = require('./mock-data');

// Export all necessary components
module.exports = {
  OpenSearchClient: mockModule.OpenSearchClient,
  OpenSearchError: mockModule.OpenSearchError,
  ProductSearchService: mockModule.ProductSearchService,
  
  // Environment config helper (for compatibility with TypeScript version)
  createOpenSearchClientFromEnv: () => {
    return {
      OPENSEARCH_ACCESS_KEY_ID: process.env.OPENSEARCH_ACCESS_KEY_ID || 'mock-key-id',
      OPENSEARCH_ACCESS_KEY_SECRET: process.env.OPENSEARCH_ACCESS_KEY_SECRET || 'mock-key-secret',
      OPENSEARCH_HOST: process.env.OPENSEARCH_HOST || 'opensearch.ap-southeast-1.aliyuncs.com',
      OPENSEARCH_APP_NAME: process.env.OPENSEARCH_APP_NAME || 'mock-app'
    };
  }
};
