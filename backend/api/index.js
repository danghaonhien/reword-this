import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [];
console.log('Configured allowed origins:', allowedOrigins); // Debug log

// Use the cors middleware with proper configuration
app.use(cors({
  origin: function(origin, callback) {
    console.log('Request from origin:', origin); // Debug log
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin provided, allowing request');
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed:', origin);
      return callback(null, true);
    }

    console.log('Origin blocked:', origin);
    console.log('Allowed origins:', allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Authorization'
  ],
  maxAge: 86400 // 24 hours
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API route for text rewriting
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

// Start the server in development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('CORS configuration:');
    console.log('Allowed origins:', allowedOrigins);
  });
}

// Export the Express app for Vercel
export default app; 