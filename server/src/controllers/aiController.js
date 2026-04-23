import { enhanceResume } from '../services/aiService.js';

export async function enhance(req, res, next) {
  try {
    const {
      summary,
      skills,
      experience,
      projects,
      education
    } = req.body;
    const result = await enhanceResume({
      summary,
      skills,
      experience,
      projects,
      education
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
