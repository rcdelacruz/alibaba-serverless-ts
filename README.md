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

## Deployment to Alibaba Cloud

### Step 1: Prepare for Deployment

Before deploying, make sure:

1. You have installed the plugin:
   ```bash
   npm run install-plugin
   ```

2. Your credentials file is properly set up at `~/.aliyun_credentials`

3. You have an active Alibaba Cloud account with Function Compute service enabled

### Step 2: Deploy the Function

```bash
npm run deploy
```

This command will:
1. Package your code according to the specifications in `serverless.yml`
2. Create necessary resources in Alibaba Cloud (service, function, trigger)
3. Upload your code to Alibaba Cloud Function Compute
4. Set up the HTTP trigger

### Step 3: Access Your Function

After successful deployment, the Serverless Framework will output the endpoint URL:

```
Service Information
service: serverless-aliyun-hello-world
stage: dev
region: cn-shanghai
stack: serverless-aliyun-hello-world-dev
api gateway:
  URL: https://<api-gateway-id>.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/serverless-aliyun-hello-world/hello/foo
functions:
  hello: serverless-aliyun-hello-world-hello
```

You can now access your function using this URL:
```
https://<api-gateway-id>.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/serverless-aliyun-hello-world/hello/foo?name=YourName
```

### Step 4: Update Your Function

After making changes to your function code:

1. Test locally first:
   ```bash
   npm run dev
   ```

2. When satisfied, deploy the changes:
   ```bash
   npm run deploy
   ```

### Step 5: Remove Your Function

If you want to remove the deployed function and associated resources:

```bash
npx serverless remove
```

This will clean up all resources created by the Serverless Framework.

## Troubleshooting Deployment

### Common Issues

1. **Region not available**: 
   - In `serverless.yml`, change the region to one that's available in your account (e.g., `cn-shanghai`, `cn-hangzhou`, `cn-beijing`)

2. **Permission denied**:
   - Make sure your access key has proper permissions for Function Compute, RAM, and API Gateway services
   - You might need to add these permissions in the Alibaba Cloud console

3. **Deployment timeout**:
   - The first deployment might take longer due to resource creation
   - Try running the deployment again

4. **Cannot find credentials**:
   - Double-check that your `~/.aliyun_credentials` file has the correct format and is in your home directory
   - Use absolute path if needed

5. **Plugin installation issues**:
   - If installing from GitHub fails, try:
     ```bash
     npm install --save-dev github:aliyun/serverless-aliyun-function-compute
     ```

### Debug Logs

For more detailed logs during deployment:

```bash
SLS_DEBUG=* npm run deploy
```

This will show you exactly what's happening during the deployment process.

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

## Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Alibaba Cloud Function Compute Documentation](https://www.alibabacloud.com/help/product/50980.htm)
- [GitHub Repository for the plugin](https://github.com/aliyun/serverless-aliyun-function-compute)
