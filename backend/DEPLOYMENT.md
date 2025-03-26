# Deployment Guide for Reword This Backend

This guide covers how to deploy the backend server for the "Reword This" Chrome extension to different hosting platforms.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Your OpenAI API key
- Your Chrome extension ID (for CORS configuration)

## Local Deployment (Development)

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

## Deployment Options

### 1. Vercel (Recommended for Simplicity)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in the Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ALLOWED_ORIGINS`: Your Chrome extension ID (e.g., `chrome-extension://your-extension-id`)
   - `DEFAULT_MODEL`: Your preferred model (e.g., `gpt-3.5-turbo`)
   - `MAX_TOKENS`: Maximum tokens limit (e.g., `1000`)

### 2. Render

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Select the backend directory
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add the environment variables (same as above)

### 3. Railway

1. Create a new project on Railway
2. Connect to your GitHub repository
3. Configure the environment variables
4. Deploy

### 4. Heroku

1. Install Heroku CLI and login
2. Create a new Heroku app
3. Deploy using Git:
   ```bash
   git subtree push --prefix backend heroku main
   ```
4. Set environment variables using Heroku CLI or dashboard:
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set ALLOWED_ORIGINS=chrome-extension://your-extension-id
   ```

## After Deployment

1. Update your Chrome extension's `.env` file with the production backend URL:
   ```
   VITE_API_ENDPOINT=https://your-backend-url.com
   ```

2. Update the Content Security Policy in your extension's manifest.json to include your backend domain:
   ```json
   "content_security_policy": {
     "extension_pages": "script-src 'self'; object-src 'self'; connect-src 'self' https://your-backend-url.com;"
   }
   ```

3. Rebuild your Chrome extension
4. Test the connection between your extension and backend

## Security Best Practices

1. Always use HTTPS for your backend in production
2. Restrict CORS to only your Chrome extension
3. Implement rate limiting to prevent abuse
4. Monitor your API usage to avoid unexpected charges
5. Consider adding authentication for additional security 