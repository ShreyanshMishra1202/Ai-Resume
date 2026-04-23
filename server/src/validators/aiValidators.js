import { z } from 'zod';

export const aiEnhanceSchema = z.object({
  summary: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  projects: z.string().optional(),
  education: z.string().optional()
});
