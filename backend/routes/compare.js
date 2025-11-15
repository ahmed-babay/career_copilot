import express from 'express';
import { compareSkills } from '../utils/skillComparator.js';

const router = express.Router();

// POST /compare - Compare CV skills with job description skills
router.post('/', async (req, res, next) => {
  try {
    const { cvText, jdText, threshold, matchThreshold } = req.body;

    // Validate input
    if (!cvText || typeof cvText !== 'string') {
      return res.status(400).json({ error: 'cv is required and must be a string' });
    }

    if (!jdText || typeof jdText !== 'string') {
      return res.status(400).json({ error: 'job description Text is required and must be a string' });
    }

    // Use provided thresholds or defaults
    const similarityThreshold = parseFloat(threshold) || 0.5;
    const matchingThreshold = parseFloat(matchThreshold) || 0.6;

    // Compare skills
    const comparison = await compareSkills(
      cvText,
      jdText,
      similarityThreshold,
      matchingThreshold
    );

    res.json({
      success: true,
      ...comparison,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

