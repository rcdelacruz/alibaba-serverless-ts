# Serverless Alibaba OpenSearch API

A serverless application that integrates with Alibaba Cloud OpenSearch using TypeScript. This project demonstrates how to build a product search and recommendation API using Alibaba Cloud Function Compute and OpenSearch.

## Features

- **Product Search**: Search for products using keywords, categories, price ranges, and other filters
- **Recommendations**: Get product recommendations based on related items
- **Trending Products**: Get trending products based on ratings and recency
- **Category Navigation**: Search products by category with faceted navigation
- **TypeScript Development**: Local development environment with TypeScript support
- **Serverless Deployment**: Easy deployment to Alibaba Cloud Function Compute

## Prerequisites

- Node.js (v10 or later)
- npm or yarn
- An Alibaba Cloud account
- Alibaba Cloud credentials configured
- An OpenSearch application set up in Alibaba Cloud

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

### 2. Configure Environment Variables

Copy the example environment file and update with your OpenSearch credentials:

```bash
cp .env.example .env
```

Then edit the `.env` file with your Alibaba Cloud OpenSearch credentials:

```ini
# OpenSearch credentials
OPENSEARCH_ACCESS_KEY_ID=your_access_key_id
OPENSEARCH_ACCESS_KEY_SECRET=your_access_key_secret
OPENSEARCH_HOST=opensearch.ap-southeast-1.aliyuncs.com
OPENSEARCH_APP_NAME=your_app_name

# Local development settings
PORT=3000
```

### 3. Configure Alibaba Cloud Credentials

Create a credentials file at `~/.aliyun_credentials` with:

```ini
[default]
aliyun_access_key_id=<your-access-key-id>
aliyun_access_key_secret=<your-access-key-secret>
aliyun_account_id=<your-account-id>
```

### 4. Local Development

Run the local development server:

```bash
npm run dev
```

This starts a local Express server that simulates the Alibaba Cloud Function Compute environment. You can test your OpenSearch API using these endpoints:

- Product Search: `http://localhost:3000/foo?keyword=smartphone`
- Recommendations: `http://localhost:3000/foo/recommendations?productId=1`
- Trending Products: `http://localhost:3000/foo/trending`
- Category Search: `http://localhost:3000/foo?category=Electronics&minPrice=1000`

### 5. Deployment

Build and deploy to Alibaba Cloud:

```bash
npm run build
npm run deploy:assisted
```

After deployment, you can access your API using the provided endpoints:

- Product Search: `https://<your-endpoint>/api/search?keyword=smartphone`
- Recommendations: `https://<your-endpoint>/api/search/recommendations?productId=1`
- Trending Products: `https://<your-endpoint>/api/search/trending`
- Category Search: `https://<your-endpoint>/api/search?category=Electronics&minPrice=1000`

## Project Structure

```
.
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── README.md           # Documentation
├── deploy.sh           # Deployment helper script
├── index.d.ts          # TypeScript definitions for index.js
├── index.js            # Main function handler
├── package.json        # Dependencies and scripts
├── serverless.yml      # Serverless configuration
├── tsconfig.json       # TypeScript configuration
└── src/
    ├── local.ts        # Local development server
    └── opensearch/     # OpenSearch implementation
        ├── client.ts   # OpenSearch client
        ├── index.ts    # OpenSearch module exports
        ├── productService.ts # Product search service
        └── repository.ts # Generic repository layer
```

## OpenSearch Integration

This project demonstrates how to use the Alibaba OpenSearch SDK in a TypeScript application with a structured architecture:

1. **Client Layer** (`src/opensearch/client.ts`): Low-level client to interact with the OpenSearch API
2. **Repository Layer** (`src/opensearch/repository.ts`): Generic repository pattern for handling search operations and error handling
3. **Service Layer** (`src/opensearch/productService.ts`): Domain-specific search services for products

The integration follows best practices for TypeScript development:

- Strong type checking with interfaces
- Error handling with custom error classes
- Clean separation of concerns
- Environment-based configuration

## Query Parameters

The API supports the following query parameters:

- `keyword` - Search term for product name and description
- `category` - Filter by product category
- `page` - Page number for pagination (default: 1)
- `pageSize` - Number of items per page (default: 10)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter by in-stock status (true/false)
- `sort` - Sort order (e.g., "price:asc", "rating:desc")

## Error Handling

The application includes comprehensive error handling:

- OpenSearch-specific errors with proper error codes
- Network and timeout errors
- Authentication errors
- Malformed query errors

## Troubleshooting

If you encounter issues:

1. **OpenSearch Credentials**: Make sure your OpenSearch credentials are correctly set in the `.env` file
2. **Alibaba Cloud Credentials**: Ensure your Alibaba Cloud credentials are properly configured
3. **Region Settings**: Confirm the region in `serverless.yml` matches your OpenSearch application region
4. **Memory Limits**: If you experience timeout issues, consider increasing the `memorySize` in `serverless.yml`

## Resources

- [Alibaba Cloud OpenSearch Documentation](https://www.alibabacloud.com/help/product/29102.htm)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs/)
- [Alibaba Cloud Function Compute Documentation](https://www.alibabacloud.com/help/product/50980.htm)
