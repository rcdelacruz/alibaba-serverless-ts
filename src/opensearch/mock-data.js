// Mock data and implementations for OpenSearch

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Smartphone XYZ',
    description: 'Latest smartphone with advanced features',
    category: 'Electronics',
    price: 799.99,
    rating: 4.5,
    inStock: true,
    tags: ['smartphone', 'android', 'highend'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-03-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Laptop Pro',
    description: 'Professional laptop for developers',
    category: 'Electronics',
    price: 1299.99,
    rating: 4.8,
    inStock: true,
    tags: ['laptop', 'development', 'highend'],
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-03-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    category: 'Audio',
    price: 249.99,
    rating: 4.2,
    inStock: true,
    tags: ['audio', 'wireless', 'headphones'],
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-03-05T00:00:00Z'
  }
];

// Mock OpenSearch response
const mockOpenSearchResponse = (items, total, page, pageSize) => {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    searchTime: 0.123,
    requestId: `mock-${Date.now()}`
  };
};

// Mock OpenSearch client
class OpenSearchClient {
  constructor(config) {
    this.config = config;
    console.log('Initialized mock OpenSearchClient with:', config);
  }
}

// Mock OpenSearch error
class OpenSearchError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'OpenSearchError';
    this.code = code;
    this.requestId = `mock-${Date.now()}`;
  }
}

// Mock product search service
class ProductSearchService {
  constructor(client) {
    this.client = client;
    console.log('Initialized mock ProductSearchService');
  }

  async searchProducts(keyword, options = {}) {
    console.log('Mock searchProducts called with:', { keyword, options });
    
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    let filtered = [...mockProducts];
    
    if (keyword) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase()) || 
        p.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    if (options.category) {
      filtered = filtered.filter(p => p.category === options.category);
    }
    
    if (options.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= options.minPrice);
    }
    
    if (options.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= options.maxPrice);
    }
    
    if (options.inStock !== undefined) {
      filtered = filtered.filter(p => p.inStock === options.inStock);
    }
    
    return mockOpenSearchResponse(filtered, filtered.length, page, pageSize);
  }

  async getRecommendations(productId, limit = 5) {
    console.log('Mock getRecommendations called with:', { productId, limit });
    
    const otherProducts = mockProducts.filter(p => p.id !== productId);
    const limitedResults = otherProducts.slice(0, limit);
    
    return mockOpenSearchResponse(limitedResults, limitedResults.length, 1, limit);
  }

  async getTrendingProducts(limit = 10) {
    console.log('Mock getTrendingProducts called with:', { limit });
    
    const sorted = [...mockProducts].sort((a, b) => b.rating - a.rating);
    const limitedResults = sorted.slice(0, limit);
    
    return mockOpenSearchResponse(limitedResults, limitedResults.length, 1, limit);
  }

  async searchByCategory(category, options = {}) {
    console.log('Mock searchByCategory called with:', { category, options });
    
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const filtered = mockProducts.filter(p => p.category === category);
    
    return mockOpenSearchResponse(filtered, filtered.length, page, pageSize);
  }
}

module.exports = {
  OpenSearchClient,
  OpenSearchError,
  ProductSearchService
};
