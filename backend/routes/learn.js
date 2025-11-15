import express from 'express';
import { searchYouTubeTutorials, getTutorialsForSkills } from '../utils/youtube.js';

const router = express.Router();

// GET /learn?skill=Docker -> Get YouTube tutorials for a skill
router.get('/', async (req, res, next) => {
  try {
    const { skill, skills, maxResults } = req.query;

    // If single skill provided
    if (skill) {
      const maxResultsNum = parseInt(maxResults) || 5;
      const videos = await searchYouTubeTutorials(skill, maxResultsNum);
      
      return res.json({
        success: true,
        skill,
        videos,
        count: videos.length,
      });
    }

    // If multiple skills provided (comma-separated or array)
    if (skills) {
      const skillList = Array.isArray(skills) 
        ? skills 
        : skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      if (skillList.length === 0) {
        return res.status(400).json({ error: 'No valid skills provided' });
      }

      const maxResultsPerSkill = parseInt(maxResults) || 3;
      const tutorialsMap = await getTutorialsForSkills(skillList, maxResultsPerSkill);

      // Convert Map to object for JSON response
      const tutorials = {};
      tutorialsMap.forEach((videos, skillName) => {
        tutorials[skillName] = videos;
      });

      return res.json({
        success: true,
        skills: skillList,
        tutorials,
        totalVideos: Array.from(tutorialsMap.values()).reduce((sum, videos) => sum + videos.length, 0),
      });
    }

    // No skill(s) provided
    res.status(400).json({ 
      error: 'Either "skill" or "skills" query parameter is required' 
    });
  } catch (error) {
    next(error);
  }
});

export default router;

