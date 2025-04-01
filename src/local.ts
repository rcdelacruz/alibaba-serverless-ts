// src/local.ts - Local development server
import express from 'express';
import bodyParser from 'body-parser';
import { handler } from './handlers/hello';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulate Alibaba Cloud Function environment
app.all('/hello', async (req, res) => {
  try {
    // Create mock event object similar to Alibaba Cloud Function's event
    const event = {
      path: req.path,
      httpMethod: req.method,
      headers: req.headers as Record<string, string>,
      queryParameters: req.query as Record<string, string>,
      pathParameters: {},
      body: JSON.stringify(req.body),
      isBase64Encoded: false
    };

    // Create mock context object
    const context = {
      requestId: `local-${Date.now()}`,
      credentials: {
        accessKeyId: 'local-dev-key-id',
        accessKeySecret: 'local-dev-key-secret',
        securityToken: 'local-dev-token'
      },
      function: {
        name: 'hello',
        handler: 'hello.handler',
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

    // Call the handler function
    const response = await handler(event, context);
    
    // Set headers from the response
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    // Send the response
    res.status(response.statusCode).send(
      response.isBase64Encoded 
        ? Buffer.from(response.body, 'base64') 
        : response.body
    );
    
  } catch (error) {
    console.error('Error calling handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local development server running at http://localhost:${PORT}`);
  console.log(`📝 Try: http://localhost:${PORT}/hello?name=Developer`);
});
