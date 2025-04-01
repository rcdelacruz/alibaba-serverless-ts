// Type definitions for index.js

// Event interface for Alibaba Cloud Function Compute
export interface FCEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryParameters: Record<string, string>;
  pathParameters?: Record<string, string>;
  body: string;
  isBase64Encoded: boolean;
}

// Context interface for Alibaba Cloud Function Compute
export interface FCContext {
  requestId: string;
  credentials: {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
  };
  function: {
    name: string;
    handler: string;
    memory: number;
    timeout: number;
  };
  service: {
    name: string;
    logProject: string;
    logStore: string;
    qualifier: string;
    versionId: string;
  };
  region: string;
  accountId: string;
}

// Response interface for Alibaba Cloud Function Compute
export interface FCResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  isBase64Encoded: boolean;
}

// Callback type
export type FCCallback = (error: Error | null, response: FCResponse) => void;

// Product Search Params
export interface ProductSearchParams {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: string;
}

// Function to initialize OpenSearch client
export function initializeOpenSearch(credentials: FCContext['credentials']): any;

// Function to parse query parameters
export function parseQueryParams(event: FCEvent): ProductSearchParams;

// Function to format error response
export function formatErrorResponse(error: any): FCResponse;

// Hello function type
export function hello(event: FCEvent, context: FCContext, callback: FCCallback): void;
