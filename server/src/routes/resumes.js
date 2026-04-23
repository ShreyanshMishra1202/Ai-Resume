import { Router } from 'express';
import {
  createResume,
  deleteResume,
  getResume,
  listResumes,
  updateResume
} from '../controllers/resumeController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', listResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
