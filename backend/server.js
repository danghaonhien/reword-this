import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());

// Configure CORS to only allow requests from your extension
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

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

// API route for rewrite battle (multiple versions)
app.post('/api/rewrite-battle', async (req, res) => {
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
    
    // Parse the response to extract Version A and Version B
    const versionAMatch = response.match(/Version A[:\s]*(.+?)(?=Version B|$)/is);
    const versionBMatch = response.match(/Version B[:\s]*(.+?)$/is);
    
    if (!versionAMatch || !versionBMatch) {
      console.warn('Battle response parsing issue:', response);
    }
    
    return res.json({
      versionA: versionAMatch?.[1]?.trim() || 'Failed to generate Version A. Please try again.',
      versionB: versionBMatch?.[1]?.trim() || 'Failed to generate Version B. Please try again.'
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 