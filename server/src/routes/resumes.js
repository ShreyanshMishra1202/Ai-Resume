import { Router } from 'express';
import {
  createResume,
  deleteResume,
  getResume,
  listResumes,
  updateResume
} from '../controllers/resumeController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { resumeSchema, resumeUpdateSchema } from '../validators/resumeValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', listResumes);
router.post('/', validate(resumeSchema), createResume);
router.get('/:id', getResume);
router.put('/:id', validate(resumeUpdateSchema), updateResume);
router.delete('/:id', deleteResume);

export default router;
