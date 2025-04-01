import * as https from 'https';
import * as crypto from 'crypto';
import * as querystring from 'querystring';

/**
 * Alibaba OpenSearch client configuration
 */
export interface OpenSearchConfig {
  accessKeyId: string;
  accessKeySecret: string;
  host: string;
  appName: string;
  apiVersion?: string;
  timeout?: number;
}

/**
 * OpenSearch query parameters
 */
export interface OpenSearchQuery {
  query: string;
  format?: 'json' | 'xml' | 'fulljson';
  start?: number;
  hits?: number;
  sort?: string;
  filter?: string;
  distinct?: string;
  aggregate?: string;
  disable?: string;
  [key: string]: any;
}

/**
 * OpenSearch response format
 */
export interface OpenSearchResponse {
  status: string;
  request_id: string;
  result: {
    searchtime: number;
    total: number;
    num: number;
    viewtotal: number;
    items: any[];
    facet?: any[];
    aggregate?: any;
  };
  errors?: Array<{
    code: number;
    message: string;
  }>;
}

/**
 * Error class for OpenSearch errors
 */
export class OpenSearchError extends Error {
  readonly code: number;
  readonly requestId?: string;

  constructor(message: string, code: number, requestId?: string) {
    super(message);
    this.name = 'OpenSearchError';
    this.code = code;
    this.requestId = requestId;
  }
}

/**
 * Client for interacting with Alibaba OpenSearch
 */
export class OpenSearchClient {
  private config: OpenSearchConfig;

  constructor(config: OpenSearchConfig) {
    this.config = {
      apiVersion: 'v2',
      timeout: 10000,
      ...config
    };
  }

  /**
   * Execute a search query against OpenSearch
   */
  async search(query: OpenSearchQuery): Promise<OpenSearchResponse> {
    try {
      const params: any = {
        format: 'fulljson',
        ...query
      };

      const response = await this.request('/search', params);
      
      if (response.status === 'OK') {
        return response;
      } else {
        const error = response.errors?.[0];
        throw new OpenSearchError(
          error?.message || 'Unknown OpenSearch error',
          error?.code || 500,
          response.request_id
        );
      }
    } catch (error) {
      if (error instanceof OpenSearchError) {
        throw error;
      }

      throw new OpenSearchError(
        error instanceof Error ? error.message : 'Unknown error',
        500
      );
    }
  }

  /**
   * Execute a request to the OpenSearch API
   */
  private async request(path: string, params: any): Promise<any> {
    const date = new Date().toUTCString();
    const contentType = 'application/x-www-form-urlencoded';
    
    // Prepare parameters
    const allParams = {
      ...params,
      app_name: this.config.appName,
      version: this.config.apiVersion
    };
    
    const content = querystring.stringify(allParams);
    
    // Create signature
    const stringToSign = `POST\n${contentType}\n${content}\nx-opensearch-nonce:${date}\n${path}`;
    const signature = crypto
      .createHmac('sha1', this.config.accessKeySecret)
      .update(stringToSign)
      .digest('base64');
    
    // Set up request options
    const options = {
      hostname: this.config.host,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(content),
        'X-Opensearch-Nonce': date,
        Authorization: `OPENSEARCH ${this.config.accessKeyId}:${signature}`
      },
      timeout: this.config.timeout
    };

    // Execute the request
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const data = JSON.parse(responseData);
            resolve(data);
          } catch (error) {
            reject(new OpenSearchError(
              `Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`,
              500
            ));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(new OpenSearchError(`Request failed: ${error.message}`, 500));
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new OpenSearchError('Request timed out', 408));
      });
      
      req.write(content);
      req.end();
    });
  }
}
