import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import analyzeRoutes from './routes/analyze.js';
import compareRoutes from './routes/compare.js';
import learnRoutes from './routes/learn.js';
import planRoutes from './routes/plan.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS configuration - allow requests from Next.js frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions)); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Career Copilot API is running' });
});

app.use('/analyze', analyzeRoutes);
app.use('/compare', compareRoutes);
app.use('/learn', learnRoutes);
app.use('/plan', planRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});
