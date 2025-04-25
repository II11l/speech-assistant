# Deployment Guide - Environment Setup

This guide explains how to set up environment variables for the Wedding Speech Assistant application.

## Local Development

For local development, create a `.env` file in the project root with the following variables:

```
# Claude API credentials
CLAUDE_API_KEY=your_claude_api_key_here

# API configuration
CLAUDE_MODEL=claude-3-sonnet-20240229
```

**Important**: Never commit the `.env` file to version control. It is included in `.gitignore` to prevent accidental commits.

## Netlify Deployment

When deploying to Netlify, you need to set up environment variables in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment variables
3. Add the following environment variables:
   - Key: `CLAUDE_API_KEY`, Value: your Claude API key
   - Key: `CLAUDE_MODEL`, Value: `claude-3-sonnet-20240229` (or your preferred model)

### Securing API Keys

Netlify environment variables are secure and encrypted. They are:
- Not exposed in the client-side code
- Available to serverless functions
- Isolated between different deployment contexts (production, staging, etc.)

## Verifying Environment Variables

After deployment, verify that environment variables are correctly set by checking the logs of serverless functions (under Functions > Functions overview > Logs in the Netlify dashboard).

## Rotating API Keys

When rotating API keys for security purposes:
1. Generate a new API key from the Claude dashboard
2. Update the environment variable in Netlify
3. Deploy the site to apply the changes

The serverless functions will automatically use the new API key without requiring code changes. 