import express from 'express';

const router = express.Router();

// POST /compare - Compare CV skills with job description skills
router.post('/', (req, res) => {
  res.json({ message: 'Skill comparison endpoint' });
});

export default router;

