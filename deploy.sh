#!/bin/bash

# Exit on error
set -e

echo "=== Alibaba Serverless Function Deployment Helper ==="
echo "This script will help you prepare and deploy your function to Alibaba Cloud."
echo ""

# Check if plugin is installed
if [ ! -d "node_modules/serverless-aliyun-function-compute" ]; then
  echo "Plugin not found. Installing serverless-aliyun-function-compute..."
  npm run install-plugin
  echo "Plugin installed successfully."
else
  echo "Plugin already installed. ✅"
fi

# Check for credentials file
CREDENTIALS_FILE="${HOME}/.aliyun_credentials"
if [ ! -f "$CREDENTIALS_FILE" ]; then
  echo "⚠️ WARNING: Credentials file not found at ${CREDENTIALS_FILE}"
  echo "  You need to create this file with your Alibaba Cloud credentials."
  echo "  Format:"
  echo "  [default]"
  echo "  aliyun_access_key_id=<your-access-key-id>"
  echo "  aliyun_access_key_secret=<your-access-key-secret>"
  echo "  aliyun_account_id=<your-account-id>"
  
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment aborted."
    exit 1
  fi
else
  echo "Credentials file found. ✅"
  # Check for required fields in credentials file
  if ! grep -q "aliyun_access_key_id" "$CREDENTIALS_FILE" || \
     ! grep -q "aliyun_access_key_secret" "$CREDENTIALS_FILE" || \
     ! grep -q "aliyun_account_id" "$CREDENTIALS_FILE"; then
    echo "⚠️ WARNING: Credentials file may be missing required fields."
    echo "  Please ensure it contains all required credentials."
  fi
fi

# Check serverless.yml
if [ ! -f "serverless.yml" ]; then
  echo "❌ ERROR: serverless.yml not found. Deployment cannot proceed."
  exit 1
else
  echo "serverless.yml found. ✅"
fi

# Check index.js
if [ ! -f "index.js" ]; then
  echo "❌ ERROR: index.js not found. Deployment cannot proceed."
  exit 1
else
  echo "index.js found. ✅"
fi

echo ""
echo "=== Deployment Information ==="
echo "Service: $(grep -m 1 "service:" serverless.yml | awk '{print $2}')"
echo "Runtime: $(grep -m 1 "runtime:" serverless.yml | awk '{print $2}')"
echo "Region: $(grep -m 1 "region:" serverless.yml | awk '{print $2}')"
echo "Function: $(grep -m 1 "handler:" serverless.yml | awk '{print $2}')"
echo ""

read -p "Ready to deploy? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Deployment aborted."
  exit 0
fi

echo ""
echo "=== Starting deployment ==="
echo "Running: npm run deploy"
npm run deploy

echo ""
echo "=== Deployment complete ==="
echo "Your function should now be available in the Alibaba Cloud console."
echo "And accessible via the URL printed above."
echo ""
echo "If you encounter any issues, please refer to the troubleshooting section in README.md."
