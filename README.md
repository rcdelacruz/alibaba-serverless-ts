# Serverless Alibaba Cloud Functions Hello World

This is a simple Hello World example for Alibaba Cloud Functions using the Serverless Framework.

## Prerequisites

- Node.js (v8 or later)
- npm or yarn
- An Alibaba Cloud account
- Alibaba Cloud CLI configured with your credentials

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure your Alibaba Cloud credentials:

Create a credentials file at `~/.aliyun_credentials` with the following format:

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

## Local Testing

You can test your function locally without deploying:

```bash
node -e "console.log(require('./index').hello({}, {requestId: 'local-test'}, (err, res) => console.log(res)))"
```

## Deployment

Deploy to Alibaba Cloud:

```bash
npm run deploy
```

Or directly:

```bash
serverless deploy
```

## Project Structure

```
.
├── serverless.yml   # Serverless Framework configuration
├── package.json     # Project dependencies
└── index.js         # Function handler
```

## Testing

After deployment, you can test your function using:

```bash
# Get the endpoint URL from the deploy output
curl https://<your-endpoint-url>/foo
```

Expected response:

```json
{
  "message": "Hello from Alibaba Cloud Functions!",
  "input": {...},
  "requestId": "abc123...",
  "timestamp": "2025-04-01T12:34:56.789Z"
}
```

## Additional Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Alibaba Cloud Function Compute Documentation](https://www.alibabacloud.com/help/product/50980.htm)
- [serverless-aliyun-function-compute Plugin](https://github.com/aliyun/serverless-aliyun-function-compute)
