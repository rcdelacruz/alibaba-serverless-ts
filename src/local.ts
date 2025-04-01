// src/local.ts - Local development server for Alibaba Function Compute
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { hello, FCEvent, FCContext, FCResponse } from '../index';
import path from 'path';
import { mock, mockModule } from './local-helpers';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define custom error for TypeScript compatibility
interface CustomError extends Error {
  code?: number;
  requestId?: string;
}

// Mock product data for testing
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

// Mock OpenSearch responses
const mockOpenSearchResponse = (items: any[], total: number, page: number, pageSize: number) => {
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

// Create mock implementations
const createMockOpenSearchModule = () => {
  return {
    OpenSearchClient: mock.fn().mockImplementation(() => ({})),
    ProductSearchService: mock.fn().mockImplementation(() => ({
      searchProducts: mock.fn().mockImplementation((keyword: string, options: any) => {
        const page = options?.page || 1;
        const pageSize = options?.pageSize || 10;
        let filtered = [...mockProducts];
        
        if (keyword) {
          filtered = filtered.filter(p => 
            p.name.includes(keyword) || p.description.includes(keyword)
          );
        }
        
        if (options?.category) {
          filtered = filtered.filter(p => p.category === options.category);
        }
        
        if (options?.minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= options.minPrice!);
        }
        
        if (options?.maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= options.maxPrice!);
        }
        
        if (options?.inStock !== undefined) {
          filtered = filtered.filter(p => p.inStock === options.inStock);
        }
        
        return Promise.resolve(mockOpenSearchResponse(filtered, filtered.length, page, pageSize));
      }),
      getRecommendations: mock.fn().mockImplementation((productId: string, limit: number) => {
        const otherProducts = mockProducts.filter(p => p.id !== productId);
        const limitedResults = otherProducts.slice(0, limit || 5);
        return Promise.resolve(mockOpenSearchResponse(limitedResults, limitedResults.length, 1, limit || 5));
      }),
      getTrendingProducts: mock.fn().mockImplementation((limit: number) => {
        const sorted = [...mockProducts].sort((a, b) => b.rating - a.rating);
        const limitedResults = sorted.slice(0, limit || 10);
        return Promise.resolve(mockOpenSearchResponse(limitedResults, limitedResults.length, 1, limit || 10));
      }),
      searchByCategory: mock.fn().mockImplementation((category: string, options: any) => {
        const page = options?.page || 1;
        const pageSize = options?.pageSize || 10;
        const filtered = mockProducts.filter(p => p.category === category);
        return Promise.resolve(mockOpenSearchResponse(filtered, filtered.length, page, pageSize));
      })
    })),
    OpenSearchError: mock.fn().mockImplementation((message: string, code: number) => {
      const error = new Error(message) as CustomError;
      error.code = code;
      return error;
    })
  };
};

// Mock the OpenSearch module
const mockOpenSearchModule = createMockOpenSearchModule();

// Setup routes to simulate the function's paths
app.all('/foo', handleRequest);
app.all('/foo/recommendations', handleRequest);
app.all('/foo/trending', handleRequest);

// Handle all requests
function handleRequest(req: express.Request, res: express.Response) {
  try {
    // Create mock event object similar to Alibaba Function Compute's event
    const event: FCEvent = {
      path: req.path,
      httpMethod: req.method,
      headers: req.headers as Record<string, string>,
      queryParameters: req.query as Record<string, string>,
      pathParameters: {},
      body: JSON.stringify(req.body),
      isBase64Encoded: false
    };

    // Create mock context object
    const context: FCContext = {
      requestId: `local-${Date.now()}`,
      credentials: {
        accessKeyId: process.env.OPENSEARCH_ACCESS_KEY_ID || 'mock-key-id',
        accessKeySecret: process.env.OPENSEARCH_ACCESS_KEY_SECRET || 'mock-key-secret',
        securityToken: 'local-dev-token'
      },
      function: {
        name: 'hello',
        handler: 'index.hello',
        memory: 128,
        timeout: 60
      },
      service: {
        name: 'local-service',
        logProject: 'local-log-project',
        logStore: 'local-log-store',
        qualifier: 'LATEST',
        versionId: 'LATEST'
      },
      region: 'local-region',
      accountId: 'local-account'
    };

    // Ensure the require for './src/opensearch' returns our mock module
    // Monkey patch the require system
    const originalRequire = require;
    const mockedRequire = function(id: string) {
      if (id === './src/opensearch') {
        return mockOpenSearchModule;
      }
      return originalRequire(id);
    };
    
    // Replace the global require with our mocked version
    (global as any).require = mockedRequire;

    try {
      // Call the handler function with callback pattern
      hello(event, context, (err: Error | null, response: FCResponse) => {
        // Restore the original require
        (global as any).require = originalRequire;
        
        if (err) {
          console.error('Error in function execution:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        
        try {
          // Set headers from the response
          if (response.headers) {
            Object.entries(response.headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });
          }
          
          // Send the response
          const statusCode = response.statusCode || 200;
          const body = response.isBase64Encoded 
            ? Buffer.from(response.body, 'base64') 
            : response.body;
            
          res.status(statusCode).send(body);
        } catch (error) {
          console.error('Error sending response:', error);
          res.status(500).json({ error: 'Error processing response' });
        }
      });
    } catch (e) {
      // Restore the original require in case of error
      (global as any).require = originalRequire;
      throw e;
    }
    
  } catch (error) {
    console.error('Error calling handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local development server running at http://localhost:${PORT}`);
  console.log(`📝 Try these endpoints:`);
  console.log(`  - http://localhost:${PORT}/foo?keyword=smartphone`);
  console.log(`  - http://localhost:${PORT}/foo/recommendations?productId=1`);
  console.log(`  - http://localhost:${PORT}/foo/trending`);
  console.log(`  - http://localhost:${PORT}/foo?category=Electronics&minPrice=1000`);
});
