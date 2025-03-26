# Reword This - Chrome Extension

A Chrome extension that helps users improve their writing with AI-powered text rewriting capabilities.

## Features

- **Simple Text Rewriting**: Quickly rewrite selected text with different tone options (Clarity, Friendly, Formal, or Surprise Me)
- **Battle of Rewrites**: Compare two AI-generated rewrites side-by-side and choose the best one
- **Custom Tone Builder**: Create rewrites by providing a reference sample text in your desired tone or style
- **Gamification**: Earn XP and build streaks as you use the extension to improve your writing
- **Context Menu Integration**: Right-click on any selected text on the web to open the extension
- **Secure Backend**: Uses a dedicated backend server to securely handle API requests without exposing your API key

## Installation

### Development Mode

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the backend server (required for API calls):
   ```
   cd backend
   npm install
   # Configure your .env file with your API key
   npm run dev
   ```
4. In a new terminal, run the extension development server:
   ```
   npm run dev
   ```
5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Production Build

1. Deploy the backend server (see `backend/DEPLOYMENT.md` for instructions)
2. Update your extension's `.env` file with your production backend URL
3. Build the extension:
   ```
   npm run build
   ```
4. The built extension will be in the `dist` folder
5. Load it in Chrome as described above or package it for the Chrome Web Store

## Backend Server

The project includes a secure backend server that handles API requests to OpenAI, keeping your API key secure and away from client-side code. Key features:

- Secure API key storage using environment variables
- CORS protection to ensure only your Chrome extension can access the API
- Simplified API endpoints for text rewriting and rewrite battles
- Easy deployment to various hosting platforms

For backend setup and deployment instructions, see:
- `backend/README.md` for local setup
- `backend/DEPLOYMENT.md` for deployment options

## Usage

1. Select text on any webpage
2. Right-click and select "Reword This" from the context menu
3. Use the popup to select your desired tone
4. Click "Reword This!" to generate a rewritten version
5. Use "Battle of Rewrites" to compare two different rewrites
6. Use "Custom Tone" to create a rewrite based on a reference sample

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS, CRXJS
- **Backend**: Node.js, Express, OpenAI API

## Project Structure

- `src/`: Extension source code
  - `components/`: UI components
  - `hooks/`: Custom React hooks
  - `pages/`: Top-level page components
  - `background.ts`: Chrome extension background script
  - `content.ts`: Chrome extension content script
  - `manifest.json`: Chrome extension manifest
- `backend/`: Backend server code
  - `server.js`: Main server file
  - `README.md`: Backend setup instructions
  - `DEPLOYMENT.md`: Deployment guide

## Development

This project uses Vite for fast development and building. Key commands:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## License

MIT 