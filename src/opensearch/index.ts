export * from './client';
export * from './repository';
export * from './productService';

// OpenSearch configuration
export interface OpenSearchEnvConfig {
  OPENSEARCH_ACCESS_KEY_ID: string;
  OPENSEARCH_ACCESS_KEY_SECRET: string;
  OPENSEARCH_HOST: string;
  OPENSEARCH_APP_NAME: string;
}

// Create OpenSearch client from environment variables
export function createOpenSearchClientFromEnv(): OpenSearchEnvConfig {
  const required = [
    'OPENSEARCH_ACCESS_KEY_ID',
    'OPENSEARCH_ACCESS_KEY_SECRET',
    'OPENSEARCH_HOST',
    'OPENSEARCH_APP_NAME'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return {
    OPENSEARCH_ACCESS_KEY_ID: process.env.OPENSEARCH_ACCESS_KEY_ID!,
    OPENSEARCH_ACCESS_KEY_SECRET: process.env.OPENSEARCH_ACCESS_KEY_SECRET!,
    OPENSEARCH_HOST: process.env.OPENSEARCH_HOST!,
    OPENSEARCH_APP_NAME: process.env.OPENSEARCH_APP_NAME!
  };
}
