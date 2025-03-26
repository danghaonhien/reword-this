# Reword This - Backend Server

This is the backend server for the "Reword This" Chrome extension. It securely handles API calls to OpenAI without exposing your API key in the client-side code.

## Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if not already done)
   - Add your OpenAI API key
   - Update the ALLOWED_ORIGINS with your Chrome extension ID

4. Start the server:
   ```
   npm start
   ```

For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /health`: Health check endpoint
- `POST /api/rewrite`: Endpoint for text rewriting
- `POST /api/rewrite-battle`: Endpoint for generating two rewrite alternatives

## Deployment

For production, you can deploy this server to:
- Heroku
- Vercel
- Railway
- Render
- AWS (EC2 or Lambda)
- Any other Node.js hosting service

Remember to set up the environment variables on your hosting service.

## Security

This server:
- Uses CORS to restrict access to your Chrome extension
- Keeps your API key secure on the server side
- Validates inputs before processing them 