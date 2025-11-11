import express from 'express';

const router = express.Router();

// GET /learn?skill=Docker -> Get YouTube tutorials for a skill
router.get('/', (req, res) => {
  res.json({ message: 'YouTube tutorial endpoint' });
});

export default router;

