import express from 'express';

const router = express.Router();

// POST /analyze/text - Extract skills from text
router.post('/text', (req, res) => {
  res.json({ message: 'Skill extraction endpoint' });
});

export default router;

