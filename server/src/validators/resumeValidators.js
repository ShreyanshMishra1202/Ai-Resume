import { z } from 'zod';

export const resumeSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email('Email is invalid').optional(),
  phone: z.string().min(6).optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  projects: z.string().optional(),
  summary: z.string().optional()
});

export const resumeUpdateSchema = resumeSchema.partial();
