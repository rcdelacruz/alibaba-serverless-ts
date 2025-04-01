// src/handlers/hello.ts

// Define interface for the event parameter from Alibaba Cloud Functions
interface FCEvent {
  path: string;
  httpMethod: string;
  headers: { [key: string]: string };
  queryParameters: { [key: string]: string };
  pathParameters: { [key: string]: string };
  body: string;
  isBase64Encoded: boolean;
}

// Define interface for the context parameter
interface FCContext {
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

// Define the response type
interface FCResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
  isBase64Encoded: boolean;
}

// Main handler function
export const handler = async (
  event: FCEvent,
  context: FCContext
): Promise<FCResponse> => {
  
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));
  
  // Extract query parameters if any
  const name = event.queryParameters?.name || 'World';
  
  // Process based on HTTP method
  let responseBody: any;
  
  if (event.httpMethod === 'GET') {
    responseBody = {
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
      requestId: context.requestId
    };
  } else {
    responseBody = {
      message: `Method ${event.httpMethod} not supported`,
      timestamp: new Date().toISOString()
    };
  }
  
  // Return formatted response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(responseBody),
    isBase64Encoded: false
  };
};