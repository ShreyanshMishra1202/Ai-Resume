import { z } from 'zod';

export const aiEnhanceSchema = z.object({
  summary: z.string().optional(),
  skills: z.string().optional()
});
