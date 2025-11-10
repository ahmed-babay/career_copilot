import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Career Copilot API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});
