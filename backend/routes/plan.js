import express from 'express';

const router = express.Router();

// GET /plan - Get saved learning plan
router.get('/', (req, res) => {
  // Will be implemented in Step 10
  res.json({ message: 'Get learning plan endpoint' });
});

// POST /plan - Save learning plan
router.post('/', (req, res) => {
  res.json({ message: 'Save learning plan endpoint' });
});

export default router;

