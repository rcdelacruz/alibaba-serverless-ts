// src/local.ts - Local development server for Alibaba Function Compute
import express from 'express';
import bodyParser from 'body-parser';
import { hello, FCEvent, FCContext, FCResponse } from '../index';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulate Alibaba Function Compute environment
app.all('/foo', (req, res) => {
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
        accessKeyId: 'local-dev-key-id',
        accessKeySecret: 'local-dev-key-secret',
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

    // Call the handler function with callback pattern
    hello(event, context, (err: Error | null, response: FCResponse) => {
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
    
  } catch (error) {
    console.error('Error calling handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local development server running at http://localhost:${PORT}`);
  console.log(`📝 Try: http://localhost:${PORT}/foo?name=Developer`);
});
