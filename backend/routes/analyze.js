import express from 'express';
import { upload } from '../middleware/upload.js';
import { extractTextFromFile, cleanText } from '../utils/cvParser.js';
import { extractSkillsFromText } from '../utils/skillExtractor.js';

const router = express.Router();

// POST /analyze/upload - Extract text and skills from uploaded CV file (PDF/TXT)
router.post('/upload', upload.single('cv'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype } = req.file;
    const threshold = parseFloat(req.body.threshold) || 0.6;
    
    // Extract text from the file
    const rawText = await extractTextFromFile(buffer, mimetype);
    const cleanedText = cleanText(rawText);

    // Extract skills from the text
    const skills = await extractSkillsFromText(cleanedText, threshold);

    res.json({
      success: true,
      text: cleanedText,
      fileType: mimetype,
      textLength: cleanedText.length,
      skills: skills,
      skillsCount: skills.length,
    });
  } catch (error) {
    next(error);
  }
});

// POST /analyze/text - Extract skills from pasted text
router.post('/text', async (req, res, next) => {
  try {
    const { text, threshold } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const similarityThreshold = parseFloat(threshold) || 0.6;
    const cleanedText = cleanText(text);
    
    // Extract skills from the text
    const skills = await extractSkillsFromText(cleanedText, similarityThreshold);
    
    res.json({
      success: true,
      text: cleanedText,
      textLength: cleanedText.length,
      skills: skills,
      skillsCount: skills.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

