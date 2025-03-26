import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "connect-src 'self' https://*.vercel.app https://*.render.com; " +
    "img-src 'self' data: https:;"
  );
  next();
});

// Parse JSON bodies
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API server is running',
    timestamp: new Date().toISOString()
  });
});

// Rewrite endpoint
app.post('/api/rewrite', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const completion = await openai.chat.completions.create({
      model: process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(process.env.MAX_TOKENS || '1000'),
      temperature: 0.7,
    });
    
    const response = completion.choices[0]?.message?.content || '';
    
    return res.json({ response });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
});

// Serve a simple HTML page for the root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reword This API</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>Reword This API</h1>
      <p>This is the API server for the Reword This application.</p>
      <h2>Available Endpoints:</h2>
      <ul>
        <li><code>GET /api/health</code> - Health check endpoint</li>
        <li><code>POST /api/rewrite</code> - Text rewriting endpoint</li>
      </ul>
      <p>Server Time: ${new Date().toISOString()}</p>
    </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 