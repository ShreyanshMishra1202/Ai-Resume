import { enhanceResume } from '../services/aiService.js';

export async function enhance(req, res, next) {
  try {
    const { summary, skills } = req.body;
    const result = await enhanceResume({ summary, skills });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
