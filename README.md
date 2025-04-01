# Serverless Alibaba Cloud Functions with TypeScript

This is a sample project demonstrating how to use the Serverless Framework with TypeScript to deploy functions to Alibaba Cloud Function Compute.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- An Alibaba Cloud account
- Alibaba Cloud CLI configured with your credentials

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure your Alibaba Cloud credentials:

Create a credentials file at `~/.aliyun/credentials` with the following format:

```ini
[default]
aliyun_access_key_id=<your-access-key-id>
aliyun_access_key_secret=<your-access-key-secret>
aliyun_account_id=<your-account-id>
```

Alternatively, you can set environment variables:

```bash
export ALICLOUD_ACCESS_KEY=<your-access-key-id>
export ALICLOUD_SECRET_KEY=<your-access-key-secret>
export ALICLOUD_ACCOUNT_ID=<your-account-id>
```

3. Build the TypeScript code:

```bash
npm run build
```

4. Deploy to Alibaba Cloud:

```bash
serverless deploy
```

## Project Structure

```
.
├── serverless.yml        # Serverless Framework configuration
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── src/
    └── handlers/
        └── hello.ts     # Function handler
```

## Testing

After deployment, you can test your function using:

```bash
# Get the endpoint URL from the deploy output
curl https://<your-endpoint-url>/hello?name=YourName
```

Expected response:

```json
{
  "message": "Hello, YourName!",
  "timestamp": "2025-04-01T12:34:56.789Z",
  "requestId": "abc123..."
}
```

## Additional Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Alibaba Cloud Function Compute Documentation](https://www.alibabacloud.com/help/product/50980.htm)
- [serverless-aliyun-function-compute Plugin](https://github.com/aliyun/serverless-aliyun-function-compute)
