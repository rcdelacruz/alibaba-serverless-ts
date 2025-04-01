# Serverless Alibaba Cloud Functions Hello World

A simple, minimal example for Alibaba Cloud Functions using the Serverless Framework.

## Prerequisites

- Node.js (v10 or later)
- npm or yarn
- An Alibaba Cloud account
- Alibaba Cloud credentials configured

## Issues & Solutions

This project has been configured to work around known issues with the `serverless-aliyun-function-compute` plugin:

1. **Plugin not found in npm registry**: The official plugin `serverless-aliyun-function-compute` is no longer available in the npm registry with the version numbers often referenced in documentation (2.x or 3.x). This project installs the plugin directly from GitHub.

2. **Credentials path format**: The serverless.yml uses `~/.aliyun_credentials` for credentials path, which should be properly formatted (see below).

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/rcdelacruz/alibaba-serverless-ts.git
cd alibaba-serverless-ts

# Install the dependencies 
npm install

# Install the Alibaba Cloud plugin directly from GitHub
npm run install-plugin
```

### 2. Configure your Alibaba Cloud credentials

Create a credentials file at `~/.aliyun_credentials` (note the underscore instead of slash) with the following format:

```ini
[default]
aliyun_access_key_id=<your-access-key-id>
aliyun_access_key_secret=<your-access-key-secret>
aliyun_account_id=<your-account-id>
```

Important: Make sure this is an absolute path to your home directory.

### 3. Local Development

#### Simple JavaScript Testing

You can test your function locally without deploying:

```bash
node -e "console.log(require('./index').hello({}, {requestId: 'local-test'}, (err, res) => console.log(res)))"
```

#### TypeScript Development Server

This project includes a TypeScript development server that simulates the Alibaba Cloud Function Compute environment:

```bash
# Start the development server with hot-reloading
npm run dev
```

The server will start at http://localhost:3000, and you can test your function by visiting:
http://localhost:3000/foo?name=YourName

Any changes to the TypeScript files will automatically restart the server.

### 4. Deploy to Alibaba Cloud

```bash
npm run deploy
```

## Project Structure

```
.
├── serverless.yml   # Serverless Framework configuration
├── package.json     # Project dependencies
├── index.js         # Function handler (JavaScript)
├── tsconfig.json    # TypeScript configuration
└── src/
    └── local.ts     # Local development server
```

## Function Code

The function code is simple, responding to HTTP GET requests with a JSON payload:

```javascript
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Hello from Alibaba Cloud Functions!',
      input: event,
      requestId: context.requestId,
      timestamp: new Date().toISOString()
    }),
    isBase64Encoded: false
  };

  callback(null, response);
};
```

## Troubleshooting

If you encounter issues:

1. **Credentials not found**: Make sure your credentials file is properly formatted and placed at `~/.aliyun_credentials` (with underscore).

2. **Plugin not found**: Make sure you've run `npm run install-plugin` to install the plugin directly from GitHub.

3. **Region errors**: You may need to add a `region` field to the `provider` section in serverless.yml if you're getting region-related errors.

4. **TypeScript development server issues**: If you're having problems running the local TypeScript server, make sure you've installed all dependencies with `npm install`.

## Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Alibaba Cloud Function Compute Documentation](https://www.alibabacloud.com/help/product/50980.htm)
- [GitHub Repository for the plugin](https://github.com/aliyun/serverless-aliyun-function-compute)
