import express from 'express';
import { upload } from '../middleware/upload.js';
import { extractTextFromFile, cleanText } from '../utils/cvParser.js';

const router = express.Router();

// POST /analyze/text - Extract text from uploaded CV file (PDF/TXT)
router.post('/upload', upload.single('cv'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype } = req.file;
    
    // Extract text from the file
    const rawText = await extractTextFromFile(buffer, mimetype);
    const cleanedText = cleanText(rawText);

    res.json({
      success: true,
      text: cleanedText,
      fileType: mimetype,
      textLength: cleanedText.length,
    });
  } catch (error) {
    next(error);
  }
});

// POST /analyze/text - Extract skills from text (for pasted text)
router.post('/text', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  const cleanedText = cleanText(text);
  
  res.json({
    success: true,
    text: cleanedText,
    textLength: cleanedText.length,
  });
});

export default router;

