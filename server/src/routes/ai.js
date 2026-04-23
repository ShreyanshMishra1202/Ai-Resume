import { Router } from 'express';
import { enhance } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { aiEnhanceSchema } from '../validators/aiValidators.js';

const router = Router();

router.post('/enhance', requireAuth, validate(aiEnhanceSchema), enhance);

export default router;
