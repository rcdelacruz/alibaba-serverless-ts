'use strict';

// Import OpenSearch from local build (will be compiled from TypeScript)
const opensearch = require('./src/opensearch');

// Initialize OpenSearch client
function initializeOpenSearch(credentials) {
  try {
    const client = new opensearch.OpenSearchClient({
      accessKeyId: credentials.accessKeyId || process.env.OPENSEARCH_ACCESS_KEY_ID,
      accessKeySecret: credentials.accessKeySecret || process.env.OPENSEARCH_ACCESS_KEY_SECRET,
      host: process.env.OPENSEARCH_HOST || 'opensearch.ap-southeast-1.aliyuncs.com',
      appName: process.env.OPENSEARCH_APP_NAME || 'your-app-name',
      apiVersion: 'v2'
    });
    
    // Initialize the product search service
    return new opensearch.ProductSearchService(client);
  } catch (error) {
    console.error('Failed to initialize OpenSearch:', error);
    throw error;
  }
}

// Parse query parameters
function parseQueryParams(event) {
  const queryParams = event.queryParameters || {};
  
  return {
    keyword: queryParams.keyword || '',
    category: queryParams.category,
    page: parseInt(queryParams.page, 10) || 1,
    pageSize: parseInt(queryParams.pageSize, 10) || 10,
    minPrice: queryParams.minPrice ? parseFloat(queryParams.minPrice) : undefined,
    maxPrice: queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : undefined,
    inStock: queryParams.inStock ? queryParams.inStock === 'true' : undefined,
    sort: queryParams.sort || undefined
  };
}

// Format error response
function formatErrorResponse(error) {
  return {
    statusCode: error.code || 500,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      error: {
        message: error.message || 'An unexpected error occurred',
        code: error.code || 500,
        requestId: error.requestId
      }
    }),
    isBase64Encoded: false
  };
}

// Main handler function
module.exports.hello = async (event, context, callback) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Initialize the product search service
    const productService = initializeOpenSearch(context.credentials);
    
    // Parse query parameters
    const params = parseQueryParams(event);
    
    // Determine the operation based on path or query parameters
    let result;
    const path = event.path || '';
    
    if (path.includes('/recommendations')) {
      const productId = event.pathParameters?.productId || params.productId;
      if (!productId) {
        throw new opensearch.OpenSearchError('Product ID is required', 400);
      }
      result = await productService.getRecommendations(productId, params.pageSize);
    } 
    else if (path.includes('/trending')) {
      result = await productService.getTrendingProducts(params.pageSize);
    } 
    else if (params.category && !params.keyword) {
      result = await productService.searchByCategory(params.category, params);
    } 
    else {
      result = await productService.searchProducts(params.keyword, params);
    }
    
    // Return successful response
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: result,
        timestamp: new Date().toISOString(),
        requestId: context.requestId
      }),
      isBase64Encoded: false
    };
    
    callback(null, response);
  } catch (error) {
    console.error('Error processing request:', error);
    callback(null, formatErrorResponse(error));
  }
};
